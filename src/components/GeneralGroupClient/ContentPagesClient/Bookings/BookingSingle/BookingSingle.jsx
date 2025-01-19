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
        <button className="removeButton" onClick={onDelete}>
          <FontAwesomeIcon icon={faRemove} />
        </button>
      )}

      {/* Navigate to Booking Details */}
      <div onClick={() => navigate(`/bookings/bookingdetail/fulldetails/${booking.id}`)}>
        <h3 className="subHeading">Realtor:</h3>
        <p className="detail">{booking?.realtor?.firstName}</p>

        {/* Property Details */}
        <div onClick={() => navigate(`/bookings/bookedproperty/propertydetails/${booking.PostID}`)}>
          <h4 className="subHeading">Accommodation Type (Click to view):</h4>
          <p className="detail">{booking?.propertyType}</p>
        </div>

        {booking.nameOfType && (
          <>
            <h4 className="subHeading">Accommodation Name:</h4>
            <p className="detail">{booking?.nameOfType}</p>
          </>
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
          <div
            className={`statusIcon ${
              ['ACCEPTED', 'VIEWING', 'CHECKED_IN', 'VISITING', 'VIEWED', 'CHECKED_OUT', 'VISITED', 'PAID', 'RECEIVED'].includes(
                booking.status
              )
                ? 'green'
                : 'red'
            }`}
          ></div>
        </div>

        {/* Conditional Buttons */}
        {booking.status === 'PENDING' && (
          <button
            className="deleteButton"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this booking?')) {
                onDelete();
              }
            }}
          >
            {booking.propertyType === 'Hotel / Shortlet' ? 'Delete Booking' : 'Delete Showing'}
          </button>
        )}

        {booking.status === 'ACCEPTED' && validPropertyTypes.includes(booking.propertyType) && (
          <div className="actionRow">
            {booking.post?.inspectionFee ? (
              <button className="actionButton" onClick={() => navigate(`/bookings/bookingdetail/fulldetails/${booking.id}`)}>
                Make Payment
              </button>
            ) : (
              <button className="actionButton" onClick={handleViewingClick}>
                Viewing
              </button>
            )}
            <button
              className="infoButton"
              onClick={() =>
                alert(
                  booking.post?.inspectionFee
                    ? 'Click on "Make Payment" to proceed with the payment for the inspection fee.'
                    : 'Click on "Viewing" once you are viewing the property.'
                )
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
            </button>
          </div>
        )}

        {booking.status === 'VIEWING' && validPropertyTypes.includes(booking.propertyType) && (
          <div className="actionRow">
            <button className="actionButton" onClick={handleViewedClick}>
              Viewed
            </button>
            <button className="infoButton" onClick={() => alert('Click on "Viewed" once you are done viewing the property.')}>
              <FontAwesomeIcon icon={faInfoCircle} />
            </button>
          </div>
        )}

        {['VIEWED', 'CHECKED_OUT', 'VISITED', 'SOLD', 'RECEIVED'].includes(booking.status) && (
          <button
            className="deleteButton"
            onClick={() => {
              if (window.confirm('Are you sure you want to remove this booking?')) {
                handleRemove();
              }
            }}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingSingle;