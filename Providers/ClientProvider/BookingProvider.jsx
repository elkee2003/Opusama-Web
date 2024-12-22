import React, { useState, useContext, createContext } from 'react';

const BookingContext = createContext({});

const BookingContextProvider = ({ children }) => {
  const [bookings, setBookings] = useState('');
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [infants, setInfants] = useState(0);
  const [guestFirstName, setGuestFirstName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [guestPhoneNumber, setGuestPhoneNumber] = useState('');
  const [propertyDetails, setPropertyDetails] = useState('');
  const [PostID, setPostID] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [nameOfType, setNameOfType] = useState('');
  const [accommodationType, setAccommodationType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [bookingLat, setBookingLat] = useState(0);
  const [bookingLng, setBookingLng] = useState(0);
  const [realtorContext, setRealtorContext] = useState(null);
  const [duration, setDuration] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [postPrice, setPostPrice] = useState(null);
  const [postCautionFee, setPostCautionFee] = useState(null);
  const [postTotalPrice, setPostTotalPrice] = useState(null);
  const [overAllPrice, setOverAllPrice] = useState(null);
  const [realtorPrice, setRealtorPrice] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const validateInput = () => {
    setErrorMessage(''); // Clear previous errors

    if (adults === 0 && kids === 0 && infants === 0) {
      setErrorMessage('Please add the number of guests');
      return false;
    }

    if (!guestFirstName) {
      setErrorMessage('First Name is Required');
      return false;
    }

    if (!guestLastName) {
      setErrorMessage('Last Name is Required');
      return false;
    }

    if (guestPhoneNumber.length < 10) {
      setErrorMessage('Phone Number must be at least 10 digits');
      return false;
    }

    return true;
  };

  const onValidateInput = () => {
    return validateInput();
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        setBookings,
        adults,
        setAdults,
        kids,
        setKids,
        infants,
        setInfants,
        guestFirstName,
        setGuestFirstName,
        guestLastName,
        setGuestLastName,
        guestPhoneNumber,
        setGuestPhoneNumber,
        propertyDetails,
        setPropertyDetails,
        PostID,
        setPostID,
        propertyType,
        setPropertyType,
        nameOfType,
        setNameOfType,
        accommodationType,
        setAccommodationType,
        purpose,
        setPurpose,
        bookingLat,
        setBookingLat,
        bookingLng,
        setBookingLng,
        realtorContext,
        setRealtorContext,
        duration,
        setDuration,
        checkInDate,
        setCheckInDate,
        checkOutDate,
        setCheckOutDate,
        postPrice,
        setPostPrice,
        postCautionFee,
        setPostCautionFee,
        postTotalPrice,
        setPostTotalPrice,
        overAllPrice,
        setOverAllPrice,
        realtorPrice,
        setRealtorPrice,
        errorMessage,
        setErrorMessage,
        onValidateInput,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContextProvider;

export const useBookingContext = () => useContext(BookingContext);
