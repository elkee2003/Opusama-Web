import crypto from "crypto";
import axios from "axios";

export const config = {
  api: {
    bodyParser: false, // ❗Important for verifying Paystack's raw body signature
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  // 🔐 Environment variables
  const PAYSTACK_SECRET_KEY =
    process.env.PAYSTACK_SECRET_KEY_LIVE || process.env.PAYSTACK_SECRET_KEY;
  const APPSYNC_API_URL = process.env.APPSYNC_API_URL;
  const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY;

  try {
    // ✅ 1. Read the raw body buffer (for signature verification)
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks).toString("utf8");

    // ✅ 2. Verify Paystack signature
    const computedHash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    const receivedHash = req.headers["x-paystack-signature"];

    if (computedHash !== receivedHash) {
      console.error("❌ Invalid Paystack signature");
      return res.status(400).send("Invalid signature");
    }

    // ✅ 3. Parse the event payload
    const event = JSON.parse(rawBody);
    console.log(`📩 Webhook event received: ${event.event}`);

    if (event.event !== "charge.success") {
      console.log("ℹ️ Not a charge.success event — ignoring.");
      return res.status(200).send("Ignored non-payment event");
    }

    const reference = event.data.reference;
    console.log(`💰 Processing successful payment: ${reference}`);

    // ✅ 4. Double-verify payment directly from Paystack
    const verifyResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
      }
    );

    const verifiedData = verifyResponse.data.data;
    if (!verifiedData || verifiedData.status !== "success") {
      console.error("❌ Payment verification failed for:", reference);
      return res.status(400).send("Verification failed");
    }

    console.log("✅ Verified payment from Paystack:", verifiedData.reference);

    // ✅ 5. Find booking in AppSync using the transactionReference
    const findBookingQuery = `
      query ListBookings {
        listBookings(filter: { transactionReference: { eq: "${verifiedData.reference}" } }) {
          items {
            id
            status
            transactionReference
          }
        }
      }
    `;

    const findResponse = await axios.post(
      APPSYNC_API_URL,
      { query: findBookingQuery },
      {
        headers: {
          "x-api-key": APPSYNC_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const bookingItems = findResponse.data?.data?.listBookings?.items || [];

    if (bookingItems.length === 0) {
      console.error("❌ No booking found with transaction reference:", reference);
      // ✅ Respond 200 so Paystack doesn't retry forever
      return res.status(200).send("No matching booking found");
    }

    const booking = bookingItems[0];
    console.log(`🟢 Found booking ID: ${booking.id}, current status: ${booking.status}`);

    // ✅ 6. Update booking status in AppSync
    const updateBookingMutation = `
      mutation UpdateBooking {
        updateBooking(input: {
          id: "${booking.id}",
          status: "PAID",
          transactionAmount: ${verifiedData.amount / 100},
          paymentMethod: "PAYSTACK",
          paymentVerifiedAt: "${new Date().toISOString()}"
        }) {
          id
          status
          transactionReference
        }
      }
    `;

    await axios.post(
      APPSYNC_API_URL,
      { query: updateBookingMutation },
      {
        headers: {
          "x-api-key": APPSYNC_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ Booking (${booking.id}) updated to PAID successfully.`);

    // ✅ 7. Respond success to Paystack
    return res.status(200).send("Webhook processed successfully");
  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    return res.status(500).send("Server Error");
  }
}
