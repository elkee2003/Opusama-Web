import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { IoEllipsisVertical } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import './Content.css'

const DetailedAlert = ({ notification, onStatusChange }) => {
  const navigate = useNavigate();
  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Pending';
      case 'ACCEPTED': return 'Accepted';
      case 'VIEWING': return 'Viewing';
      case 'CHECKED_IN': return 'Checked In';
      case 'VISITING': return 'Visting';
      case 'VIEWED': return 'Viewed';
      case 'CHECKED_OUT': return 'Checked Out';
      case 'VISITED': return 'Visited'
      case 'SOLD': return 'Sold';
      case 'DELAYED_PAYMENT': return 'Delayed Payment';
      case 'PAID': return 'Paid';
      case 'OCCUPIED': return 'Occupied, try another listing';
      case 'RECEIVED': return 'Received';
      case 'DENIED': return 'Denied';
      case 'REMOVED_REALTOR': return 'Removed';
      case 'REMOVED_REALTOR_PAYMENT_DELAYED': return 'Delayed Payment (Removed)';
      default: return 'Pending';
    }
  };


  return (
    <div className="dAlatAcceptedContainer">
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

          {/* Number Of People */}
          {notification?.numberOfPeople && (
            <div>
              <h3 className="dAlatSubHeader">Number Of People:</h3>
              <p className="dAlatUnitTxt">{notification.numberOfPeople}</p>
            </div>
          )}

          {/* Number Of Items */}
          {notification?.items && (
            <div>
              <h3 className="dAlatSubHeader">Number tickets/Vouchers:</h3>
              <p className="dAlatUnitTxt">{notification.items}</p>
            </div>
          )}
        </div>

        {/* Client Details */}

        {/* Subscription */}
        {notification?.subscription && (
          <div>
            <h3 className="dAlatSubHeader">Booking Type:</h3>
            <p className="dAlatDetails">Subscription</p>
          </div>
        )}

        {/* Client First Name */}
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

        {/* Selected Options Type */}
        {notification?.selectedOption?.bookingPostOptionType && (
          <div>
            <h3 className="dAlatSubHeader">Selected Type:</h3>
            <p className="dAlatDetails">{notification?.selectedOption.bookingPostOptionType}</p>
          </div>
        )}

        {/* Selected Options Name */}
        {notification?.selectedOption?.bookingName && (
          <div>
            <h3 className="dAlatSubHeader">Selected Name:</h3>
            <p className="dAlatDetails">{notification?.selectedOption.bookingName}</p>
          </div>
        )}

        {/* Selected Options Price */}
        {notification?.selectedOption?.optionPrice && (
          <div>
            <h3 className="dAlatSubHeader">Selected Price:</h3>
            <p className="dAlatDetails">{notification?.selectedOption.optionPrice}</p>
          </div>
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

        {/* Session Duration */}
        {notification?.bookedSessionDuration && (
          <div>
            <h3 className="dAlatSubHeader">Session Duration:</h3>
            <p className="dAlatDetails">{notification?.bookedSessionDuration}</p>
          </div>
        )}

        {notification?.propertyType && (
          <div
            onClick={() =>{ 
              navigate(`/realtorcontent/postdetails/${notification?.PostID}`);
            }}
          >
            <h3 className="dAlatSubHeader">Opusable Type (click to view):</h3>
            <p className="dAlatDetails">{notification.propertyType}</p>
          </div>
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

        {/* Staff who checkedIn */}
        {notification?.checkedInByUser && (
          <>
            <h3 className="dAlatSubHeader">Checked In By:</h3>
            <p className="dAlatDetails">
               {notification.checkedInByUser.firstName}
            </p>
          </>
        )}
      </div>

      {/* Status */}
      <div className="statusRow">
        <p className="status">{getStatusText(notification.status)}</p>
        {['ACCEPTED', 'VIEWING', 'CHECKED_IN', 'VISITING', 'VIEWED', 'CHECKED_OUT', 'VISITED', 'PAID', 'SOLD', 'RECEIVED'].includes(notification.status) ? (
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

      {(notification.propertyType === 'Hotel / Shortlet' || notification.propertyType === 'Event' || notification.propertyType === 'Recreation') && notification.status === 'PAID' && (
        <div className="viewConInfoRow">
          <button
            className="view"
            onClick={() => onStatusChange('CHECKED_IN')}
          >
            <p className='dAlaBtnTxt'>
              Checked In
            </p>
          </button>
          <button
            className="infoIconCon"
            onClick={() => alert('Booking Info: Click on "Checked In" once client has checked in.')}
          >
            <FaInfoCircle className="infoIcon" />
          </button>
        </div>
      )}

      {notification.propertyType === 'Hotel / Shortlet' && notification.status === 'CHECKED_IN' && (
        <div className="viewConInfoRow">
          <button
            className="view"
            onClick={() => onStatusChange('CHECKED_OUT')}
          >
            <p className='dAlaBtnTxt'>
              Checked Out
            </p>
          </button>
          <button
            className="infoIconCon"
            onClick={() => alert('Booking Info: Click on "Checked Out" once client has checked out.')}
          >
            <FaInfoCircle className="infoIcon" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailedAlert;