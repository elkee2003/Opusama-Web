import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';
import './BookingDetails.css'; 
import TicketQRCode from '../QRCode/TicketQRCode';
import { useProfileContext } from '../../../../../../../../Providers/ClientProvider/ProfileProvider';
import { useBookingShowingContext } from '../../../../../../../../Providers/ClientProvider/BookingShowingProvider';

const BookingDetails = ({ booking, realtor, post, opusedBy, onStatusUpdateChange }) => {
  const navigate = useNavigate();
  const { isPaymentSuccessful, setIsPaymentSuccessful, setPaymentPrice } = useProfileContext();
  const {setCurrentBooking, transactionReference, transactionStatus, onStatusChange}= useBookingShowingContext();

  useEffect(() => {
    if (booking?.id) {
      setCurrentBooking(booking);
    }
  }, [booking, setCurrentBooking]);

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
      DELAYED_PAYMENT: 'Delayed Payment',
      RECEIVED: 'Received',
      OCCUPIED:'Occupied, try another listing',
      DENIED: 'Denied',
      REMOVED_CLIENT: 'Removed',
    };
    return statusMap[status] || 'Pending';
  };

  // Handle Viewing button click
  const handleViewingClick = () => {
    onStatusUpdateChange('VIEWING');
  };

  // Handle Viewed button click
  const handleViewedClick = () => {
    onStatusUpdateChange('VIEWED');
  };

  // Handle Check-in button click
  const handleCheckedInClick = () => {
    onStatusUpdateChange('CHECKED_IN');
  };

  // Handle Check-out button click
  const handleCheckedOutClick = () => {
    onStatusUpdateChange('CHECKED_OUT');
  };

  // Handle Visiting button click
  const handleVisitingClick = () => {
    onStatusUpdateChange('VISITING');
  };

  // Handle Visited button click
  const handleVisitedClick = () => {
    onStatusUpdateChange('VISITED');
  };

  // Handle Paid button click
  const handlePaidClick = () => {
    // fallback if triggered manually, without payment
    onStatusUpdateChange('PAID');
  };

  // Handle Payment
  const handlePayment = () => {
   navigate('/clientcontent/payment');
  };

  useEffect(() => {
    if (isPaymentSuccessful && transactionReference && transactionStatus && !booking.ticketID) {
      setIsPaymentSuccessful(false);
    }
  }, [isPaymentSuccessful, transactionReference, transactionStatus, booking?.ticketID]);
  
  const renderButton = () => {
    if (booking?.status === 'ACCEPTED') {
      if (
        ['House Rent', 'Student Accommodation', 'House Sale', 'Land Sale', 'Office Space'].includes(
          booking.propertyType
        )
      ) {
        return (
          <div className="viewConInfoRow">
            {post?.inspectionFee ? (
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
                  post?.inspectionFee
                    ? 'Click on "Make Payment" to proceed with the payment for the inspection fee.'
                    : 'Click on "Viewing" once you are viewing the property.'
                )
              }
            >
              <FaInfoCircle className="infoIcon" />
            </button>
          </div>
        );
      } else if (booking?.propertyType === 'Hotel / Shortlet') {
        return (
          <div className="viewConInfoRow">
            {/* <button className="view" onClick={handlePaidClick}>
              <p className='bkBtnTxt'>
                Paid
              </p>
            </button> */}

            {/* When I fix flutter wave, I will uncomment */}
            <button className="view" onClick={handlePayment}>
              <p className='bkBtnTxt'>
                Make Payment
              </p>
            </button>

            {/* Info Icon */}
            <button
              className="infoIconCon"
              onClick={() => alert('Click on "Paid" When you have transferred the money to account.')}
              // onClick={() => alert('Click on "Make Payment" to pay for your booked accommodation.')}
            >
              <FaInfoCircle className="infoIcon" />
            </button>
          </div>
        );
      }else {
        return (
          <div className="viewConInfoRow">
            {/* Button */}
            <button className="view" onClick={handleVisitingClick}>
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

    if (booking?.status === 'VIEWING') {
      if (['House Rent', 'Student Accommodation', 'House Sale', 'Land Sale', 'Office Space'].includes(booking?.propertyType)){
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

    if (booking?.status === 'PAID' && booking?.propertyType === 'Hotel / Shortlet') {
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

    if (booking?.status === 'CHECKED_IN') {
      if (booking?.propertyType === 'Hotel / Shortlet') {
        return (
          <div className="viewConInfoRow">
            {/* Button */}
            <button className='view' onClick={handleCheckedOutClick}>
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
    if(post?.inspectionFee){
      setPaymentPrice(post?.inspectionFee)
    }else{
      setPaymentPrice(booking?.totalPrice)
    }
  }, [booking])

  return (
    <div className="bkDetailsContainer">
      <div className="scrollview" style={{ overflowY: 'auto' }}>
        {/* Realtor's Details */}
        {booking?.status === 'ACCEPTED' && (
          <div>
            <h2 className="header">Vendor's Details</h2>
            {realtor?.phoneNumber && (
              <div>
                {/* Realtor's name */}
                <h3 className="bkSubHeader">Vendor Name:</h3>
                <p className="detailsRealtor">{realtor?.firstName}</p>

                {/* Realtor's phone number */}
                <h3 className="bkSubHeader">Vendor Phone Number:</h3>
                <p className="detailsRealtor">{realtor?.phoneNumber}</p>
              </div>
            )}

            {/* Show account details if ACCEPTED & Hotel/Shortlet */}
            {/* {booking.status === 'ACCEPTED' &&
              (booking.propertyType === 'Hotel / Shortlet' || booking.propertyType === 'Recreation') && (
                <div>
                  <h3 className="bkSubHeader">Bank Name:</h3>
                  <p className="detailsRealtor">{realtor?.bankname}</p>

                  <h3 className="bkSubHeader">Account Name:</h3>
                  <p className="detailsRealtor">{realtor?.accountName}</p>

                  <h3 className="bkSubHeader">Account Number:</h3>
                  <p className="detailsRealtor">{realtor?.accountNumber}</p>
                </div>
              )} */}
          </div>
        )}

        {/* Client's Details */}
        <h2 className="header">My Details</h2>
        <div className="bkGuestUnit">
          {/* Adults */}
          {booking?.adults && (
            <div>
              <h3 className="bkSubHeader">Adults:</h3>
              <p className="bkUnitTxt">{booking.adults}</p>
            </div>
          )}

          {/* Children */}
          {booking?.kids && (
            <div>
              <h3 className="bkSubHeader">Children:</h3>
              <p className="bkUnitTxt">{booking.kids}</p>
            </div>
          )}

          {/* Infants */}
          {booking?.infants && (
            <div>
              <h3 className="bkSubHeader">Infants:</h3>
              <p className="bkUnitTxt">{booking.infants}</p>
            </div>
          )}

          {/* Number Of People */}
          {booking?.numberOfPeople && (
            <div>
              <h3 className="bkSubHeader">Number Of People:</h3>
              <p className="bkUnitTxt">{booking.numberOfPeople}</p>
            </div>
          )}

          {/* Number Of Items */}
          {booking?.items && (
            <div>
              <h3 className="bkSubHeader">Number tickets/Vouchers:</h3>
              <p className="bkUnitTxt">{booking.items}</p>
            </div>
          )}
        </div>

        {/* Subscription */}
        {booking?.subscription && (
          <div>
            <h3 className="bkSubHeader">Booking Type:</h3>
            <p className="bkDetails">Subscription</p>
          </div>
        )}

        {/* FirstName */}
        {booking?.clientFirstName && (
          <div>
            <h3 className="bkSubHeader">Name(s):</h3>
            <p className="bkDetails">{booking?.clientFirstName}</p>
          </div>
        )}

        {/* LastName */}
        {booking?.clientLastName && (
          <div>
            <h3 className="bkSubHeader">Last Name(s):</h3>
            <p className="bkDetails">{booking?.clientLastName}</p>
          </div>
        )}

        {/* Phone Number */}
        {!booking?.opusedBy && booking?.clientPhoneNumber && (
          <div>
            <h3 className="bkSubHeader">Phone Number:</h3>
            <p className="bkDetails">{booking?.clientPhoneNumber}</p>
          </div>
        )}

        {/* Note */}
        {booking?.purpose && (
          <div>
            <h3 className="bkSubHeader">Purpose:</h3>
            <p className="bkDetails">{booking?.purpose}</p>
          </div>
        )}

        {/* Selected Options Type */}
        {booking?.selectedOption?.bookingPostOptionType && (
          <div>
            <h3 className="bkSubHeader">Selected Type:</h3>
            <p className="bkDetails">{booking?.selectedOption.bookingPostOptionType}</p>
          </div>
        )}

        {/* Selected Options Name */}
        {booking?.selectedOption?.bookingName && (
          <div>
            <h3 className="bkSubHeader">Selected Name:</h3>
            <p className="bkDetails">{booking?.selectedOption.bookingName}</p>
          </div>
        )}

        {/* Selected Options Price */}
        {booking?.selectedOption?.optionPrice && (
          <div>
            <h3 className="bkSubHeader">Selected Price:</h3>
            <p className="bkDetails">{booking?.selectedOption.optionPrice}</p>
          </div>
        )}

        {/* Duration */}
        {booking?.duration && (
          <div>
            <h3 className="bkSubHeader">Duration:</h3>
            <p className="bkDetails">{booking?.duration}</p>
          </div>
        )}

        {/* Check-in */}
        {booking?.checkInDate && (
          <div>
            <h3 className="bkSubHeader">Check-in:</h3>
            <p className="bkDetails">{booking?.checkInDate}</p>
          </div>
        )}

        {/* Check-out */}
        {booking?.checkOutDate && (
          <div>
            <h3 className="bkSubHeader">Check-out:</h3>
            <p className="bkDetails">{booking?.checkOutDate}</p>
          </div>
        )}

        {/* Session Duration */}
        {booking?.bookedSessionDuration && (
          <div>
            <h3 className="bkSubHeader">Session Duration:</h3>
            <p className="bkDetails">{booking?.bookedSessionDuration}</p>
          </div>
        )}

        {/* Accommodation Type */}
        {booking?.propertyType && (
          <div
            className='opusableTypeCon'
            // onClick={()=>{
            //   navigate(`/clientcontent/exploredetailedpost/${booking.PostID}`);
            // }}
            onClick={()=>{
              navigate(`/clientcontent/booked_property_post/${booking.PostID}`);
            }}
          >
            <h3 className="bkSubHeader">Opusable Type (click to view):</h3>
            <p className="bkDetails">{booking?.propertyType}</p>
          </div>
        )}

        {/* Room Type */}
        {booking?.accommodationType && (
          <div>
            <h3 className="bkSubHeader">
              {booking.propertyType === 'Hotel / Shortlet' ? 'Room Type:' : 'Property Type:'}
            </h3>
            <p className="bkDetails">{booking?.accommodationType}</p>
          </div>
        )}

        {/* Room name */}
        {booking?.nameOfType && (
          <div>
            <h3 className="bkSubHeader">Room Name:</h3>
            <p className="bkDetails">{booking?.nameOfType}</p>
          </div>
        )}

        {/* Total Price */}
        {booking?.realtorPrice && (
          <div>
            <h3 className="bkSubHeader">Price:</h3>
            <p className="bkDetails">₦{Number(booking.totalPrice)?.toLocaleString()}</p>
          </div>
        )}

        {/* Inspection Fee */}
        {post?.inspectionFee && (
          <div>
            <h3 className="bkSubHeader">Inspection Fee:</h3>
            <p className="bkDetails">₦{Number(post?.inspectionFee)?.toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* QR Code */}
      {booking?.ticketID && (
        <div className='qrCodeCon'>
          <TicketQRCode 
            ticketId={booking.ticketID} 
            // ticketStatus={booking.ticketStatus}
            accommodationType={booking.accommodationType}
            propertyType={booking.propertyType}
          />
        </div>
      )}

      {/* Opused By */}
      {opusedBy && (
        <div className='opusedByCon'>
          <p>Opused by: {opusedBy.username}</p>
        </div>
      )}

      {/* Status */}
      <div className="statusRow">
        <p className="status">{getStatusText(booking?.status)}</p>
        {['ACCEPTED', 'VIEWING', 'CHECKED_IN', 'VISITING', 'VIEWED', 'CHECKED_OUT', 'VISITED', 'PAID', 'RECEIVED'].includes(booking?.status) ? (
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