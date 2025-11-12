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
    // ✅ Read raw body buffer
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks).toString("utf8");

    // ✅ Verify Paystack signature
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      console.error("❌ Invalid webhook signature");
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(rawBody);

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      console.log(`✅ Webhook received for payment: ${reference}`);

      // --- Step 1: Verify with Paystack again ---
      const verifyRes = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
      );

      const verifiedData = verifyRes.data.data;

      if (verifiedData.status === "success") {
        console.log("✅ Verified payment:", verifiedData.reference);

        // --- Step 2: Find the Booking with matching transactionReference ---
        const findBookingQuery = `
          query ListBookings {
            listBookings(filter: { transactionReference: { eq: "${verifiedData.reference}" } }) {
              items {
                id
                transactionReference
                status
              }
            }
          }
        `;

        const findRes = await axios.post(
          APPSYNC_API_URL,
          { query: findBookingQuery },
          {
            headers: {
              "x-api-key": APPSYNC_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        const bookingItems = findRes.data.data.listBookings.items;
        if (bookingItems.length === 0) {
          console.error("❌ No booking found with that transaction reference.");
          return res.status(404).send("Booking not found");
        }

        const booking = bookingItems[0];
        console.log(`🟢 Found booking ID: ${booking.id}`);

        // --- Step 3: Update Booking status to PAID ---
        const gqlMutation = `
          mutation UpdateBooking {
            updateBooking(input: {
              id: "${booking.id}",
              status: "PAID"
            }) {
              id
              status
              transactionReference
            }
          }
        `;

        await axios.post(
          APPSYNC_API_URL,
          { query: gqlMutation },
          {
            headers: {
              "x-api-key": APPSYNC_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Booking successfully updated to PAID in Amplify.");
      }
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Webhook processing error:", err.message);
    return res.status(500).send("Server Error");
  }
}
