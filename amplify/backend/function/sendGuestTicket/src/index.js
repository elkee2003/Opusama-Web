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

    // 1 Build Email HTML
    const htmlBody = `
      <h2>Hello ${guestName || "Guest"},</h2>
      <p>Thank you for booking <b>${eventName}</b>.</p>
      <p><b>Ticket ID:</b> ${ticketId}</p>
      <p><b>Number of People:</b> ${numberOfPeople}</p>
      <p>Show this QR code at entry:</p>
      <img src="${qrUrl}" alt="Ticket QR Code" style="width:200px;height:200px"/>
      <p>Enjoy your event!</p>
      <p>Signup now to join opusama and enjoy more services</p>
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
