// Import required packages using ES module syntax
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Flutterwave secret key from environment variable
const FLW_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

// Route to get list of banks in Nigeria
app.get('/banks', async (req, res) => {
  try {
    const response = await axios.get('https://api.flutterwave.com/v3/banks/NG', {
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching banks:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch bank list' });
  }
});

// Route to resolve account details
app.post('/resolve-account', async (req, res) => {
  const { account_number, bank_code } = req.body;

  try {
    const response = await axios.get('https://api.flutterwave.com/v3/accounts/resolve', {
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`
      },
      params: {
        account_number,
        account_bank: bank_code
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error resolving account:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to resolve bank account' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});