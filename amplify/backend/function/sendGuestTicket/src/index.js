const AWS = require("aws-sdk");

// Configure SES
const ses = new AWS.SES({ region: "eu-north-1" }); 

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
};

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") return { 
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "CORS preflight success" }),
    };

    console.log("Incoming event:", JSON.stringify(event));

    // ✅ Handle both local testing (event.json) and API Gateway (event.body)
    let payload;
    if (event.body) {
      payload = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    } else {
      payload = event;
    }

    const { guestEmail, guestName, eventName, numberOfPeople, ticketId, qrUrl } = payload;

    if (!guestEmail || !ticketId || !qrUrl) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS, 
        body: JSON.stringify({ message: "Missing guestEmail, ticketId or qrUrl" }),
      };
    }

    // ✅ Build ticket link *after* we have ticketId
    const ticketPageUrl = `https://opusama.com/clientcontent/tickets/${ticketId}`;

    // 1 Build Email HTML
    const htmlBody = `
      <h2>Hello ${guestName || "Guest"},</h2>
      <p>Thank you for booking <b>${eventName} on Opusama</b>.</p>
      <p><b>Ticket ID:</b> ${ticketId}</p>
      <p><b>Number of People:</b> ${numberOfPeople}</p>

      <p>Show this QR code at entry:</p>
      <img src="${qrUrl}" alt="Ticket QR Code" style="width:200px;height:200px"/>

      <p>If you cannot see the QR code above, 
        <a href="${ticketPageUrl}" target="_blank" style="color:#007bff;">click here to view your ticket</a>.
      </p>

      <p>Thank you for booking through Opusama</p>
      <div style="margin-top:20px;padding:10px;background:#f9f9f9;color:#333;font-size:14px;text-align:center;">
        Signup now to join <b>opusama</b> and enjoy more services
      </div>
    `;

    // 3️⃣ Send email via SES
    const params = {
      Source: "info@opusama.com", // ✅ use the verified email
      Destination: { ToAddresses: [guestEmail] },
      Message: {
        Subject: { Data: `Your Ticket for ${eventName}` },
        Body: {
          Html: { Data: htmlBody },
        },
      },
    };

    await ses.sendEmail(params).promise();

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Failed to send email", error: error.message }),
    };
  }
};
