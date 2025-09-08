import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { DataStore } from "aws-amplify/datastore";
import { Booking, Notification } from "../../../../../../../../models";
import "./ReviewShowing.css"; 
import { useAuthContext } from "../../../../../../../../../Providers/ClientProvider/AuthProvider";
import { useBookingShowingContext } from "../../../../../../../../../Providers/ClientProvider/BookingShowingProvider";

const ReviewClientDetails = () => {
  const navigate = useNavigate();
  const { dbUser } = useAuthContext();
  const {
    selectedOption, 
    setSelectedOption,
    setBookings,
    adults,
    setAdults,
    kids,
    setKids,
    infants,
    setInfants,
    numberOfPeople, 
    setNumberOfPeople,
    numberOfItems, 
    setNumberOfItems,
    guestFirstName,
    setGuestFirstName,
    guestLastName,
    setGuestLastName,
    guestPhoneNumber,
    setGuestPhoneNumber,
    note,
    setNote,
    propertyDetails,
    PostID,
    setPostID,
    setPropertyDetails,
    propertyType,
    setPropertyType,
    nameOfType,
    setNameOfType,
    accommodationType,
    setAccommodationType,
    realtorContext,
    bookingLat,
    setBookingLat,
    bookingLng,
    setBookingLng,
    setRealtorContext,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    duration,
    setDuration,
    bookedSessionDuration, 
    setBookedSessionDuration,
    subscription, 
    setSubscription,
    postPrice,
    setPostPrice,
    postCautionFee,
    setPostCautionFee,
    postOtherFeesName, 
    setPostOtherFeesName,
    postOtherFeesPrice, 
    setPostOtherFeesPrice,
    postOtherFeesName2, 
    setPostOtherFeesName2,
    postOtherFeesPrice2, 
    setPostOtherFeesPrice2,
    postTotalPrice,
    setPostTotalPrice,
    overAllPrice,
    setOverAllPrice,
    realtorPrice,
    setRealtorPrice,
  } = useBookingShowingContext();

  const [loading, setLoading] = useState(false);

  const getPriceLabel = () => {
    if (propertyDetails?.propertyType === "Hotel / Shortlet" || propertyDetails?.propertyType === "Recreation") {
      return "Sub Total:";
    } else {
      return "Price:";
    }
  };

  useEffect(() => {
    if (propertyDetails) {
      setPropertyType(propertyDetails.propertyType);
      setPostID(propertyDetails.id);
      setAccommodationType(propertyDetails.type);
      setNameOfType(propertyDetails.nameOfType);
      setBookingLat(propertyDetails.lat);
      setBookingLng(propertyDetails.lng);
      setRealtorPrice(overAllPrice);
    }
  }, [propertyDetails, overAllPrice]);

  const handleBooking = async () => {
    if (loading) return;
    if (!postTotalPrice) {
      alert("Error: Incompelete details. Booking cannot proceed.");
      return; 
    }

    setLoading(true);

    try {
      const booking = await DataStore.save(
        new Booking({ 
          adults,
          kids,
          infants,
          numberOfPeople,
          numberOfItems,
          clientFirstName: guestFirstName,
          clientLastName: guestLastName,
          clientPhoneNumber: guestPhoneNumber,
          purpose: note,
          selectedOption,
          duration: String(duration),
          checkInDate: String(checkInDate),
          checkOutDate: String(checkOutDate),
          bookedSessionDuration: bookedSessionDuration.label,
          subscription,
          propertyType,
          nameOfType,
          accommodationType,
          bookingLat,
          bookingLng,
          totalPrice: parseFloat(overAllPrice),
          realtorPrice: parseFloat(realtorPrice),
          userID: dbUser.id,
          realtorID: realtorContext.id,
          PostID,
          status: propertyType === "Recreation" ? "ACCEPTED" : "PENDING",
        })
      );

      await DataStore.save(
        new Notification({
          creatorID: dbUser?.id,
          recipientID:realtorContext.id,
          recipientType: 'BOOKING_REALTOR',
          type: ["Hotel / Shortlet", "Nightlife", "Recreation"].includes(propertyType) ? "BOOKING" : "SHOWING",
          entityID: booking.id,
          message: `A client made a booking for your ${propertyType} (${accommodationType})`,
          read: false,
        })
      );
      
      setBookings(booking);
      alert("Booking was a success");

      // Reset state
      setSelectedOption(null);
      setAdults(0);
      setKids(0);
      setInfants(0);
      setNumberOfPeople(0);
      setNumberOfItems(0)
      setGuestFirstName(dbUser?.firstName);
      setGuestLastName(dbUser?.lastName);
      setGuestPhoneNumber(dbUser?.phoneNumber);
      setNote("");
      setDuration("");
      setCheckInDate("");
      setCheckOutDate("");
      setBookedSessionDuration("");
      setSubscription(false);
      setPostOtherFeesName("");
      setPostOtherFeesPrice("");
      setPostOtherFeesName2("");
      setPostOtherFeesPrice2("");
      setPostTotalPrice("");
      setPostCautionFee("");
      setOverAllPrice("");
      setRealtorPrice("");
      setPostID("");
      setPropertyDetails("");
      setPropertyType("");
      setNameOfType("");
      setAccommodationType("");
      setBookingLat("");
      setBookingLng("");
      setRealtorContext("");
      navigate("/clientcontent/home");
    } catch (e) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reviewContainer">
      <h1 className="header">Review Info</h1>

      {/* Backbutton */}
      <button 
        className='detailBkContainer' 
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon 
          icon={faArrowLeft}
          className='detailBckIcon' 
          size="2x"
        />
      </button>

      <div className="scrollContainer">
        <div className="guestUnit">
          {adults > 0 && (
            <div>
              <h4>Adults:</h4>
              <p className="unitTxt">{adults}</p>
            </div>
          )}
          {kids > 0 && (
            <div>
              <h4>Children:</h4>
              <p className="unitTxt">{kids}</p>
            </div>
          )}
          {infants > 0 && (
            <div>
              <h4>Infants:</h4>
              <p className="unitTxt">{infants}</p>
            </div>
          )}

          {numberOfPeople > 0 && (
            <div>
              <h4>Number Of People:</h4>
              <p className="unitTxt">{numberOfPeople}</p>
            </div>
          )}

          {numberOfItems > 0 && (
            <div>
              <h4>Number Of items:</h4>
              <p className="unitTxt">{numberOfItems}</p>
            </div>
          )}

        </div>
        <h4>First Name(s):</h4>
        <p className="txtInputReview">{guestFirstName?.trim()}</p>

        <h4>Last Name(s):</h4>
        <p className="txtInputReview">{guestLastName?.trim()}</p>

        <h4>Phone Number(s):</h4>
        <p className="txtInputReview">{guestPhoneNumber}</p>

        <h4>Purpose of stay:</h4>
        <p className="txtInputReview">{note?.trim()}</p>

        {selectedOption?.bookingPostOptionType &&
          <div>
            <h4>Type</h4>
            <p className="txtInputReview"> {selectedOption.bookingPostOptionType}</p>
          </div>
        }
        
        {selectedOption?.optionPrice &&
          <div>
            <h4>Sub Price</h4>
            <p className="txtInputReview">₦{selectedOption.optionPrice?.toLocaleString()}</p>
          </div>
        }

        {selectedOption?.bookingName && (
          <div>
            <h4>Booking Name:</h4>
            <p className="txtInputReview">{selectedOption.bookingName}</p>
          </div>
        )}

        {checkInDate && (
          <>
            <h4>Selected Date:</h4>
            <p className="txtInputReview">{checkInDate}</p>
          </>
        )}

        {checkOutDate && (
          <>
            <h4>Selected Date:</h4>
            <p className="txtInputReview">{checkOutDate}</p>
          </>
        )}

        {bookedSessionDuration && (
          <>
            <h4>Booked Session:</h4>
            <p className="txtInputReview">{bookedSessionDuration.label}</p>
          </>
        )}

        {subscription && (
          <>
            <h4>Booking Type:</h4>
            <p className="txtInputReview">Subscription</p>
          </>
        )}

        {postCautionFee && (
          <>
            <h4>Caution Fee:</h4>
            <p className="txtInputReview">₦{postCautionFee?.toLocaleString()} (already added)</p>
          </>
        )}

        {postOtherFeesPrice && (
          <>
            <h4>{postOtherFeesName}:</h4>
            <p className="txtInputReview">₦{postOtherFeesPrice?.toLocaleString()} (already added)</p>
          </>
        )}

        {postOtherFeesPrice2 && (
          <>
            <h4>{postOtherFeesName2}:</h4>
            <p className="txtInputReview">₦{postOtherFeesPrice2?.toLocaleString()} (already added)</p>
          </>
        )}

        {postTotalPrice && (
          <>
            <h4>
              {getPriceLabel()}
            </h4>
            <p className="txtInputReview">₦{postTotalPrice?.toLocaleString()}</p>
          </>
        )}

        {overAllPrice && (
          <div className="lastReviewInputClient">
            <h4>Total:</h4>
            <p className="txtInputReview">₦{overAllPrice?.toLocaleString()}</p>
          </div>
        )}
      </div>
      <button
        className="paymentBtn"
        onClick={handleBooking}
        disabled={loading}
      >
        <p className="paymentTxt">
          {propertyDetails?.propertyType === "Hotel / Shortlet"
          ? "Book"
          : "Get In Touch"}
        </p>
      </button>
    </div>
  );
};

export default ReviewClientDetails;