import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingSingle.css'; // Replace styles with a CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const BookingSingle = ({ booking, onDelete, onUpdateStatus }) => {
  const navigate = useNavigate();

  const handleViewingClick = () => {
    onUpdateStatus(booking.id, 'VIEWING');
  };

  const handleViewedClick = () => {
    onUpdateStatus(booking.id, 'VIEWED');
  };

  const handleRemove = () => {
    if (
      ['VIEWED', 'CHECKED_OUT', 'VISITED', 'PAID', 'SOLD'].includes(
        booking.status
      )
    ) {
      onUpdateStatus(booking.id, 'REMOVED_CLIENT');
    } else {
      alert(
        'Action Not Allowed: You can only remove bookings with statuses VIEWED, CHECKED_OUT, VISITED, or SOLD.'
      );
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: 'Pending',
      ACCEPTED: 'Accepted',
      VIEWING: 'Viewing',
      CHECKED_IN: 'Checked In',
      VISITING: 'Visiting',
      VIEWED: 'Viewed',
      CHECKED_OUT: 'Checked Out',
      VISITED: 'Visited',
      SOLD: 'Sold',
      PAID: 'Paid',
      RECEIVED: 'Received',
      DENIED: 'Denied',
      REMOVED_CLIENT: 'Removed',
    };
    return statusMap[status] || 'Pending';
  };

  const validPropertyTypes = [
    'House Rent',
    'Student Accommodation',
    'House Sale',
    'Land Sale',
    'Office Space',
  ];

  return (
    <div className="bookingSingleContainer">
      {/* Remove Button */}
      {booking.status === 'DENIED' && (
        <button className="bkRemoveBtn" onClick={(e) =>{
          e.stopPropagation();
          onDelete()
        }}>
          <FontAwesomeIcon icon={faRemove} />
        </button>
      )}

      {/* Navigate to Booking Details */}
      <div onClick={() => navigate(`/clientcontent/bookingdetails/${booking.id}`)}>
        <h3 className="subHeading">Realtor:</h3>
        <p className="detail">{booking?.realtor?.firstName}</p>

        {/* Property Details */}
        <div onClick={(e) => {
          e.stopPropagation(); // Prevent the event from propagating to the parent div
          navigate(`/clientcontent/detailedpost/${booking.PostID}`);
          }}>
          <h4
            className="subHeadingClick"
          >Accommodation Type (Click to view):</h4>
          <p className="detail">{booking?.propertyType}</p>
        </div>

        {/* Conditions to show if it is hotels/shortlets */}
        {booking.nameOfType && (
          <div>
            <h4 className="subHeading">Accommodation Name:</h4>
            <p className="detail">{booking?.nameOfType}</p>
          </div>
        )}

        {booking.checkInDate && (
          <>
            <h4 className="subHeading">Check-in:</h4>
            <p className="detail">{booking?.checkInDate.substring(0, 17)}</p>
          </>
        )}

        {booking.checkOutDate && (
          <>
            <h4 className="subHeading">Check-out:</h4>
            <p className="detail">{booking?.checkOutDate.substring(0, 17)}</p>
          </>
        )}

        {/* Booking Status */}
        <h4 className="subHeading">Status:</h4>
        <div className="statusRow">
          <p className="detail">{getStatusText(booking.status)}</p>
          {(booking.status === 'ACCEPTED' || booking.status === 'VIEWING' || booking.status === 'CHECKED_IN' || booking.status === 'VISITING' || booking.status === 'VIEWED' || booking.status === 'CHECKED_OUT' || booking.status === 'VISITED' || booking.status === 'PAID' || booking.status === 'RECEIVED') ? (
              <div className='greenIcon'/>
            ):(
              <div className='redIcon'/>
          )}
        </div>

        {/* if status is PENDING */}
        {booking.status === 'PENDING' && (
          <p className='wait'>Kindly wait for response of Realtor to get contact</p>
        )}

        {/* if status is ACCEPTED */}
        {booking.status === 'ACCEPTED' && (
          <p className='wait'>Kindly click on card to get Realtor's contact</p>
        )}

        {/* Button Section */}

        {/* If booking status is PENDING */}
        {booking.status === 'PENDING' && (
          <div className='middleCon'>
            <button
              className="deleteButtonCon"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this booking?')) {
                  onDelete();
                }
              }}
            >
              <p className='deleteButtonTxt'>
                {booking.propertyType === 'Hotel / Shortlet' ? 'Delete Booking' : 'Delete Showing'}
              </p>
            </button>
          </div>
        )}

        {booking.status === 'ACCEPTED' && validPropertyTypes.includes(booking.propertyType) && (
          <div className="viewConInfoRow">
            {booking.post?.inspectionFee ? (
              <button className="viewCon" onClick={(e) =>{
                  e.stopPropagation();
                  navigate(`/clientcontent/payment`)
                }}>
                  <p className='viewTxt'>
                    Make Payment
                  </p>    
              </button>
            ) : (
              <button className="viewCon" onClick={(e) => {
                e.stopPropagation();
                handleViewingClick()
              }}>
                <p className='viewTxt'>Viewing</p>
              </button>
            )}

            {/* Info Icon */}
            <button
              className="infoIconCon"
              onClick={(e) =>{
                e.stopPropagation();
                alert(
                  booking.post?.inspectionFee
                    ? 'Click on "Make Payment" to proceed with the payment for the inspection fee.'
                    : 'Click on "Viewing" once you are viewing the property.'
                )
              }}
            >
              <FontAwesomeIcon icon={faInfoCircle} className='infoIcon'/>
            </button>
          </div>
        )}

        {booking.status === 'VIEWING' && validPropertyTypes.includes(booking.propertyType) && (
          <div className="viewConInfoRow">
            <button className="viewCon" onClick={(e)=>{
              e.stopPropagation();
              handleViewedClick()
            }}>
              <p className='viewTxt'>
                Viewed
              </p>
            </button>

            {/* Info Icon */}
            <button className="infoIconCon" onClick={(e) => {
              e.stopPropagation();
              alert('Click on "Viewed" once you are done viewing the property.')
              }}>
              <FontAwesomeIcon icon={faInfoCircle} className='infoIcon' />
            </button>
          </div>
        )}

        {['VIEWED', 'CHECKED_OUT', 'VISITED', 'SOLD', 'RECEIVED'].includes(booking.status) && (
          <div className='middleCon'>
            <button
              className="delCon"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to remove this booking?')) {
                  handleRemove();
                }
              }}
            >
              <p className='removeTxt'>
                Remove
              </p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSingle;