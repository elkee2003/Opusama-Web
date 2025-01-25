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
    <div className="alertContainer">
      <div
        className="alertCard"
        onClick={() =>
          navigate(`/realtorcontent/pending_details/${notification.id}`)
        }
      >
        {/* First Name */}
        {notification.clientFirstName && (
          <p className="alertDetails">
            <span className="alertDetailsSub">Name:</span> {notification.clientFirstName}
          </p>
        )}

        {/* Property Type */}
        {notification.propertyType && (
          <p
            className="alertDetails"
            onClick={(e) =>{ 
              e.stopPropagation();
              navigate(`/realtorcontent/postdetails/${notification?.post?.id}`);
            }}
          >
            <span className="alertDetailsSubClick">Accommodation Type (click to view):</span>{' '}
            {notification.propertyType}
          </p>
        )}

        {/* Accommodation Type */}
        {notification.accommodationType && (
          <p className="alertDetails">
            <span className="alertDetailsSub">Type:</span> {notification.accommodationType}
          </p>
        )}

        {/* Check-in */}
        {notification.checkInDate && (
          <p className="alertDetails">
            <span className="alertDetailsSub">Check-in:</span>{' '}
            {notification.checkInDate.substring(0, 17)}
          </p>
        )}

        {/* Check-out */}
        {notification.checkOutDate && (
          <p className="alertDetails">
            <span className="alertDetailsSub">Check-out:</span>{' '}
            {notification.checkOutDate.substring(0, 17)}
          </p>
        )}

        {/* Realtor Price */}
        {notification.realtorPrice && (
          <p className="alertDetails">
            <span className="alertDetailsSub">Amount:</span> ₦
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