import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { account_number, bank_code } = req.body || {};
  if (!account_number || !bank_code) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const isProduction = process.env.NODE_ENV === "production";
  const PAYSTACK_SECRET_KEY = isProduction
    ? process.env.PAYSTACK_SECRET_KEY_LIVE
    : process.env.PAYSTACK_SECRET_KEY_TEST;

  try {
    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error resolving account:", error.response?.data || error);
    res.status(400).json({
      message: "Could not verify account number",
      error: error.response?.data || error,
    });
  }
}