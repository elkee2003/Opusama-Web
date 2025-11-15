// api/webhook.js
import crypto from "crypto";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import AWS from "aws-sdk";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    // ------------------------------------------------------------
    // READ RAW BODY
    // ------------------------------------------------------------
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks);

    // ------------------------------------------------------------
    // LOAD ENV VARS
    // ------------------------------------------------------------
    const PAYSTACK_SECRET =
      process.env.PAYSTACK_SECRET_KEY_LIVE ||
      process.env.PAYSTACK_SECRET_KEY;

    const APPSYNC_API_URL = process.env.APPSYNC_API_URL;
    const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY;

    const AWS_REGION = process.env.AWS_REGION || "eu-north-1";
    const S3_BUCKET = process.env.S3_BUCKET;

    AWS.config.update({
      region: AWS_REGION,
      accessKeyId: process.env.VERCEL_WEBHOOK_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.VERCEL_WEBHOOK_AWS_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3();

    // ------------------------------------------------------------
    // VERIFY PAYSTACK SIGNATURE
    // ------------------------------------------------------------
    const computed = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (computed !== req.headers["x-paystack-signature"]) {
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(rawBody.toString("utf8"));
    if (event.event !== "charge.success") {
      return res.status(200).send("Ignored");
    }

    const reference = event.data.reference;

    // ------------------------------------------------------------
    // RE-VERIFY PAYMENT
    // ------------------------------------------------------------
    const verifyRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    );

    const verified = verifyRes.data.data;
    if (!verified || verified.status !== "success") {
      return res.status(400).send("Payment not verified");
    }

    // ------------------------------------------------------------
    // FIND BOOKING BY REFERENCE
    // ------------------------------------------------------------
    const findQuery = `
      query FindBooking($reference: String!) {
        listBookings(filter: { transactionReference: { eq: $reference } }) {
          items {
            id
            _version
            realtorID
            guestEmail
            clientFirstName
            clientLastName
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
      {
        query: findQuery,
        variables: { reference },
      },
      { headers: { "x-api-key": APPSYNC_API_KEY } }
    );

    const items = findRes.data.data.listBookings.items;
    if (!items.length) {
      return res.status(404).send("Booking not found");
    }

    const booking = items[0];

    // ------------------------------------------------------------
    // GENERATE NEW TICKET ID + QR CODE
    // ------------------------------------------------------------
    const ticketId = `TICKET-${uuidv4()}`;

    const qrPayload = JSON.stringify({
      ticketId,
      bookingId: booking.id,
      reference,
    });

    const qrBuffer = await QRCode.toBuffer(qrPayload, {
      type: "png",
      width: 400,
    });

    // ------------------------------------------------------------
    // UPLOAD TO S3
    // ------------------------------------------------------------
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

    // ------------------------------------------------------------
    // UPDATE BOOKING IN APPSYNC
    // ------------------------------------------------------------
    const updateMutation = `
      mutation UpdateBooking($input: UpdateBookingInput!) {
        updateBooking(input: $input) {
          id
          ticketID
          qrCodeUrl
          status
          ticketStatus
          transactionStatus
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

    await axios.post(
      APPSYNC_API_URL,
      { query: updateMutation, variables: updateVars },
      { headers: { "x-api-key": APPSYNC_API_KEY } }
    );

    // ------------------------------------------------------------
    // SEND GUEST EMAIL
    // ------------------------------------------------------------
    try {
      await axios.post(
        process.env.GUEST_EMAIL_LAMBDA,
        {
          guestEmail: booking.guestEmail,
          guestName: `${booking.clientFirstName} ${booking.clientLastName}`,
          numberOfPeople: booking.numberOfPeople,
          propertyName:
            booking.propertyType ||
            booking.accommodationType ||
            "Accommodation",
          ticketId,
          qrUrl,
        }
      );
    } catch (e) {
      console.error("Guest email error:", e.message);
    }

    // ------------------------------------------------------------
    // SEND VENDOR EMAIL
    // ------------------------------------------------------------
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
        {
          query: realtorQuery,
          variables: { id: booking.realtorID },
        },
        { headers: { "x-api-key": APPSYNC_API_KEY } }
      );

      const realtor = realtorRes.data.data.getRealtor;

      if (realtor?.email) {
        await axios.post(process.env.VENDOR_EMAIL_LAMBDA, {
          realtorEmail: realtor.email,
          realtorName: realtor.firstName,
          guestName: `${booking.clientFirstName} ${booking.clientLastName}`,
          propertyName:
            booking.propertyType ||
            booking.accommodationType ||
            "Accommodation",
          totalAmount: booking.realtorPrice || booking.overAllPrice,
        });
      }
    } catch (e) {
      console.error("Vendor email error:", e.message);
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).send("Server Error");
  }
}
