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
    <div className="dAlatContainer">
      <h2 className="dAlatHeader">Guest Details</h2>

      {/* Details */}
      <div className="scrollView">
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

        {/* Client Info */}
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

        {/* Other Info */}
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
              navigate(`/admin/exploredetailedpost/${notification?.post?.id}`);
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

        {/* Overall Price */}
        <h3 className="dAlatSubHeader">
          OverAll Price:
        </h3>
        <p className="dAlatDetails">
          ₦{Number(notification?.overAllPrice).toLocaleString()}
        </p>

        {/* Service Charge */}
        <h3 className="dAlatSubHeader">
          Service Charge:
        </h3>
        <p className="dAlatDetails">
          ₦{Number(notification?.serviceCharge).toLocaleString()}
        </p>

        {/* Opusama Commission */}
        <h3 className="dAlatSubHeader">
          Opusama Commission:
        </h3>
        <p className="dAlatDetails">
          ₦{Number(notification?.opusamaCommission).toLocaleString()}
        </p>
        
        {/* Vendor Price */}
        {notification?.realtorPrice && (
          <>
            <h3 className="dAlatSubHeader">Vendor Price:</h3>
            <p className="dAlatDetails">₦{Number(notification?.realtorPrice).toLocaleString()}</p>
          </>
        )}

        {/* Status */}
        <div className="statusRow">
          <p className="status">{getStatusText(notification?.status)}</p>
          <div
            className={notification?.status === 'ACCEPTED' ? 'greenIcon' : 'redIcon'}
          ></div>
        </div>
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
              <p className='dAlaBtnTxt'>
                Accept
              </p>
            </button>
            <button
              className="occupied"
              onClick={() =>
                window.confirm(
                  'By clicking this, you want the client to try another listing because this is unavailable.'
                ) && onStatusChange('OCCUPIED') && navigate(-1)
              }
            >
              <p className='dAlaBtnTxt'>
                Try another
              </p>
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
            <p className='dAlaBtnTxt'>
              Deny
            </p>
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
            <p className='dAlaBtnTxt'>
              Remove
            </p>
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailedAlert;