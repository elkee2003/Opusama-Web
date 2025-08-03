import axios from 'axios';

export default async function handler(req, res) {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store');

  // Handle preflight (OPTIONS) request
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    const PAYSTACK_SECRET_KEY =
      process.env.NODE_ENV === 'production'
        ? process.env.PAYSTACK_SECRET_KEY_PRODUCTION
        : process.env.PAYSTACK_SECRET_KEY_TEST;

    const response = await axios.get('https://api.paystack.co/bank', {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching bank list:', error.message);
    res.status(500).json({ error: 'Failed to fetch bank list' });
  }
}