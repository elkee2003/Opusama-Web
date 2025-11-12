// This code is not needed
import express from 'express';
import axios from 'axios';

const router = express.Router();
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// POST /verify-payment
router.post('/verify-payment', async (req, res) => {
  const { reference } = req.body;

  if (!reference) {
    return res.status(400).json({ message: 'Transaction reference is required' });
  }

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const { status, data } = response.data;

    if (status && data.status === 'success') {
      // Payment is verified and successful
      res.json({ success: true, message: 'Payment verified', data });
    } else {
      res.status(400).json({ success: false, message: 'Payment not successful', data });
    }
  } catch (error) {
    console.error('Verification error:', error.response?.data || error);
    res.status(500).json({ success: false, message: 'Verification failed', error: error.response?.data || error });
  }
});

export default router;