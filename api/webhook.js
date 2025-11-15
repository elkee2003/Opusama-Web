// api/webhook.js
import crypto from "crypto";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import AWS from "aws-sdk";

export const config = {
  api: {
    bodyParser: false, // required to verify signature against raw body
  },
};

const PAYSTACK_SECRET_KEY =
  process.env.PAYSTACK_SECRET_KEY_LIVE || process.env.PAYSTACK_SECRET_KEY;

const APPSYNC_API_URL = process.env.APPSYNC_API_URL;
const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY;

const S3_BUCKET = process.env.S3_BUCKET;
const AWS_REGION = process.env.AWS_REGION || "eu-north-1";

AWS.config.update({
  region: AWS_REGION,
  accessKeyId: process.env.VERCEL_WEBHOOK_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.VERCEL_WEBHOOK_AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    // read raw body buffer
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks);

    // compute signature
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    const incomingSignature = req.headers["x-paystack-signature"];
    if (!incomingSignature || hash !== incomingSignature) {
      console.error("❌ Invalid webhook signature");
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(rawBody.toString("utf8"));

    // handle only charge.success
    if (event.event !== "charge.success") {
      console.log("Ignored event:", event.event);
      return res.status(200).send("Ignored");
    }

    const reference = event.data.reference;
    console.log("✅ Webhook received for reference:", reference);

    // Re-verify with Paystack
    const verifyRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
    );

    const verified = verifyRes.data?.data;
    if (!verified || verified.status !== "success") {
      console.error("❌ Paystack verification failed for", reference);
      return res.status(400).send("Payment not verified");
    }

    console.log("✅ Paystack verified:", verified.reference);

    // --- STEP 1: find booking by transactionReference (include _version) ---
    const findQuery = `
      query FindBooking($reference: String!) {
        listBookings(filter: { transactionReference: { eq: $reference } }) {
          items {
            id
            _version
            status
            transactionReference
            userID
            realtorID
            clientFirstName
            clientLastName
            guestEmail
            numberOfPeople
            propertyType
            accommodationType
            overAllPrice
            realtorPrice
          }
        }
      }
    `;

    const findRes = await axios.post(
      APPSYNC_API_URL,
      { query: findQuery, variables: { reference } },
      {
        headers: { "x-api-key": APPSYNC_API_KEY, "Content-Type": "application/json" },
      }
    );

    const items = findRes.data?.data?.listBookings?.items || [];
    if (!items.length) {
      console.error("❌ No booking matched transactionReference:", reference);
      return res.status(404).send("Booking not found");
    }

    const booking = items[0];
    console.log("🟢 Booking found:", booking.id, "version:", booking._version);

    // --- STEP 2: Generate ticket ID and QR PNG buffer ---
    const ticketId = `TICKET-${uuidv4()}`;
    // Prepare QR payload: you can include whatever data you want inside QR
    const qrData = JSON.stringify({
      ticketId,
      bookingId: booking.id,
      reference: reference,
      propertyType: booking.propertyType || "",
      accommodationType: booking.accommodationType || "",
    });

    // Generate PNG buffer
    const qrPngBuffer = await QRCode.toBuffer(qrData, { type: "png", width: 400 });

    // --- STEP 3: Upload to S3 ---
    const fileKey = `public/qrCodes/${ticketId}.png`;

    const putParams = {
      Bucket: S3_BUCKET,
      Key: fileKey,
      Body: qrPngBuffer,
      ContentType: "image/png",
      ACL: "public-read", // use only if your bucket permits public read; otherwise omit and serve via signed URL or CloudFront
    };

    await s3.putObject(putParams).promise();

    // Construct a public URL (adjust if you use CloudFront / custom domain)
    const qrUrl = `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${encodeURIComponent(fileKey)}`;
    console.log("🟢 Uploaded QR to S3:", qrUrl);

    // --- STEP 4: Update booking in AppSync (must include _version) ---
    const updateMutation = `
      mutation UpdateBooking($input: UpdateBookingInput!) {
        updateBooking(input: $input) {
          id
          status
          transactionReference
          transactionStatus
          ticketID
          qrCodeUrl
          ticketStatus
          _version
        }
      }
    `;

    const updateVars = {
      input: {
        id: booking.id,
        _version: booking._version,
        status: "PAID",
        transactionStatus: "Successful",
        ticketID: ticketId,
        qrCodeUrl: qrUrl,
        ticketStatus: "UNUSED",
      },
    };

    const updateRes = await axios.post(
      APPSYNC_API_URL,
      { query: updateMutation, variables: updateVars },
      {
        headers: { "x-api-key": APPSYNC_API_KEY, "Content-Type": "application/json" },
      }
    );

    console.log("✅ Booking updated via AppSync:", updateRes.data?.data?.updateBooking);

    // --- STEP 5: Fetch Realtor info so we can notify vendor (if needed) ---
    // If your GraphQL schema exposes getRealtor query:
    const getRealtorQuery = `
      query GetRealtor($id: ID!) {
        getRealtor(id: $id) {
          id
          firstName
          lastName
          email
        }
      }
    `;

    let realtor = null;
    if (booking.realtorID) {
      try {
        const realtorRes = await axios.post(
          APPSYNC_API_URL,
          { query: getRealtorQuery, variables: { id: booking.realtorID } },
          { headers: { "x-api-key": APPSYNC_API_KEY, "Content-Type": "application/json" } }
        );
        realtor = realtorRes.data?.data?.getRealtor || null;
      } catch (e) {
        console.warn("⚠️ Could not fetch realtor info:", e?.message || e);
      }
    }

    // --- STEP 6: Call your existing email Lambdas (same payload shapes used in payment.jsx) ---
    // Guest email
    try {
      const lambdaGuestUrl = "https://qti5lr8sb2.execute-api.eu-north-1.amazonaws.com/staging/sendGuestTicket-staging";
      const guestPayload = {
        guestEmail: booking.guestEmail || null,
        guestName: `${booking.clientFirstName || ""} ${booking.clientLastName || ""}`.trim() || "Guest",
        numberOfPeople: booking.numberOfPeople || 1,
        propertyName: booking.propertyType || booking.accommodationType || "Accommodation",
        ticketId,
        qrUrl,
      };

      // include eventName only if propertyType === 'event' (case-insensitive)
      if ((booking.propertyType || "").toLowerCase() === "event" && event.data?.eventName) {
        guestPayload.eventName = event.data.eventName;
      }

      const guestRes = await axios.post(lambdaGuestUrl, guestPayload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("📧 Guest email lambda response:", guestRes.status);
    } catch (e) {
      console.error("❌ Failed to send guest email:", e?.message || e);
    }

    // Vendor email (notify landlord/realtor)
    try {
      if (realtor && realtor.email) {
        const lambdaVendorUrl = "https://qti5lr8sb2.execute-api.eu-north-1.amazonaws.com/staging/notifyVendorBooking-staging";
        const vendorPayload = {
          realtorEmail: realtor.email,
          realtorName: realtor.firstName || "",
          guestName: `${booking.clientFirstName || ""} ${booking.clientLastName || ""}`.trim() || "Guest",
          propertyName: booking.propertyType || booking.accommodationType || "Accommodation",
          totalAmount: booking.realtorPrice || booking.overAllPrice || 0,
        };

        if ((booking.propertyType || "").toLowerCase() === "event" && event.data?.eventName) {
          vendorPayload.eventName = event.data.eventName;
        }

        const vendorRes = await axios.post(lambdaVendorUrl, vendorPayload, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("📧 Vendor email lambda response:", vendorRes.status);
      } else {
        console.warn("No realtor email found; skipping vendor notification.");
      }
    } catch (e) {
      console.error("❌ Failed to send vendor email:", e?.message || e);
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Webhook error:", err.response?.data || err.message || err.stack);
    return res.status(500).send("Server Error");
  }
}
