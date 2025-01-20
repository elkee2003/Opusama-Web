import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';
import './BookingDetails.css'; 
import { useProfileContext } from '../../../../../../../Providers/ClientProvider/ProfileProvider';

const BookingDetails = ({ notification, onStatusChange }) => {
  const navigate = useNavigate();
  const { isPaymentSuccessful, setIsPaymentSuccessful, setPaymentPrice } = useProfileContext();

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

  // Handle Viewing button click
  const handleViewingClick = () => {
    onStatusChange('VIEWING');
  };

  // Handle Viewed button click
  const handleViewedClick = () => {
    onStatusChange('VIEWED');
  };

  // Handle Check-in button click
  const handleCheckedInClick = () => {
    onStatusChange('CHECKED_IN');
  };

  // Handle Check-out button click
  const handleCheckedOutClick = () => {
    onStatusChange('CHECKED_OUT');
  };

  // Handle Visiting button click
  const handleVisitingClick = () => {
    onStatusChange('VISITING');
  };

  // Handle Visited button click
  const handleVisitedClick = () => {
    onStatusChange('VISITED');
  };

  // Handle Payment
  const handlePayment = () => {
    // Redirect to payment page
   navigate('/clientcontent/payment');
  };

  useEffect(() => {
    if (isPaymentSuccessful) {
      onStatusChange('PAID');
      setIsPaymentSuccessful(false);
    }
  }, [isPaymentSuccessful]);

  const renderButton = () => {
    if (notification.status === 'ACCEPTED') {
      if (
        ['House Rent', 'Student Accommodation', 'House Sale', 'Land Sale', 'Office Space'].includes(
          notification.propertyType
        )
      ) {
        return (
          <div className="viewConInfoRow">
            {notification?.post?.inspectionFee ? (
              <button className="view" onClick={handlePayment}>
                <p className='bkBtnTxt'>
                  Make Payment
                </p>
              </button>
            ) : (
              <button className="view" onClick={handleViewingClick}>
                <p className='bkBtnTxt'>
                  Viewing
                </p>
              </button>
            )}
            <button
              className="infoIconCon"
              onClick={() =>
                alert(
                  notification?.post?.inspectionFee
                    ? 'Click on "Make Payment" to proceed with the payment for the inspection fee.'
                    : 'Click on "Viewing" once you are viewing the property.'
                )
              }
            >
              <FaInfoCircle className="infoIcon" />
            </button>
          </div>
        );
      } else if (notification.propertyType === 'Hotel / Shortlet') {
        return (
          <div className="viewConInfoRow">
            <button className="view" onClick={handlePayment}>
              <p className='bkBtnTxt'>
                Make Payment
              </p>
            </button>

            {/* Info Icon */}
            <button
              className="infoIconCon"
              onClick={() => alert('Click on "Make Payment" to pay for your booked accommodation.')}
            >
              <FaInfoCircle className="infoIcon" />
            </button>
          </div>
        );
      }else {
        return (
          <div className="viewConInfoRow">
            {/* Button */}
            <button className="view" onPress={handleVisitingClick}>
              <p className="bkBtnTxt">Visiting</p>
            </button>

            {/* Info Icon */}
            <button 
              className="infoIconCon"
              onClick={() => alert('Click on "Visiting" once you are on the property.')}
            >
              <FaInfoCircle className="infoIcon" />
            </button>
          </div>
        );
      }
    }

    if (notification.status === 'VIEWING') {
      if (['House Rent', 'Student Accommodation', 'House Sale', 'Land Sale', 'Office Space'].includes(notification.propertyType)){
        return (
          <div className="viewConInfoRow">
            <button className="view" onClick={handleViewedClick}>
              <p className='bkBtnTxt'>
                Viewed
              </p>
            </button>

            {/* Info Icon */}
            <button
              className="infoIconCon"
              onClick={() => alert('Click on "Viewed" once you are done viewing the property.')}
            >
              <FaInfoCircle className="infoIcon" />
            </button>
          </div>
        );
      }
    }

    if (notification.status === 'PAID' && notification.propertyType === 'Hotel / Shortlet') {
      return (
        <div className="viewConInfoRow">
          <button className="view" onClick={handleCheckedInClick}>
            <p className='bkBtnTxt'>
              Checked In
            </p>
          </button>

          {/* Info Icon */}
          <button
            className="infoIconCon"
            onClick={() => alert('Click on "Checked In" once you are checked into the hotel/shortlet.')}
          >
            <FaInfoCircle className="infoIcon" />
          </button>
        </div>
      );
    }

    if (notification.status === 'CHECKED_IN') {
      if (notification.propertyType === 'Hotel / Shortlet') {
        return (
          <div className="viewConInfoRow">
            {/* Button */}
            <button style={styles.view} onClick={handleCheckedOutClick}>
              <p className="bkBtnTxt">Checked Out</p>
            </button>

            {/* Info Icon */}
            <button 
              className="infoIconCon"
              onClick={() => alert('Click on "Checked Out" once you are out of the hotel/shortlet.')}
            >
              <FaInfoCircle className="infoIcon" />
            </button>
          </div>
        );
      } else {
        return (
          <div className="viewConInfoRow">
            {/* Button */}
            <button className="view" onClick={handleVisitedClick}>
              <p className="bkBtnTxt">Visited</p>
            </button>

            {/* Info Icon */}
            <button 
              className="infoIconCon"
              onClick={() => alert('Click on "Visited" once you are off the property.')}
            >
              <FaInfoCircle className="infoIcon" />
            </button>
          </div>
        );
      }
    }

    return null;
  };

  useEffect(()=>{
    if(notification?.post?.inspectionFee){
      setPaymentPrice(notification?.post?.inspectionFee)
    }else{
      setPaymentPrice(notification?.totalPrice)
    }
  }, [notification])

  return (
    <div className="bkDetailsContainer">
      <div className="scrollview" style={{ overflowY: 'auto' }}>
        {/* Realtor's Details */}
        {notification.status === 'ACCEPTED' && (
          <div>
            <h2 className="header">Realtor's Details</h2>
            {notification?.realtor?.phoneNumber && (
              <div>
                {/* Realtor's name */}
                <h3 className="bkSubHeader">Realtor Name:</h3>
                <p className="detailsRealtor">{notification?.realtor?.firstName}</p>

                {/* Realtor's phone number */}
                <h3 className="bkSubHeader">Realtor Phone Number:</h3>
                <p className="detailsRealtor">{notification?.realtor?.phoneNumber}</p>
              </div>
            )}

            {/* Show account details if ACCEPTED & Hotel/Shortlet */}
            {notification.status === 'ACCEPTED' &&
              notification.propertyType === 'Hotel / Shortlet' && (
                <div>
                  <h3 className="bkSubHeader">Bank Name:</h3>
                  <p className="detailsRealtor">{notification?.realtor?.bankname}</p>

                  <h3 className="bkSubHeader">Account Name:</h3>
                  <p className="detailsRealtor">{notification?.realtor?.accountName}</p>

                  <h3 className="bkSubHeader">Account Number:</h3>
                  <p className="detailsRealtor">{notification?.realtor?.accountNumber}</p>
                </div>
              )}
          </div>
        )}

        {/* Client's Details */}
        <h2 className="header">My Details</h2>
        <div className="bkGuestUnit">
          {/* Adults */}
          {notification?.adults && (
            <div>
              <h3 className="bkSubHeader">Adults:</h3>
              <p className="bkUnitTxt">{notification.adults}</p>
            </div>
          )}

          {/* Children */}
          {notification?.kids && (
            <div>
              <h3 className="bkSubHeader">Children:</h3>
              <p className="bkUnitTxt">{notification.kids}</p>
            </div>
          )}

          {/* Infants */}
          {notification?.infants && (
            <div>
              <h3 className="bkSubHeader">Infants:</h3>
              <p className="bkUnitTxt">{notification.infants}</p>
            </div>
          )}
        </div>

        {/* FirstName */}
        {notification?.clientFirstName && (
          <div>
            <h3 className="bkSubHeader">Name(s):</h3>
            <p className="bkDetails">{notification?.clientFirstName}</p>
          </div>
        )}

        {/* LastName */}
        {notification?.clientLastName && (
          <div>
            <h3 className="bkSubHeader">Last Name(s):</h3>
            <p className="bkDetails">{notification?.clientLastName}</p>
          </div>
        )}

        {/* Phone Number */}
        {notification?.clientPhoneNumber && (
          <div>
            <h3 className="bkSubHeader">Phone Number:</h3>
            <p className="bkDetails">{notification?.clientPhoneNumber}</p>
          </div>
        )}

        {/* Note */}
        {notification?.purpose && (
          <div>
            <h3 className="bkSubHeader">Purpose:</h3>
            <p className="bkDetails">{notification?.purpose}</p>
          </div>
        )}

        {/* Duration */}
        {notification?.duration && (
          <div>
            <h3 className="bkSubHeader">Duration:</h3>
            <p className="bkDetails">{notification?.duration}</p>
          </div>
        )}

        {/* Check-in */}
        {notification?.checkInDate && (
          <div>
            <h3 className="bkSubHeader">Check-in:</h3>
            <p className="bkDetails">{notification?.checkInDate}</p>
          </div>
        )}

        {/* Check-out */}
        {notification.checkOutDate && (
          <div>
            <h3 className="bkSubHeader">Check-out:</h3>
            <p className="bkDetails">{notification?.checkOutDate}</p>
          </div>
        )}

        {/* Accommodation Type */}
        {notification.propertyType && (
          <div>
            <h3 className="bkSubHeader">Accommodation Type:</h3>
            <p className="bkDetails">{notification?.propertyType}</p>
          </div>
        )}

        {/* Room Type */}
        {notification.accommodationType && (
          <div>
            <h3 className="bkSubHeader">
              {notification.propertyType === 'Hotel / Shortlet' ? 'Room Type:' : 'Property Type:'}
            </h3>
            <p className="bkDetails">{notification?.accommodationType}</p>
          </div>
        )}

        {/* Room name */}
        {notification.nameOfType && (
          <div>
            <h3 className="bkSubHeader">Room Name:</h3>
            <p className="bkDetails">{notification?.nameOfType}</p>
          </div>
        )}

        {/* Total Price */}
        {notification.realtorPrice && (
          <div>
            <h3 className="bkSubHeader">Price:</h3>
            <p className="bkDetails">₦{Number(notification.totalPrice)?.toLocaleString()}</p>
          </div>
        )}

        {/* Inspection Fee */}
        {notification?.post?.inspectionFee && (
          <div>
            <h3 className="bkSubHeader">Inspection Fee:</h3>
            <p className="bkDetails">₦{Number(notification?.post?.inspectionFee)?.toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="statusRow">
        <p className="status">{getStatusText(notification.status)}</p>
        {['ACCEPTED', 'VIEWING', 'CHECKED_IN', 'VISITING', 'VIEWED', 'CHECKED_OUT', 'VISITED', 'PAID', 'RECEIVED'].includes(notification.status) ? (
          <div className="greenIcon"></div>
        ) : (
          <div className="redIcon"></div>
        )}
      </div>

      {/* Show Button */}
      {renderButton()}
    </div>
  );
};

export default BookingDetails;