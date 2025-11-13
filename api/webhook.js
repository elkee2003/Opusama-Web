import crypto from "crypto";
import axios from "axios";

export const config = {
  api: {
    bodyParser: false, // Required for raw signature verification
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const PAYSTACK_SECRET_KEY =
    process.env.PAYSTACK_SECRET_KEY_LIVE || process.env.PAYSTACK_SECRET_KEY;
  const APPSYNC_API_URL = process.env.APPSYNC_API_URL;
  const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY;

  try {
    // ✅ Read raw body buffer (to verify Paystack signature)
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks).toString("utf8");

    // ✅ Verify Paystack signature
    const expectedHash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    if (expectedHash !== req.headers["x-paystack-signature"]) {
      console.error("❌ Invalid Paystack webhook signature");
      return res.status(400).send("Invalid signature");
    }

    // ✅ Parse event data
    const event = JSON.parse(rawBody);

    if (event.event !== "charge.success") {
      console.log(`ℹ️ Ignoring event type: ${event.event}`);
      return res.status(200).send("Ignored non-payment event");
    }

    const reference = event.data.reference;
    console.log(`✅ Webhook received for payment reference: ${reference}`);

    // --- Step 1: Verify with Paystack API again ---
    const verifyRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
      }
    );

    const verifiedData = verifyRes.data.data;
    if (!verifiedData || verifiedData.status !== "success") {
      console.error("❌ Payment verification failed or incomplete data.");
      return res.status(400).send("Payment not verified");
    }

    console.log("✅ Verified successful payment:", verifiedData.reference);

    // --- Step 2: Find booking by transactionReference ---
    const findBookingQuery = `
      query FindBooking($reference: String!) {
        listBookings(filter: { transactionReference: { eq: $reference } }) {
          items {
            id
            status
            transactionReference
          }
        }
      }
    `;

    const findRes = await axios.post(
      APPSYNC_API_URL,
      {
        query: findBookingQuery,
        variables: { reference: verifiedData.reference },
      },
      {
        headers: {
          "x-api-key": APPSYNC_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const bookingItems = findRes.data?.data?.listBookings?.items || [];

    if (bookingItems.length === 0) {
      console.error("❌ No booking found with that transaction reference.");
      return res.status(404).send("Booking not found");
    }

    const booking = bookingItems[0];
    console.log("🟢 Found booking:", booking.id, booking.status);

    // --- Step 3: Update booking to PAID ---
    const updateMutation = `
      mutation UpdateBooking($input: UpdateBookingInput!) {
        updateBooking(input: $input) {
          id
          status
          transactionReference
        }
      }
    `;

    const updateVars = {
      input: {
        id: booking.id,
        status: "PAID",
      },
    };

    const updateRes = await axios.post(
      APPSYNC_API_URL,
      {
        query: updateMutation,
        variables: updateVars,
      },
      {
        headers: {
          "x-api-key": APPSYNC_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Booking updated successfully:", updateRes.data.data);

    return res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Webhook processing error:", err.message);
    console.error(err.response?.data || err.stack);
    return res.status(500).send("Server Error");
  }
}
