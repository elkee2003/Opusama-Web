import axios from "axios";

export default async function handler(req, res) {
  // --- CORS HEADERS ---
  res.setHeader("Access-Control-Allow-Origin", "https://opusama.com"); // Only allow your frontend domain
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET allowed" });
  }

  const { reference } = req.query;
  if (!reference) {
    return res.status(400).json({ message: "Missing transaction reference" });
  }

  const isProduction = process.env.NODE_ENV === "production";
  const PAYSTACK_SECRET_KEY = isProduction
    ? process.env.PAYSTACK_SECRET_KEY_LIVE
    : process.env.PAYSTACK_SECRET_KEY_TEST;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    res.status(200).json({
      success: true,
      data: response.data.data, // Paystack response
    });
  } catch (error) {
    console.error("Error verifying payment:", error.response?.data || error);
    res.status(400).json({
      success: false,
      message: "Could not verify payment",
      error: error.response?.data || error,
    });
  }
}