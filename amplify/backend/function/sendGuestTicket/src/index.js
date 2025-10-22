const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const ses = new SESClient({ region: "eu-north-1" });

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "CORS preflight success" }),
      };
    }

    console.log("Incoming event:", JSON.stringify(event));

    const payload =
      event.body
        ? typeof event.body === "string"
          ? JSON.parse(event.body)
          : event.body
        : event;

    const {
      guestEmail,
      guestName,
      eventName,
      propertyName,
      numberOfPeople,
      ticketId,
      qrUrl,
    } = payload;

    if (!guestEmail || !ticketId || !qrUrl) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          message: "Missing guestEmail, ticketId, or qrUrl",
        }),
      };
    }

    const displayLabel =
      propertyName === "Event" ? eventName : propertyName || "Your Booking";

    const ticketPageUrl = `https://opusama.com/clientcontent/tickets/${ticketId}`;

    const htmlBody = `
      <h2>Hello ${guestName || "Guest"},</h2>
      <p>Thank you for booking <b>${displayLabel}</b> on Opusama.</p>
      <p><b>Ticket ID:</b> ${ticketId}</p>
      ${numberOfPeople ? `<p><b>Number of People:</b> ${numberOfPeople}</p>` : ""}
      <p>Show this QR code at entry:</p>
      <img src="${qrUrl}" alt="Ticket QR Code" style="width:200px;height:200px"/>
      <p>If you cannot see the QR code above,
        <a href="${ticketPageUrl}" target="_blank" style="color:#007bff;">
          click here to view your ticket
        </a>.
      </p>
      <p>Thank you for booking through Opusama.</p>
      <div style="margin-top:20px;padding:10px;background:#f9f9f9;color:#333;font-size:14px;text-align:center;">
        Signup now to join <b>Opusama</b> and enjoy more services.
      </div>
    `;

    const params = {
      Source: "info@opusama.com",
      Destination: { ToAddresses: [guestEmail] },
      Message: {
        Subject: { Data: `Your Ticket for ${displayLabel}` },
        Body: { Html: { Data: htmlBody } },
      },
    };

    await ses.send(new SendEmailCommand(params));

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
      body: JSON.stringify({
        message: "Failed to send email",
        error: error.message,
      }),
    };
  }
};
