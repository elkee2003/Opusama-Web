// to run my project, now that I am using netlify I have to type 'netlify dev' in the server

import axios from 'axios';

export async function handler(event, context) {
  try {
    const response = await axios.get("https://api.paystack.co/bank", {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to fetch banks",
        error: error.response?.data || error.message,
      }),
    };
  }
}