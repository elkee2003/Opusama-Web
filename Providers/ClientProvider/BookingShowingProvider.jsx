import React, {useState, useEffect, useContext, createContext} from 'react';
import {useAuthContext} from './AuthProvider';
import { DataStore } from "aws-amplify/datastore";
import { Booking } from '../../src/models';

const BookingShowingContext = createContext({})

const BookingShowingContextProvider = ({children}) => {

    const [bookings, setBookings] = useState('');
    const [currentBooking, setCurrentBooking] = useState(null);
    const [cardNumber, setCardNumber] = useState(null);
    const [cardExpiry, setCardExpiry] = useState(null);
    const [cardCvv, setCardCvv] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [opusingFor, setOpusingFor] = useState("myself");
    const [otherUsername, setOtherUsername] = useState("");
    const [opusedBy, setOpusedBy] = useState("");
    const [adults, setAdults] = useState(0);
    const [kids, setKids] = useState(0);
    const [infants, setInfants] = useState(0);
    const [numberOfPeople, setNumberOfPeople] = useState(0);
    const [numberOfItems, 
    setNumberOfItems] = useState(0);
    const [guestFirstName, setGuestFirstName] = useState('');
    const [guestLastName, setGuestLastName] = useState('');
    const [guestPhoneNumber, setGuestPhoneNumber]= useState('');
    const [guestEmail, setGuestEmail] = useState("");
    // To store event name for guest
    const [guestEventName, setGuestEventName] = useState("");
    const [propertyDetails, setPropertyDetails] = useState('');
    const [PostID, setPostID] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [nameOfType, setNameOfType] = useState('');
    const [accommodationType, setAccommodationType] = useState('');
    const [note, setNote] = useState('');
    const [bookingLat, setBookingLat] = useState(0);
    const [bookingLng, setBookingLng] = useState(0);
    const [realtorContext, setRealtorContext] = useState(null);
    const [duration, setDuration] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [bookedSessionDuration, setBookedSessionDuration] = useState('');
    const [subscription, setSubscription] = useState(false);
    const [postPrice, setPostPrice] = useState(null);
    const [postCautionFee, setPostCautionFee] = useState(null);
    const [postOtherFeesName, setPostOtherFeesName] = useState('');
    const [postOtherFeesName2, setPostOtherFeesName2] = useState('');
    const [postOtherFeesPrice, setPostOtherFeesPrice] = useState('');
    const [postOtherFeesPrice2, setPostOtherFeesPrice2] = useState('');
    const [postTotalPrice, setPostTotalPrice] = useState(null);
    const [calculatedTotalPrice, setCalculatedTotalPrice] = useState(0);
    const [overAllPrice, setOverAllPrice] = useState(0);
    const [realtorPrice, setRealtorPrice] = useState(0);
    const [serviceCharge, setServiceCharge] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [transactionReference, setTransactionReference] = useState('');
    const [transactionStatus, setTransactionStatus] = useState('');
    const {dbUser} = useAuthContext();

    // Function to change status of payment
    const onStatusChange = async (status, reference, transactionStatus, ticketId, ticketStatus) => {
        
        if (!currentBooking) {
            console.error("No booking set in context.");
            return;
        }
        console.log("Updating booking:", currentBooking);

        try {
             // Save to DataStore using the booking from context
            const updatedBooking = await DataStore.save(
                Booking.copyOf(currentBooking, updated => {
                    updated.status = status;
                    updated.transactionReference = reference;
                    updated.transactionStatus = transactionStatus;
                    updated.ticketID = ticketId;
                    updated.ticketStatus = ticketStatus;
                })
            );


            // Keep context in sync
            setCurrentBooking(updatedBooking);
            setTransactionReference(reference);
            setTransactionStatus(status);

            console.log("Payment status saved:", status, reference);

            // ✅ Clear current booking if payment was successful
            if (status === "PAID" || transactionStatus === "Successful") {
                setCurrentBooking(null);
            }

        } catch (error) {
            console.error("Error saving payment status:", error);
        }
    };

    // Hotel Validation
    const validateHotelInput = () => {
        setErrorMessage(''); 

        if (adults === 0 && kids === 0 && infants === 0) {
            setErrorMessage('Please add the number of guests');
            return false;
        }
    
        if (opusingFor === "myself") {
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
        }

        if (opusingFor === "another") {
            if (!otherUsername) {
                setErrorMessage('Username is Required');
                return false;
            }
        }
    
        return true;
    };

    const onValidateHotelInput = () =>{
        if(validateHotelInput()){
        return true;
        }else {
        return false;
        }
    }

    // Recreation & Nightlife Validation
    const validateRecreationInput = () => {
        setErrorMessage(''); 

        if (numberOfPeople === 0) {
            setErrorMessage('Please add the number of people');
            return false;
        }
    
        if (opusingFor === "myself") {
            if (!guestFirstName) {
                setErrorMessage('First Name is Required');
                return false;
            }

            // ✅ Require guest email only if not logged in (no dbUser)
            if (!dbUser && !guestEmail) {
                setErrorMessage('Email is Required');
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
        }

        if (opusingFor === "another") {
            if (!otherUsername) {
                setErrorMessage('Username is Required');
                return false;
            }
        }
    
        return true;
    };

    const onValidateRecreationInput = () =>{
        if(validateRecreationInput()){
        return true;
        }else {
        return false;
        }
    }

    // Food & Drinks Validation
    const validateFoodInput = () => {
        setErrorMessage('');

        if (numberOfItems === 0) {
            setErrorMessage('Please add the number of items');
            return false;
        }

        if (!selectedOption) {
            setErrorMessage('Please select a menu option');
            return false;
        }

        if (opusingFor === "myself") {
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
        }

        if (opusingFor === "another") {
            if (!otherUsername) {
                setErrorMessage('Username is Required');
                return false;
            }
        }

        return true;
    };

    const onValidateFoodInput = () => {
        if(validateFoodInput()){
            return true;
        }else {
            return false;
        }
    }
    
    // Property Validation
    const validatePropertyInput = () => {
        setErrorMessage(''); 
    
        if (opusingFor === "myself") {
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
        }

        if (opusingFor === "another") {
            if (!otherUsername) {
                setErrorMessage('Username is Required');
                return false;
            }
        }
    
        return true;
    };

    const onValidatePropertyInput = () =>{
        if(validatePropertyInput()){
        return true;
        }else {
        return false;
        }
    }

    useEffect(() => {
        if (dbUser?.firstName) {
            setGuestFirstName(dbUser.firstName);
            setGuestLastName(dbUser.lastName);
            setGuestPhoneNumber(dbUser.phoneNumber);
        }
    }, [dbUser]);


  return (
    <BookingShowingContext.Provider value={{bookings, setBookings,currentBooking, setCurrentBooking, selectedOption, setSelectedOption, opusingFor, setOpusingFor, otherUsername, setOtherUsername, opusedBy, setOpusedBy, adults, setAdults, kids, setKids, infants, numberOfPeople, setNumberOfPeople, numberOfItems, 
    setNumberOfItems, setInfants, guestFirstName, setGuestFirstName, guestLastName, setGuestLastName, PostID, setPostID, guestPhoneNumber, guestEmail, guestEventName, setGuestEventName, propertyDetails, setPropertyDetails, propertyType, setPropertyType, nameOfType, setNameOfType, accommodationType, setAccommodationType, setGuestPhoneNumber, setGuestEmail, note, setNote, bookingLat, setBookingLat, bookingLng, setBookingLng, errorMessage, setErrorMessage, onValidateHotelInput, onValidateRecreationInput, onValidateFoodInput, onValidatePropertyInput, realtorContext, setRealtorContext, checkInDate, setCheckInDate, checkOutDate, setCheckOutDate, bookedSessionDuration, setBookedSessionDuration, duration, setDuration, subscription, setSubscription, postPrice, setPostPrice, postCautionFee, setPostCautionFee, postOtherFeesName, setPostOtherFeesName, postOtherFeesName2, setPostOtherFeesName2, postOtherFeesPrice, setPostOtherFeesPrice, postOtherFeesPrice2, setPostOtherFeesPrice2, postTotalPrice, setPostTotalPrice, calculatedTotalPrice, setCalculatedTotalPrice, overAllPrice, setOverAllPrice, 
    realtorPrice, setRealtorPrice, serviceCharge, setServiceCharge,transactionReference, setTransactionReference, transactionStatus, setTransactionStatus, onStatusChange,}}>
        {children}
    </BookingShowingContext.Provider>
  )
}

export default BookingShowingContextProvider;

export const useBookingShowingContext = () => useContext(BookingShowingContext)