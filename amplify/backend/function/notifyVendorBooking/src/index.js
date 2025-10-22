const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const ses = new SESClient({ region: process.env.REGION || "eu-north-1" });

exports.handler = async (event) => {
  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event;

    const {
      realtorEmail,
      realtorName,
      guestName,
      propertyName,
      eventName,
      totalAmount,
    } = body;

    if (!realtorEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing realtor email" }),
      };
    }

    const subject = `New Booking — ${propertyName}`;
    const htmlBody = `
      <div style="font-family:Arial,sans-serif;font-size:15px;">
        <h2>Hi ${realtorName || "Realtor"},</h2>
        <p>You have a new booking on <strong>Opusama</strong>!</p>
        <h3>Booking Details:</h3>
        <ul>
          <li><b>Guest Name:</b> ${guestName}</li>
          <li><b>Property:</b> ${propertyName}</li>
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

    const params = {
      Destination: { ToAddresses: [realtorEmail] },
      Message: {
        Body: { Html: { Charset: "UTF-8", Data: htmlBody } },
        Subject: { Charset: "UTF-8", Data: subject },
      },
      Source: "info@opusama.com",
    };

    await ses.send(new SendEmailCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Realtor notification email sent successfully",
      }),
    };
  } catch (error) {
    console.error("Error sending realtor email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error sending realtor email",
        error: error.message,
      }),
    };
  }
};
