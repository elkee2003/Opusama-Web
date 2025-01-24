import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Content.css'

const DetailedAlert = ({ notification, onStatusChange }) => {
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
    if (status === 'OCCUPIED') return 'Occupied';
    if (status === 'REMOVED_REALTOR') return 'Removed';
    if (status === 'REMOVED_REALTOR_PAYMENT_DELAYED') return 'Delayed Payment (Removed)';
    if (status === 'DENIED') return 'Denied';
    return 'Pending';
  };

  return (
    <div className="container">
      <h2 className="header">Guest Details</h2>

      {/* Details */}
      <div className="scrollView">
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

        {/* Client Info */}
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

        {/* Other Info */}
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

        {/* Status */}
        <div className="statusRow">
          <p className="status">{getStatusText(notification?.status)}</p>
          <div
            className={notification?.status === 'ACCEPTED' ? 'greenIcon' : 'redIcon'}
          ></div>
        </div>

        {/* Booked By */}
        <p className="bookedBy">by: {notification?.user?.firstName}</p>
      </div>

      {/* Buttons */}
      <div className="acceptTryAnotherRow">
        {notification?.status !== 'DELAYED_PAYMENT' && (
          <>
            <button
              className="accept"
              onClick={() => {
                onStatusChange('ACCEPTED');
                navigate(-1);
              }}
            >
              Accept
            </button>
            <button
              className="occupied"
              onClick={() =>
                window.confirm(
                  'By clicking this, you want the client to try another listing because this is unavailable.'
                ) && onStatusChange('OCCUPIED') && navigate(-1)
              }
            >
              Try another
            </button>
          </>
        )}
      </div>

      {/* Deny */}
      {notification?.status !== 'DELAYED_PAYMENT' && (
        <div className="denyCon">
          <button
            className="deny"
            onClick={() =>
              window.confirm('Are you sure you want to deny this request?') &&
              onStatusChange('DENIED') &&
              navigate(-1)
            }
          >
            Deny
          </button>
        </div>
      )}

      {notification?.status === 'DELAYED_PAYMENT' && (
        <div className="denyCon">
          <button
            className="deny"
            onClick={() => {
              onStatusChange('REMOVED_REALTOR_PAYMENT_DELAYED');
              navigate(-1);
            }}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailedAlert;