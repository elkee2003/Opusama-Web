import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DataStore } from "aws-amplify/datastore";
import { Booking } from "../../../../../../../models";

function TicketPage() {
  const { ticketId } = useParams();
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        // Fetch booking where ticketID == param ticketId
        const bookings = await DataStore.query(Booking, (b) =>
          b.ticketID.eq(ticketId)
        );

        if (bookings.length > 0) {
          const booking = bookings[0];
          setQrUrl(booking.qrCodeUrl); 
        }
      } catch (err) {
        console.error("Error loading booking:", err);
      }

      setLoading(false);
    };

    loadBooking();
  }, [ticketId]);

  if (loading) return <p>Loading ticket...</p>;
  if (!qrUrl) return <p>QR Code not found for this ticket.</p>;

  return (
    <div className="guest-ticket-qr-code-con">
      <h2>Your Ticket</h2>
      <p><b>Ticket ID:</b> {ticketId}</p>
      <p>Show this QR code at entry:</p>
      <img 
        src={qrUrl} 
        alt="QR Code" 
        style={{ width: 250, height: 250 }} 
      />
    </div>
  );
}

export default TicketPage;