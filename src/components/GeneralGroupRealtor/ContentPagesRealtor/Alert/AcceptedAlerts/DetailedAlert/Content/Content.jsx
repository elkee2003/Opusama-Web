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


  return (
    <div className="dAlatContainer">
      <h1 className="dAlatHeader">Guest Details</h1>

      {/* Details */}
      <div className="scrollableContent">
        {/* Guest Units */}
        <div className="dAlatGuestUnit">
          {notification?.adults && (
            <div>
              <h3 className="dAlatSubHeader">Adults:</h3>
              <p className="dAlatUnitTxt">{notification.adults}</p>
            </div>
          )}
          {notification?.kids && (
            <div>
              <h3 className="dAlatSubHeader">Children:</h3>
              <p className="dAlatUnitTxt">{notification.kids}</p>
            </div>
          )}
          {notification?.infants && (
            <div>
              <h3 className="dAlatSubHeader">Infants:</h3>
              <p className="dAlatUnitTxt">{notification.infants}</p>
            </div>
          )}
        </div>

        {/* Client Details */}
        {notification?.clientFirstName && (
          <>
            <h3 className="dAlatSubHeader">Name(s):</h3>
            <p className="dAlatDetails">{notification.clientFirstName}</p>
          </>
        )}
        {notification?.clientLastName && (
          <>
            <h3 className="dAlatSubHeader">Last Name(s):</h3>
            <p className="dAlatDetails">{notification.clientLastName}</p>
          </>
        )}
        {notification?.clientPhoneNumber && (
          <>
            <h3 className="dAlatSubHeader">Phone Number:</h3>
            <p className="dAlatDetails" >
              {notification.clientPhoneNumber}
            </p>
          </>
        )}
        {notification?.purpose && (
          <>
            <h3 className="dAlatSubHeader">Purpose:</h3>
            <p className="dAlatDetails">{notification.purpose}</p>
          </>
        )}
        {notification?.duration && (
          <>
            <h3 className="dAlatSubHeader">Duration:</h3>
            <p className="dAlatDetails">{notification.duration}</p>
          </>
        )}
        {notification?.checkInDate && (
          <>
            <h3 className="dAlatSubHeader">Check-in:</h3>
            <p className="dAlatDetails">{notification.checkInDate}</p>
          </>
        )}
        {notification?.checkOutDate && (
          <>
            <h3 className="dAlatSubHeader">Check-out:</h3>
            <p className="dAlatDetails">{notification.checkOutDate}</p>
          </>
        )}
        {notification?.propertyType && (
          <>
            <h3 className="dAlatSubHeader">Accommodation Type:</h3>
            <p className="dAlatDetails">{notification.propertyType}</p>
          </>
        )}
        {notification?.accommodationType && (
          <>
            <h3 className="dAlatSubHeader">
              {notification.propertyType === 'Hotel / Shortlet' ? 'Room Type:' : 'Property Type'}
            </h3>
            <p className="dAlatDetails">{notification.accommodationType}</p>
          </>
        )}
        {notification?.nameOfType && (
          <>
            <h3 className="dAlatSubHeader">Room Name:</h3>
            <p className="dAlatDetails">{notification.nameOfType}</p>
          </>
        )}
        {notification?.realtorPrice && (
          <>
            <h3 className="dAlatSubHeader">Price:</h3>
            <p className="dAlatDetails">₦{Number(notification.realtorPrice).toLocaleString()}</p>
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
                <p className='dAlaBtnTxt'>
                  Viewing
                </p>
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
            <p className='dAlaBtnTxt'>
              Received
            </p>
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