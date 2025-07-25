// Import required packages using ES module syntax
import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config(); // Loads default .env
} 

import express from 'express';
import cors from 'cors';
import axios from 'axios';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Paystack secret key from .env
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;


// GET /banks - Fetch list of banks
app.get("/banks", async (req, res) => {
  try {
    const response = await axios.get("https://api.paystack.co/bank", {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching banks:", error.response?.data || error);
    res.status(500).json({ message: "Failed to fetch banks" });
  }
});

// POST /resolve-account - Verify account number
app.post("/resolve-account", async (req, res) => {
  const { account_number, bank_code } = req.body;

  if (!account_number || !bank_code) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error resolving account:", error.response?.data || error);
    res.status(400).json({
      message: "Could not verify account number",
      error: error.response?.data || error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});