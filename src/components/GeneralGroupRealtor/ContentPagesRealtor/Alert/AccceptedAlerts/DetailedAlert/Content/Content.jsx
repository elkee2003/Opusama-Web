import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { IoEllipsisVertical } from 'react-icons/io5';
import './Content.css'

const DetailedAlert = ({ notification, onStatusChange }) => {
  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Pending';
      case 'ACCEPTED': return 'Accepted';
      case 'VIEWING': return 'Viewing';
      case 'VIEWED': return 'Viewed';
      case 'SOLD': return 'Sold';
      case 'PAID': return 'Paid';
      case 'RECEIVED': return 'Received';
      case 'DENIED': return 'Denied';
      default: return 'Pending';
    }
  };

  const handleCopyPhoneNumber = () => {
    const phoneNumber = notification?.clientPhoneNumber;
    if (phoneNumber) {
      navigator.clipboard.writeText(phoneNumber)
        .then(() => alert('Phone Number Copied. You can paste it into the dialer to make a call.'))
        .catch(() => alert('Failed to copy the phone number.'));
    } else {
      alert('Phone number is not available.');
    }
  };

  return (
    <div className="container">
      <h1 className="header">Guest Details</h1>

      {/* Details */}
      <div className="scrollableContent">
        {/* Guest Units */}
        <div className="guestUnit">
          {notification?.adults && (
            <div>
              <h3 className="subHeader">Adults:</h3>
              <p className="unitTxt">{notification.adults}</p>
            </div>
          )}
          {notification?.kids && (
            <div>
              <h3 className="subHeader">Children:</h3>
              <p className="unitTxt">{notification.kids}</p>
            </div>
          )}
          {notification?.infants && (
            <div>
              <h3 className="subHeader">Infants:</h3>
              <p className="unitTxt">{notification.infants}</p>
            </div>
          )}
        </div>

        {/* Client Details */}
        {notification?.clientFirstName && (
          <>
            <h3 className="subHeader">Name(s):</h3>
            <p className="details">{notification.clientFirstName}</p>
          </>
        )}
        {notification?.clientLastName && (
          <>
            <h3 className="subHeader">Last Name(s):</h3>
            <p className="details">{notification.clientLastName}</p>
          </>
        )}
        {notification?.clientPhoneNumber && (
          <>
            <h3 className="subHeader">Phone Number:</h3>
            <button className="copyButton" onClick={handleCopyPhoneNumber}>
              {notification.clientPhoneNumber}
            </button>
          </>
        )}
        {notification?.purpose && (
          <>
            <h3 className="subHeader">Purpose:</h3>
            <p className="details">{notification.purpose}</p>
          </>
        )}
        {notification?.duration && (
          <>
            <h3 className="subHeader">Duration:</h3>
            <p className="details">{notification.duration}</p>
          </>
        )}
        {notification?.checkInDate && (
          <>
            <h3 className="subHeader">Check-in:</h3>
            <p className="details">{notification.checkInDate}</p>
          </>
        )}
        {notification?.checkOutDate && (
          <>
            <h3 className="subHeader">Check-out:</h3>
            <p className="details">{notification.checkOutDate}</p>
          </>
        )}
        {notification?.propertyType && (
          <>
            <h3 className="subHeader">Accommodation Type:</h3>
            <p className="details">{notification.propertyType}</p>
          </>
        )}
        {notification?.accommodationType && (
          <>
            <h3 className="subHeader">
              {notification.propertyType === 'Hotel / Shortlet' ? 'Room Type:' : 'Property Type'}
            </h3>
            <p className="details">{notification.accommodationType}</p>
          </>
        )}
        {notification?.nameOfType && (
          <>
            <h3 className="subHeader">Room Name:</h3>
            <p className="details">{notification.nameOfType}</p>
          </>
        )}
        {notification?.realtorPrice && (
          <>
            <h3 className="subHeader">Price:</h3>
            <p className="details">₦{Number(notification.realtorPrice).toLocaleString()}</p>
          </>
        )}
        <p className="bookedBy">by: {notification?.user?.firstName}</p>
      </div>

      {/* Status */}
      <div className="statusRow">
        <p className="status">{getStatusText(notification.status)}</p>
        {['ACCEPTED', 'VIEWING', 'VIEWED', 'PAID', 'SOLD', 'RECEIVED'].includes(notification.status) ? (
          <div className="greenIcon" />
        ) : (
          <div className="redIcon" />
        )}
      </div>

      {/* Buttons */}
      {notification.propertyType !== 'Hotel / Shortlet' && (
        <>
          {notification.status === 'ACCEPTED' && (
            <div className="viewConInfoRow">
              <button
                className="view"
                onClick={() => onStatusChange('VIEWING')}
              >
                Viewing
              </button>
              <button
                className="infoIconCon"
                onClick={() => alert('Booking Info: Click on "Viewing" once you are showing the client the property.')}
              >
                <FaInfoCircle className="infoIcon" />
              </button>
            </div>
          )}
          {/* Additional statuses... */}
        </>
      )}

      {notification.propertyType === 'Hotel / Shortlet' && notification.status === 'PAID' && (
        <div className="viewConInfoRow">
          <button
            className="view"
            onClick={() => onStatusChange('RECEIVED')}
          >
            Received
          </button>
          <button
            className="infoIconCon"
            onClick={() => alert('Booking Info: Click on "Received" once you have received payment for booking.')}
          >
            <FaInfoCircle className="infoIcon" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailedAlert;