const express = require('express');
const nodemailer = require('nodemailer');
const qrcode = require('qrcode');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}

async function createTransporter() {
  // If SMTP creds are provided, use them. Otherwise auto-create a test account (dev).
  if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Dev/test: Ethereal account
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }
}

app.post('/send-ticket-email', async (req, res) => {
  try {
    const {
      email,
      name,
      ticketId,
      accommodationType,
      propertyType,
      eventName,
      numberOfPeople,
      amount,
      reference,
      bookingId
    } = req.body;

    if (!email || !ticketId) return res.status(400).json({ success: false, error: 'Missing email or ticketId' });

    const transporter = await createTransporter();

    // Create QR PNG buffer
    const qrData = JSON.stringify({ ticketId, accommodationType, propertyType });
    const qrBuffer = await qrcode.toBuffer(qrData, { type: 'png', width: 400 });

    // HTML email (embed with cid)
    const html = `
      <p>Hi ${escapeHtml(name) || 'Guest'},</p>
      <p>Thanks for your payment of ₦${escapeHtml(String(amount || '0'))} ${reference ? `(ref: ${escapeHtml(reference)})` : ''}.</p>
      <p><strong>Event / Accommodation:</strong> ${escapeHtml(eventName || accommodationType || propertyType || '—')}</p>
      <p><strong>Number of people:</strong> ${escapeHtml(String(numberOfPeople || '1'))}</p>
      <p><strong>Ticket ID:</strong> ${escapeHtml(ticketId)}</p>
      <p>Please show this QR code at entry:</p>
      <img src="cid:ticketQR" alt="ticket qr" style="max-width:100%;height:auto"/>
      <p>If you have questions reply to this email.</p>
      <p>— Opusama</p>
    `;

    const mailOptions = {
      from: `"Opusama" <${process.env.FROM_EMAIL || 'opusingi@opusama.com'}>`,
      to: email,
      subject: 'Your Opusama Ticket',
      html,
      attachments: [
        { filename: 'ticket-qrcode.png', content: qrBuffer, cid: 'ticketQR' }
      ]
    };

    const info = await transporter.sendMail(mailOptions);

    const result = { success: true, messageId: info.messageId };
    // If using nodemailer test account, return preview URL for dev testing
    if (nodemailer.getTestMessageUrl) {
      const preview = nodemailer.getTestMessageUrl(info);
      if (preview) result.previewUrl = preview;
    }

    return res.json(result);
  } catch (err) {
    console.error('send-ticket-email error', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`send-ticket-email server listening on ${PORT}`));





// // Import required packages using ES module syntax
// import dotenv from 'dotenv';

// if (process.env.NODE_ENV === 'production') {
//   dotenv.config({ path: '.env.production' });
// } else {
//   dotenv.config(); // Loads default .env
// } 

// import express from 'express';
// import cors from 'cors';
// import axios from 'axios';


// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// import verifyRouter from './verify.js';
// app.use('/api', verifyRouter);

// // Paystack secret key from .env
// const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;


// // GET /banks - Fetch list of banks
// app.get("/banks", async (req, res) => {
//   try {
//     const response = await axios.get("https://api.paystack.co/bank", {
//       headers: {
//         Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
//       },
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching banks:", error.response?.data || error);
//     res.status(500).json({ message: "Failed to fetch banks" });
//   }
// });

// // POST /resolve-account - Verify account number
// app.post("/resolve-account", async (req, res) => {
//   const { account_number, bank_code } = req.body;

//   if (!account_number || !bank_code) {
//     return res.status(400).json({ message: "Missing fields" });
//   }

//   try {
//     const response = await axios.get(
//       `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
//       {
//         headers: {
//           Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
//         },
//       }
//     );

//     res.json(response.data);
//   } catch (error) {
//     console.error("Error resolving account:", error.response?.data || error);
//     res.status(400).json({
//       message: "Could not verify account number",
//       error: error.response?.data || error,
//     });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });