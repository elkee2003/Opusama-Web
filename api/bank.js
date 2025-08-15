import axios from 'axios';

export default async function handler(req, res) {
  // --- CORS HEADERS ---
  res.setHeader("Access-Control-Allow-Origin", "https://opusama.com"); // Allow only your frontend domain
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const isProduction = process.env.NODE_ENV === "production";
  const PAYSTACK_SECRET_KEY = isProduction
    ? process.env.PAYSTACK_SECRET_KEY_LIVE
    : process.env.PAYSTACK_SECRET_KEY_TEST;

  try {
    const response = await axios.get("https://api.paystack.co/bank", {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching banks:", error.response?.data || error);
    res.status(500).json({ message: "Failed to fetch banks" });
  }
}