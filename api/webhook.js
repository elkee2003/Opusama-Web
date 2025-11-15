import crypto from "crypto";
import axios from "axios";


export const config = {
  api: {
    bodyParser: false,
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
    // Read body
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks).toString("utf8");

    // Verify signature
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(rawBody);

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      console.log("Webhook received for:", reference);

      // Verify with Paystack
      const verifyRes = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
      );

      const verified = verifyRes.data.data;

      if (verified.status === "success") {
        console.log("Payment verified:", verified.reference);

        // --- STEP 1: Find the actual booking INCLUDING version ---
        const findQuery = `
          query FindBooking($reference: String!) {
            listBookings(filter: { transactionReference: { eq: $reference } }) {
              items {
                id
                _version
                status
                transactionReference
                transactionStatus
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
          {
            headers: {
              "x-api-key": APPSYNC_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        const items = findRes.data.data.listBookings.items;

        if (!items.length) {
          console.error("No booking found for reference:", reference);
          return res.status(404).send("Booking not found");
        }

        const booking = items[0];

        console.log("Found booking:", booking.id, "version:", booking._version);

        // --- STEP 2: Update WITH version ---
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
              createdAt
              updatedAt
            }
          }
        `;

        const updateVars = {
          input: {
            id: booking.id,
            _version: booking._version,   // REQUIRED

            // PAYMENT RESULT
            status: "PAID",
            transactionStatus: "Successful",

            // NEW TICKET FIELDS
            ticketID: verified.reference,       // or generate your own ID
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${verified.reference}`,
            ticketStatus: "UNUSED"
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

        console.log("FINAL UPDATED:", updateRes.data.data.updateBooking);
      }
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).send("Server Error");
  }
}
