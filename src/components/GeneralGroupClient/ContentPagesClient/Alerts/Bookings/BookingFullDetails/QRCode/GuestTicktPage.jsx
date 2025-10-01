import { useParams } from "react-router-dom";

function TicketPage() {
  const { ticketId } = useParams();

  // ✅ Option A: Just show the QR directly from S3
  const qrUrl = `https://opusama-storage-f8b382aab73ca-staging.s3.eu-north-1.amazonaws.com/public/qrCodes/${ticketId}.png`;

  return (
    <div className="guest-ticket-qr-code-con">
      <h2>Your Ticket</h2>
      <p><b>Ticket ID:</b> {ticketId}</p>
      <p>Show this QR code at entry:</p>
      <img src={qrUrl} alt="QR Code" style={{ width: 250, height: 250 }} />
    </div>
  );
}

export default TicketPage;