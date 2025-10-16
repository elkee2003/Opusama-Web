import axios from "axios";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    const { account_number, bank_code, amount, narration, directPayment } = JSON.parse(event.body || "{}");

    if (!account_number || !bank_code || !amount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }

    // Handle direct payment (Paystack split already did the transfer)
    if (directPayment === true) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "Direct payment handled automatically via Paystack split — no manual payout needed.",
        }),
      };
    }

    // Step 1: Create transfer recipient
    const recipientRes = await axios.post(
      "https://api.paystack.co/transferrecipient",
      {
        type: "nuban",
        name: "Realtor Payout",
        account_number,
        bank_code,
        currency: "NGN",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const recipient_code = recipientRes.data?.data?.recipient_code;
    if (!recipient_code) {
      throw new Error("Failed to create transfer recipient");
    }

    // Step 2: Initiate transfer
    const transferRes = await axios.post(
      "https://api.paystack.co/transfer",
      {
        source: "balance",
        amount: Math.round(amount * 100), // kobo
        recipient: recipient_code,
        reason: narration || "Vendor payout",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Manual payout successful",
        data: transferRes.data?.data,
      }),
    };
  } catch (error) {
    console.error("Paystack payout error:", error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Payout failed",
        error: error.response?.data || error.message,
      }),
    };
  }
}
