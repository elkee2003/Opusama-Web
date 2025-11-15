// api/webhook.js
import crypto from "crypto";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import AWS from "aws-sdk";

export const config = {
  api: {
    bodyParser: false, // Required for signature verification
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    // ============================================================
    // 1. READ RAW BODY FIRST — BEFORE ANY OTHER CODE
    // ============================================================
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks);

    // ============================================================
    // 2. LOAD ENV VARS
    // ============================================================
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

    // ============================================================
    // 3. VERIFY PAYSTACK SIGNATURE
    // ============================================================
    const computedHash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    if (computedHash !== req.headers["x-paystack-signature"]) {
      console.error("❌ Invalid webhook signature");
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(rawBody.toString("utf8"));
    if (event.event !== "charge.success") {
      console.log("Ignored event:", event.event);
      return res.status(200).send("Ignored");
    }

    const reference = event.data.reference;
    console.log("🔔 Webhook received for:", reference);

    // ============================================================
    // 4. RE-VERIFY WITH PAYSTACK
    // ============================================================
    const verifyRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
    );

    const verified = verifyRes.data.data;
    if (!verified || verified.status !== "success") {
      console.error("❌ Payment not verified");
      return res.status(400).send("Payment not verified");
    }

    console.log("✅ Paystack transaction verified:", verified.reference);

    // ============================================================
    // 5. FIND BOOKING IN DATSTORE (must include _version)
    // ============================================================
    const findQuery = `
      query FindBooking($reference: String!) {
        listBookings(filter: { transactionReference: { eq: $reference } }) {
          items {
            id
            _version
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
      { headers: { "x-api-key": APPSYNC_API_KEY, "Content-Type": "application/json" } }
    );

    const items = findRes.data.data.listBookings.items;

    if (!items.length) {
      console.error("❌ Booking not found:", reference);
      return res.status(404).send("Booking not found");
    }

    const booking = items[0];
    console.log("🟢 Booking found:", booking.id, "version:", booking._version);

    // ============================================================
    // 6. GENERATE UUID TICKET + QR PNG BUFFER
    // ============================================================
    const ticketId = `TICKET-${uuidv4()}`;

    const qrPayload = JSON.stringify({
      ticketId,
      bookingId: booking.id,
      reference,
      propertyType: booking.propertyType || "",
      accommodationType: booking.accommodationType || "",
    });

    const qrBuffer = await QRCode.toBuffer(qrPayload, {
      type: "png",
      width: 400,
    });

    // ============================================================
    // 7. UPLOAD QR TO S3
    // ============================================================
    const fileKey = `public/qrCodes/${ticketId}.png`;

    await s3
      .putObject({
        Bucket: S3_BUCKET,
        Key: fileKey,
        Body: qrBuffer,
        ContentType: "image/png",
        ACL: "public-read",
      })
      .promise();

    const qrUrl = `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${fileKey}`;
    console.log("📦 QR uploaded:", qrUrl);

    // ============================================================
    // 8. UPDATE BOOKING IN APPSYNC
    // ============================================================
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
      { headers: { "x-api-key": APPSYNC_API_KEY } }
    );

    console.log("🔥 Booking updated:", updateRes.data.data.updateBooking);

    // ============================================================
    // 9. SEND EMAILS (GUEST + VENDOR)
    // ============================================================

    // Guest email
    try {
      const guestLambda =
        "https://qti5lr8sb2.execute-api.eu-north-1.amazonaws.com/staging/sendGuestTicket-staging";

      await axios.post(
        guestLambda,
        {
          guestEmail: booking.guestEmail,
          guestName: `${booking.clientFirstName} ${booking.clientLastName}`,
          numberOfPeople: booking.numberOfPeople,
          propertyName:
            booking.propertyType || booking.accommodationType || "Accommodation",
          ticketId,
          qrUrl,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("📧 Guest email sent");
    } catch (e) {
      console.error("❌ Guest email error:", e.message);
    }

    // Vendor email
    try {
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
        { headers: { "x-api-key": APPSYNC_API_KEY } }
      );

      const realtor = realtorRes.data.data.getRealtor;

      if (realtor?.email) {
        const vendorLambda =
          "https://qti5lr8sb2.execute-api.eu-north-1.amazonaws.com/staging/notifyVendorBooking-staging";

        await axios.post(
          vendorLambda,
          {
            realtorEmail: realtor.email,
            realtorName: realtor.firstName,
            guestName: `${booking.clientFirstName} ${booking.clientLastName}`,
            propertyName:
              booking.propertyType || booking.accommodationType || "Accommodation",
            totalAmount: booking.realtorPrice || booking.overAllPrice,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        console.log("📧 Vendor email sent");
      }
    } catch (e) {
      console.error("❌ Vendor email error:", e.message);
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Webhook error:", err.message || err);
    return res.status(500).send("Server Error");
  }
}
