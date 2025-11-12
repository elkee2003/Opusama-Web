import crypto from "crypto";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY_LIVE || process.env.PAYSTACK_SECRET_KEY;
  const APPSYNC_API_URL = process.env.APPSYNC_API_URL;
  const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY;

  // --- Verify Paystack Signature ---
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    console.error("❌ Invalid webhook signature");
    return res.status(400).send("Invalid signature");
  }

  const event = req.body;

  if (event.event === "charge.success") {
    const data = event.data;
    const reference = data.reference;

    console.log(`✅ Webhook received for payment: ${reference}`);

    try {
      // --- Double-check verification with Paystack ---
      const verifyRes = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        }
      );

      const verifiedData = verifyRes.data.data;

      if (verifiedData.status === "success") {
        console.log("✅ Verified payment from webhook:", verifiedData.reference);

        // --- Update Amplify Booking ---
        const gqlMutation = `
          mutation UpdateBooking {
            updateBooking(input: {
              reference: "${verifiedData.reference}",
              status: "PAID"
            }) {
              id
              status
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

        console.log("🟢 Booking updated to PAID in Amplify");
      }
    } catch (err) {
      console.error("❌ Webhook verification failed:", err.message);
    }
  }

  return res.status(200).send("OK");
}
