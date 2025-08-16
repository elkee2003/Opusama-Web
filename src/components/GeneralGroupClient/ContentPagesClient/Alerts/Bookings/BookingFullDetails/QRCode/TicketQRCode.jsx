import React from 'react';
import QRCode from 'react-qr-code';
import './TicketQRCode.css';

const TicketQRCode = ({ ticketId, ticketStatus, accommodationType, propertyType  }) => {
  if (!ticketId) return null;

  const qrData = JSON.stringify({
    ticketId,
    // ticketStatus,
    accommodationType,
    propertyType
  });

  return (
    <div className="qr-code-con">
      <p>Show this QR Code at entry</p>
      <QRCode 
        value={qrData}
        // value={ticketId} 
        size={200} 
    />
    </div>
  );
};

export default TicketQRCode;