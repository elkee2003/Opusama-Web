import axios from 'axios';

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { account_number, bank_code } = JSON.parse(event.body);

  if (!account_number || !bank_code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing fields" }),
    };
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Could not verify account number",
        error: error.response?.data || error.message,
      }),
    };
  }
}