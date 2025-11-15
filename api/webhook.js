// api/webhook.js
import crypto from "crypto";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import AWS from "aws-sdk";

export const config = {
  api: { bodyParser: false }, // keep raw body for signature verification
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    // -------------------------
    // 1) Read raw body
    // -------------------------
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBodyBuffer = Buffer.concat(chunks);
    const rawBodyString = rawBodyBuffer.toString("utf8");

    // -------------------------
    // 2) Load env vars
    // -------------------------
    const PAYSTACK_SECRET =
      process.env.PAYSTACK_SECRET_KEY_LIVE || process.env.PAYSTACK_SECRET_KEY;
    const APPSYNC_API_URL = process.env.APPSYNC_API_URL;
    const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY;
    const S3_BUCKET = process.env.S3_BUCKET;
    const AWS_REGION = process.env.AWS_REGION || "eu-north-1";
    const GUEST_EMAIL_LAMBDA = process.env.GUEST_EMAIL_LAMBDA;
    const VENDOR_EMAIL_LAMBDA = process.env.VENDOR_EMAIL_LAMBDA;

    // Basic check for required envs
    if (!PAYSTACK_SECRET) {
      console.error("Missing PAYSTACK_SECRET_KEY_LIVE / PAYSTACK_SECRET_KEY");
      return res.status(500).send("Server misconfigured");
    }
    if (!APPSYNC_API_URL || !APPSYNC_API_KEY) {
      console.error("Missing APPSYNC_API_URL/APPSYNC_API_KEY");
      return res.status(500).send("Server misconfigured");
    }
    if (!S3_BUCKET) {
      console.error("Missing S3_BUCKET");
      return res.status(500).send("Server misconfigured");
    }

    // -------------------------
    // 3) Verify Paystack signature
    // -------------------------
    const computedHash = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(rawBodyBuffer)
      .digest("hex");

    const incomingSignature = req.headers["x-paystack-signature"];
    if (!incomingSignature || incomingSignature !== computedHash) {
      console.error("Invalid Paystack signature", { incomingSignature, computedHash });
      return res.status(400).send("Invalid signature");
    }

    // -------------------------
    // 4) Parse event and check type
    // -------------------------
    const event = JSON.parse(rawBodyString);
    if (event.event !== "charge.success") {
      console.log("Ignored Paystack event:", event.event);
      return res.status(200).send("Ignored non-charge.success event");
    }

    const reference = event.data?.reference;
    if (!reference) {
      console.error("No reference in event");
      return res.status(400).send("Bad payload");
    }

    console.log("Webhook received for reference:", reference);

    // -------------------------
    // 5) Re-verify payment with Paystack API
    // -------------------------
    const verifyRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    );

    const verified = verifyRes.data?.data;
    if (!verified || verified.status !== "success") {
      console.error("Paystack verification failed for", reference, verified);
      return res.status(400).send("Payment not verified");
    }

    console.log("Paystack transaction verified:", verified.reference);

    // -------------------------
    // 6) Find booking in AppSync (include _version)
    // -------------------------
    const findQuery = `
      query FindBooking($reference: String!) {
        listBookings(filter: { transactionReference: { eq: $reference } }) {
          items {
            id
            _version
            guestEmail
            clientFirstName
            clientLastName
            numberOfPeople
            propertyType
            accommodationType
            realtorID
            overAllPrice
            realtorPrice
          }
        }
      }
    `;

    const findRes = await axios.post(
      APPSYNC_API_URL,
      { query: findQuery, variables: { reference } },
      { headers: { "x-api-key": APPSYNC_API_KEY, "Content-Type": "application/json" } }
    );

    const bookingItems = findRes.data?.data?.listBookings?.items || [];
    if (!bookingItems.length) {
      console.error("No booking found for transactionReference:", reference);
      return res.status(404).send("Booking not found");
    }

    const booking = bookingItems[0];
    console.log("Booking found:", booking.id, "version:", booking._version);

    // -------------------------
    // 7) Generate ticket ID and QR PNG buffer
    // -------------------------
    const ticketId = `TICKET-${uuidv4()}`; // your requested pattern
    const qrPayload = JSON.stringify({
      ticketId,
      bookingId: booking.id,
      reference,
      propertyType: booking.propertyType || "",
      accommodationType: booking.accommodationType || "",
    });

    // generate PNG buffer (400px)
    const qrBuffer = await QRCode.toBuffer(qrPayload, { type: "png", width: 400 });

    // -------------------------
    // 8) Upload PNG to S3 at public/qrCodes/${ticketId}.png
    // -------------------------
    // Configure AWS SDK with Vercel env keys
    AWS.config.update({
      region: AWS_REGION,
      accessKeyId: process.env.VERCEL_WEBHOOK_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.VERCEL_WEBHOOK_AWS_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3();

    const fileKey = `public/qrCodes/${ticketId}.png`;

    await s3
      .putObject({
        Bucket: S3_BUCKET,
        Key: fileKey,
        Body: qrBuffer,
        ContentType: "image/png",
        ACL: "public-read", // remove or change if you manage access differently
      })
      .promise();

    const qrUrl = `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${encodeURIComponent(fileKey)}`;
    console.log("QR uploaded to S3:", qrUrl);

    // -------------------------
    // 9) Update booking via AppSync (must include _version)
    // -------------------------
    const updateMutation = `
      mutation UpdateBooking($input: UpdateBookingInput!) {
        updateBooking(input: $input) {
          id
          status
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
      { headers: { "x-api-key": APPSYNC_API_KEY, "Content-Type": "application/json" } }
    );

    console.log("Booking updated in AppSync:", updateRes.data?.data?.updateBooking);

    // -------------------------
    // 10) Send guest email (lambda)
    // -------------------------
    try {
      if (GUEST_EMAIL_LAMBDA) {
        const guestPayload = {
          guestEmail: booking.guestEmail,
          guestName: `${booking.clientFirstName || ""} ${booking.clientLastName || ""}`.trim() || "Guest",
          numberOfPeople: booking.numberOfPeople || 1,
          propertyName: booking.propertyType || booking.accommodationType || "Accommodation",
          ticketId,
          qrUrl,
        };

        const guestRes = await axios.post(GUEST_EMAIL_LAMBDA, guestPayload, {
          headers: { "Content-Type": "application/json" },
        });

        console.log("Guest email lambda response:", guestRes.status);
      } else {
        console.warn("GUEST_EMAIL_LAMBDA not configured - skipping guest email");
      }
    } catch (e) {
      console.error("Failed to send guest email:", e.response?.data || e.message || e);
    }

    // -------------------------
    // 11) Send vendor email (lambda) - fetch realtor first
    // -------------------------
    try {
      if (VENDOR_EMAIL_LAMBDA && booking.realtorID) {
        const realtorQuery = `
          query GetRealtor($id: ID!) {
            getRealtor(id: $id) {
              firstName
              email
            }
          }
        `;

        const realtorRes = await axios.post(
          APPSYNC_API_URL,
          { query: realtorQuery, variables: { id: booking.realtorID } },
          { headers: { "x-api-key": APPSYNC_API_KEY, "Content-Type": "application/json" } }
        );

        const realtor = realtorRes.data?.data?.getRealtor;
        if (realtor?.email) {
          const vendorPayload = {
            realtorEmail: realtor.email,
            realtorName: realtor.firstName || "",
            guestName: `${booking.clientFirstName || ""} ${booking.clientLastName || ""}`.trim() || "Guest",
            propertyName: booking.propertyType || booking.accommodationType || "Accommodation",
            totalAmount: booking.realtorPrice || booking.overAllPrice || 0,
            ticketId,
            qrUrl,
          };

          const vendorRes = await axios.post(VENDOR_EMAIL_LAMBDA, vendorPayload, {
            headers: { "Content-Type": "application/json" },
          });

          console.log("Vendor email lambda response:", vendorRes.status);
        } else {
          console.warn("Realtor email not found - skipping vendor email");
        }
      } else {
        console.warn("VENDOR_EMAIL_LAMBDA not configured or realtorID missing - skipping vendor email");
      }
    } catch (e) {
      console.error("Failed to send vendor email:", e.response?.data || e.message || e);
    }

    // All done
    return res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook processing error:", err.response?.data || err.message || err);
    return res.status(500).send("Server Error");
  }
}
