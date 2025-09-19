import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShortAlert.css';

const ShortAlert = ({ notification, onUpdateStatus }) => {
  const TIMER_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
  const navigate = useNavigate();

  // Start the countdown and save the start time in localStorage
  const startCountdown = () => {
    const startTime = Date.now();
    localStorage.setItem(`timer_${notification.id}`, JSON.stringify(startTime));
    scheduleStatusUpdate(startTime);
  };

  // Schedule the status update after the remaining time
  const scheduleStatusUpdate = (startTime) => {
    const elapsed = Date.now() - startTime;
    const remainingTime = TIMER_DURATION - elapsed;

    if (remainingTime <= 0) {
      // If time has already passed, immediately update the status
      onUpdateStatus(notification.id, 'DELAYED_PAYMENT');
    } else {
      // Otherwise, set a timeout for the remaining time
      setTimeout(() => {
        onUpdateStatus(notification.id, 'DELAYED_PAYMENT');
      }, remainingTime);
    }
  };

  // Check if a countdown exists for this notification and resume if necessary
  const checkCountdown = () => {
    const startTime = localStorage.getItem(`timer_${notification.id}`);
    if (startTime) {
      scheduleStatusUpdate(JSON.parse(startTime));
    } else if (
      notification.propertyType === 'Hotel / Shortlet' &&
      notification.status === 'ACCEPTED'
    ) {
      startCountdown();
    }
  };

  // Clear the timer data from localStorage when the status changes
  const clearTimer = () => {
    localStorage.removeItem(`timer_${notification.id}`);
  };

  useEffect(() => {
    checkCountdown();

    return () => {
      clearTimer(); // Cleanup the timer when the component unmounts or the status changes
    };
  }, [notification.status]);

  const getStatusText = (status) => {
    if (status === 'PENDING') return 'Pending';
    if (status === 'ACCEPTED') return 'Accepted';
    if (status === 'VIEWING') return 'Viewing';
    if (status === 'CHECKED_IN') return 'Checked In';
    if (status === 'VISITING') return 'Visting';
    if (status === 'VIEWED') return 'Viewed';
    if (status === 'CHECKED_OUT') return 'Checked Out';
    if (status === 'VISITED') return 'Visited';
    if (status === 'SOLD') return 'Sold';
    if(status === 'DELAYED_PAYMENT') return 'Delayed Payment';
    if (status === 'PAID') return 'Paid';
    if (status === 'RECEIVED') return 'Received';
    if (status === 'OCCUPIED') return 'Occupied, try another listing';
    if (status === 'REMOVED_REALTOR') return 'Removed';
    if (status === 'REMOVED_REALTOR_PAYMENT_DELAYED') return 'Delayed Payment (Removed)';
    if (status === 'DENIED') return 'Denied';
    return 'Pending';
  };

  // Handle Remove function
  const handleRemove = () => {
    if (
      ['VIEWED', 'CHECKED_OUT', 'VISITED', 'PAID', 'SOLD'].includes(
        notification.status
      )
    ) {
      onUpdateStatus(notification.id, 'REMOVED_REALTOR');
    } else {
      alert(
        'Action Not Allowed: You can only remove bookings with statuses VIEWED, CHECKED_OUT, VISITED, or SOLD.'
      );
    }
  };

  return (
    <div className="alertContainer">
      <div
        className="alertCard"
        onClick={() =>
          navigate(`/realtorcontent/accepted_details/${notification.id}`)
        }
      >
        {/* Subscription */}
        {notification?.subscription && (
          <p className="alertDetails">
            <span className="alertDetailsSub">Booking Type:</span> Subscription
          </p>
        )}

        {/* First Name */}
        {notification.clientFirstName && (
          <p className="alertDetails">
            <span className="alertDetailsSub">Name:</span>{' '}
            {notification.clientFirstName}
          </p>
        )}

        {/* Property Type */}
        {notification.propertyType && (
          <p
            className="alertDetails"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/realtorcontent/postdetails/${notification?.post?.id}`);
            }}
          >
            <span className="alertDetailsSubClick">Opusable Type (click to view):</span>{' '}
            {notification.propertyType}
          </p>
        )}

        {/* Accommodation Type */}
        {notification.accommodationType && (
          <p className="alertDetails">
            <span className="alertDetailsSub">Type:</span>{' '}
            {notification.accommodationType}
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
          <span className="alertDetails">{getStatusText(notification.status)}</span>
          {['ACCEPTED', 'VIEWING', 'CHECKED_IN', 'VISITING', 'VIEWED', 'CHECKED_OUT', 'VISITED', 'PAID', 'SOLD', 'RECEIVED'].includes(notification.status) ? (
            <div className="greenIcon" />
          ) : (
            <div className="redIcon" />
          )}
        </div>

        {/* By account owner */}
        <p className="accOwner">by: {notification?.user?.firstName}</p>

        {/* Remove Button */}
        {(notification.status === 'VIEWED' ||
          notification.status === 'CHECKED_OUT' ||
          notification.status === 'VISITED' ||
          notification.status === 'SOLD' ||
          notification.status === 'RECEIVED') && (
          <button
            className="removeButton"
            onClick={(e) => {
              e.stopPropagation();
              if (
                window.confirm(
                  'Are you sure you want to remove this booking?'
                )
              ) {
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

export default ShortAlert;