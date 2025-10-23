const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

// ✅ Initialize SES client
const ses = new SESClient({ region: process.env.REGION || "eu-north-1" });

// ✅ Define CORS headers
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};

exports.handler = async (event) => {
  // ✅ Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "CORS preflight success" }),
    };
  }

  try {
    console.log("Incoming event:", JSON.stringify(event));

    // ✅ Parse incoming body
    const body =
      event.body && typeof event.body === "string"
        ? JSON.parse(event.body)
        : event;

    const {
      realtorEmail,
      realtorName,
      guestName,
      propertyName,
      eventName,
      totalAmount,
    } = body;

    // ✅ Basic validation
    if (!realtorEmail) {
      console.error("Missing realtor email in request body");
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Missing realtor email" }),
      };
    }

    // ✅ Compose email
    const subject = `New Booking — ${propertyName}`;
    const htmlBody = `
      <div style="font-family:Arial,sans-serif;font-size:15px;">
        <h2>Hi ${realtorName || "Realtor"},</h2>
        <p>You have a new booking on <strong>Opusama</strong>!</p>
        <h3>Booking Details:</h3>
        <ul>
          <li><b>Guest Name:</b> ${guestName || "N/A"}</li>
          <li><b>Property:</b> ${propertyName || "N/A"}</li>
          ${
            propertyName === "Event" && eventName
              ? `<li><b>Event Name:</b> ${eventName}</li>`
              : ""
          }
          <li><b>Total Amount:</b> ₦${Number(totalAmount || 0).toLocaleString()}</li>
        </ul>
        <p>Please log in to your Opusama dashboard to view full details.</p>
        <br/>
        <p style="color:#777;">— The Opusama Team</p>
      </div>
    `;

    // ✅ Prepare SES parameters
    const params = {
      Destination: { ToAddresses: [realtorEmail] },
      Message: {
        Body: { Html: { Charset: "UTF-8", Data: htmlBody } },
        Subject: { Charset: "UTF-8", Data: subject },
      },
      Source: "info@opusama.com", // Must be verified in SES
    };

    // ✅ Send email via SES
    try {
      console.log("Attempting to send email via SES...");
      const response = await ses.send(new SendEmailCommand(params));
      console.log("SES Response:", JSON.stringify(response));
    } catch (sesError) {
      console.error("SES send error:", sesError);
      throw sesError; // rethrow so it shows in CloudWatch
    }

    // ✅ Success response
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: "Realtor notification email sent successfully",
      }),
    };
  } catch (error) {
    console.error("Error sending realtor email:", error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: "Error sending realtor email",
        error: error.message,
      }),
    };
  }
};
