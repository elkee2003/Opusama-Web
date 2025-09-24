import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { DataStore } from "aws-amplify/datastore";
import { Booking, Notification } from "../../../../../../../../models";
import "./ReviewShowing.css"; 
import { useAuthContext } from "../../../../../../../../../Providers/ClientProvider/AuthProvider";
import { useBookingShowingContext } from "../../../../../../../../../Providers/ClientProvider/BookingShowingProvider";
import { User } from "../../../../../../../../models";

const ReviewClientDetails = () => {
  const navigate = useNavigate();
  const { dbUser } = useAuthContext();
  const {
    selectedOption, 
    setSelectedOption,
    setBookings,
    opusingFor, 
    setOpusingFor, 
    otherUsername,
    setOtherUsername,
    opusedBy, 
    setOpusedBy,
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
    calculatedTotalPrice,
    setCalculatedTotalPrice,
    overAllPrice,
    setOverAllPrice,
    realtorPrice,
    setRealtorPrice,
    serviceCharge, 
    setServiceCharge,
  } = useBookingShowingContext();

  const [loading, setLoading] = useState(false);

  // const getPriceLabel = () => {
  //   if (propertyDetails?.propertyType === "Hotel / Shortlet" || propertyDetails?.propertyType === "Recreation") {
  //     return "Sub Total:";
  //   } else {
  //     return "Price:";
  //   }
  // };

  useEffect(() => {
    if (propertyDetails) {
      setPropertyType(propertyDetails.propertyType);
      setPostID(propertyDetails.id);
      setAccommodationType(propertyDetails.type);
      setNameOfType(propertyDetails.nameOfType);
      setBookingLat(propertyDetails.lat);
      setBookingLng(propertyDetails.lng);

      // realtorPrice = 90% of calculatedTotalPrice
      setRealtorPrice(calculatedTotalPrice * 0.9);
    }
  }, [propertyDetails, calculatedTotalPrice]);

  console.log("Property Booking mode:", propertyDetails.bookingMode, propertyDetails?.isSubscription);

  console.log('post price:',postPrice, 'post total price:', postTotalPrice)

  const handleBooking = async () => {
    if (loading) return;
    setLoading(true);

    try {
      let clientFirstName = guestFirstName;
      let clientLastName = guestLastName;
      let clientPhoneNumber = guestPhoneNumber;
      let bookingUserID = dbUser.id;
      let notificationCreatorID = dbUser.id;
      let notificationCreatorUsername = dbUser.username || "A client";
      let targetUser = null;

      // If booking for another person
      if (opusingFor === "another" && otherUsername?.trim()) {
        const foundUsers = await DataStore.query(User, (u) =>
          u.username.eq(otherUsername.trim())
        );

        if (foundUsers.length === 0) {
          alert("No user found with that username");
          setLoading(false);
          return;
        }

        targetUser = foundUsers[0];

        clientFirstName = targetUser.firstName || "";
        clientLastName = targetUser.lastName || "";
        clientPhoneNumber = targetUser.phoneNumber || "";
        bookingUserID = targetUser.id; 

        // Realtor notification should look like it came from the target user
        notificationCreatorID = targetUser.id;
        notificationCreatorUsername = targetUser.username || "A client";
      }


      const booking = await DataStore.save(
        new Booking({ 
          opusingFor,
          otherUsername,
          opusedBy,
          adults,
          kids,
          infants,
          numberOfPeople,
          numberOfItems,
          clientFirstName,
          clientLastName,
          clientPhoneNumber,
          purpose: note,
          selectedOption,
          duration: String(duration),
          checkInDate: String(checkInDate),
          checkOutDate: String(checkOutDate),
          bookedSessionDuration: bookedSessionDuration?.label || "",
          subscription,
          propertyType,
          nameOfType,
          accommodationType,
          bookingLat,
          bookingLng,
          serviceCharge: parseFloat(serviceCharge),
          totalPrice: parseFloat(calculatedTotalPrice),
          overAllPrice: parseFloat(overAllPrice),
          realtorPrice: parseFloat(realtorPrice),
          userID: bookingUserID,
          realtorID: realtorContext.id,
          PostID,
          status: propertyDetails?.bookingMode === "manual" ? "PENDING" : "ACCEPTED",
        })
      );

      // Notify realtor
      await DataStore.save(
        new Notification({
          creatorID: notificationCreatorID,
          recipientID:realtorContext.id,
          recipientType: 'BOOKING_REALTOR',
          type: ["Hotel / Shortlet", "Nightlife", "Recreation", 'Event', 'Food & Drinks'].includes(propertyType) ? "BOOKING" : "SHOWING",
          entityID: booking.id,
          message: `${notificationCreatorUsername} made a booking for your ${propertyType} (${accommodationType})`,
          read: false,
        })
      );

      // If booking was for another user → also notify them
      if (targetUser) {
        await DataStore.save(
          new Notification({
            creatorID: dbUser.id, 
            recipientID: targetUser.id,
            recipientType: "BOOKING_USER",
            type: "BOOKING",
            entityID: booking.id,
            message: `${dbUser.username || "Someone"} opused you ${propertyType} (${accommodationType})`,
            read: false,
          })
        );
      }

      // Notify client about their own booking
      await DataStore.save(
        new Notification({
          creatorID: realtorContext.id, 
          recipientID: dbUser.id,
          recipientType: "BOOKING_CLIENT",
          type: "BOOKING_STATUS_UPDATE",
          entityID: booking.id,
          message: targetUser
            ? `You opused ${propertyType} (${accommodationType}) for ${targetUser.username}.`
            : `You opused ${propertyType} (${accommodationType}).`,
          read: false,
        })
      );
      
      setBookings(booking);
      alert("Booking was a success");

      // Reset state
      setSelectedOption(null);
      setOpusingFor('myself');
      setOtherUsername("");
      setOpusedBy("");
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
      setPostOtherFeesPrice(0);
      setPostOtherFeesName2("");
      setPostOtherFeesPrice2(0);
      setPostTotalPrice(0);
      setPostCautionFee(0);
      setCalculatedTotalPrice(0);
      setServiceCharge(0);
      setOverAllPrice(0);
      setRealtorPrice(0);
      setPostID("");
      setPropertyDetails("");
      setPropertyType("");
      setNameOfType("");
      setAccommodationType("");
      setBookingLat("");
      setBookingLng("");
      setRealtorContext("");
      navigate("/clientcontent/home");
      // Navigation logic
      // if (propertyDetails?.bookingMode === "manual") {
      //   navigate("/clientcontent/home");
      // } else {
      //   const needsPayment =
      //     (parseFloat(postPrice) > 0) ||
      //     (selectedOption?.optionPrice && parseFloat(selectedOption.optionPrice) > 0);

      //   if (needsPayment) {
      //     navigate("/clientcontent/payment", { state: { bookingId: booking.id } });
      //   } else {
      //     navigate("/clientcontent/home");
      //   }
      // }
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
        
        <h4>Opusing For:</h4>
        <p className="txtInputReview">{opusingFor}</p>

        {otherUsername && (
          <>
          <h4>Username:</h4>
          <p className="txtInputReview">@{otherUsername}</p>
          </>
        )}

        {guestFirstName && (
          <>
            <h4>First Name(s):</h4>
            <p className="txtInputReview">{guestFirstName?.trim()}</p>
          </>
        )}

        {guestLastName && (
          <>
            <h4>Last Name(s):</h4>
            <p className="txtInputReview">{guestLastName?.trim()}</p>
          </>
        )}

        {guestPhoneNumber && (
          <>
            <h4>Phone Number(s):</h4>
            <p className="txtInputReview">{guestPhoneNumber}</p>
          </>
        )}

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
              {/* {getPriceLabel()} */}
              Sub Total:
            </h4>
            <p className="txtInputReview">₦{postTotalPrice?.toLocaleString()}</p>
          </>
        )}

        {serviceCharge && (
          <div className="lastReviewInputClient">
            <h4>Service Charge:</h4>
            <p className="txtInputReview">₦{serviceCharge?.toLocaleString()}</p>
          </div>
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