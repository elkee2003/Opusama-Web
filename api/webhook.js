// Note that in this webhook, qrcode is saved externally, and not in s3 (if page refreshes after debt of money from bank)

import crypto from "crypto";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

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
    const rawBody = Buffer.concat(chunks).toString("utf8");

    console.log("Raw body:", rawBody);

    // ------------------------------------------------------------
    // VERIFY PAYSTACK SIGNATURE
    // ------------------------------------------------------------
    const secret =
      process.env.PAYSTACK_SECRET_KEY_LIVE || process.env.PAYSTACK_SECRET_KEY;

    const hash = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      console.error("Invalid signature");
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(rawBody);

    if (event.event !== "charge.success") {
      return res.status(200).send("Ignored");
    }

    const reference = event.data.reference;

    console.log("Webhook received for reference:", reference);

    // ------------------------------------------------------------
    // VERIFY PAYMENT WITH PAYSTACK
    // ------------------------------------------------------------
    const verifyRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${secret}` } }
    );

    const verified = verifyRes.data?.data;

    if (!verified || verified.status !== "success") {
      console.error("Payment verification failed");
      return res.status(400).send("Payment not verified");
    }

    console.log("Paystack verification success:", verified.reference);

    // ------------------------------------------------------------
    // FIND BOOKING
    // ------------------------------------------------------------
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
      process.env.APPSYNC_API_URL,
      {
        query: findQuery,
        variables: { reference },
      },
      {
        headers: {
          "x-api-key": process.env.APPSYNC_API_KEY,
        },
      }
    );

    const items = findRes.data?.data?.listBookings?.items;
    if (!items?.length) {
      console.error("Booking not found for:", reference);
      return res.status(404).send("Booking not found");
    }

    const booking = items[0];
    console.log("Booking found:", booking.id, "Version:", booking._version);

    // ------------------------------------------------------------
    // GENERATE NEW TICKET ID (UUID)
    // ------------------------------------------------------------
    const ticketId = `TICKET-${uuidv4()}`;

    // ------------------------------------------------------------
    // GENERATE QR CODE URL (no S3 upload)
    // ------------------------------------------------------------
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${ticketId}`;

    // ------------------------------------------------------------
    // UPDATE BOOKING
    // ------------------------------------------------------------
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

        // Payment
        status: "PAID",
        transactionStatus: "Successful",

        // Ticket fields
        ticketID: ticketId,
        qrCodeUrl: qrUrl,
        ticketStatus: "UNUSED",
      },
    };

    const updateRes = await axios.post(
      process.env.APPSYNC_API_URL,
      {
        query: updateMutation,
        variables: updateVars,
      },
      { headers: { "x-api-key": process.env.APPSYNC_API_KEY } }
    );

    console.log("Booking updated:", updateRes.data.data.updateBooking);

    // ------------------------------------------------------------
    // SEND GUEST EMAIL
    // ------------------------------------------------------------
    try {
      await axios.post(process.env.GUEST_EMAIL_LAMBDA, {
        guestEmail: booking.guestEmail,
        guestName: `${booking.clientFirstName} ${booking.clientLastName}`,
        numberOfPeople: booking.numberOfPeople,
        propertyName:
          booking.propertyType || booking.accommodationType || "Accommodation",
        ticketId,
        qrUrl,
      });

      console.log("Guest email sent");
    } catch (e) {
      console.error("Guest email error:", e.response?.data || e.message);
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
        process.env.APPSYNC_API_URL,
        {
          query: realtorQuery,
          variables: { id: booking.realtorID },
        },
        { headers: { "x-api-key": process.env.APPSYNC_API_KEY } }
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

        console.log("Vendor email sent");
      }
    } catch (e) {
      console.error("Vendor email error:", e.response?.data || e.message);
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).send("Server Error");
  }
}
