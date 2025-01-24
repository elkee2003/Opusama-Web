import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ShortAlert.css';

const ShortAlert = ({ notification }) => {
  const navigate = useNavigate();

  const getStatusText = (status) => {
    if (status === 'PENDING') return 'Pending';
    if (status === 'ACCEPTED') return 'Accepted';
    if (status === 'VIEWING') return 'Viewing';
    if (status === 'VIEWED') return 'Viewed';
    if (status === 'SOLD') return 'Sold';
    if (status === 'PAID') return 'Paid';
    if (status === 'DELAYED_PAYMENT') return 'Delayed Payment';
    if (status === 'RECEIVED') return 'Received';
    if (status === 'DENIED') return 'Denied';
    return 'Pending';
  };

  return (
    <div className="container">
      <div
        className="card"
        onClick={() =>
          navigate(`/realtorcontent/pending_details/${notification.id}`)
        }
      >
        {/* First Name */}
        {notification.clientFirstName && (
          <p className="details">
            <span className="detailsSub">Name:</span> {notification.clientFirstName}
          </p>
        )}

        {/* Property Type */}
        {notification.propertyType && (
          <p
            className="details"
            onClick={() => navigate(`/realtorcontent/detailedpost/${notification?.post?.id}`)}
          >
            <span className="detailsSub">Accommodation Type (click to view):</span>{' '}
            {notification.propertyType}
          </p>
        )}

        {/* Accommodation Type */}
        {notification.accommodationType && (
          <p className="details">
            <span className="detailsSub">Type:</span> {notification.accommodationType}
          </p>
        )}

        {/* Check-in */}
        {notification.checkInDate && (
          <p className="details">
            <span className="detailsSub">Check-in:</span>{' '}
            {notification.checkInDate.substring(0, 17)}
          </p>
        )}

        {/* Check-out */}
        {notification.checkOutDate && (
          <p className="details">
            <span className="detailsSub">Check-out:</span>{' '}
            {notification.checkOutDate.substring(0, 17)}
          </p>
        )}

        {/* Realtor Price */}
        {notification.realtorPrice && (
          <p className="details">
            <span className="detailsSub">Amount:</span> ₦
            {Number(notification.realtorPrice).toLocaleString()}
          </p>
        )}

        {/* Status */}
        <div className="statusRow">
          <span className="status">{getStatusText(notification.status)}</span>
          {notification.status === 'ACCEPTED' ? (
            <div className="greenIcon" />
          ) : (
            <div className="redIcon" />
          )}
        </div>

        {/* by Account Owner */}
        <p className="accOwner">by: {notification?.user?.firstName}</p>
      </div>
    </div>
  );
};

export default ShortAlert;