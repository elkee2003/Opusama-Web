import React, {useState, useEffect, useContext, createContext} from 'react';
import {useAuthContext} from './AuthProvider';
import { DataStore } from "aws-amplify/datastore";
import { Booking } from '../../src/models';

const BookingShowingContext = createContext({})

const BookingShowingContextProvider = ({children}) => {

    // Booking Hotel/Shortlet
    const [bookings, setBookings] = useState('');
    const [currentBooking, setCurrentBooking] = useState(null);
    const [adults, setAdults] = useState(0);
    const [kids, setKids] = useState(0);
    const [infants, setInfants] = useState(0);
    const [numberOfPeople, setNumberOfPeople] = useState(0);
    const [guestFirstName, setGuestFirstName] = useState('');
    const [guestLastName, setGuestLastName] = useState('');
    const [guestPhoneNumber, setGuestPhoneNumber]= useState('');
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
    const [checkInDate, setCheckInDate] = useState('')
    const [checkOutDate, setCheckOutDate] = useState('')
    const [postPrice, setPostPrice] = useState(null);
    const [postCautionFee, setPostCautionFee] = useState(null);
    const [postOtherFeesName, setPostOtherFeesName] = useState('');
    const [postOtherFeesName2, setPostOtherFeesName2] = useState('');
    const [postOtherFeesPrice, setPostOtherFeesPrice] = useState('');
    const [postOtherFeesPrice2, setPostOtherFeesPrice2] = useState('');
    const [postTotalPrice, setPostTotalPrice] = useState(null);
    const [overAllPrice, setOverAllPrice] = useState(0);
    const [realtorPrice, setRealtorPrice] = useState(0);
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

            console.log("Payment status saved:", status, reference, message);

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

    const onValidateRecreationInput = () =>{
        if(validateRecreationInput()){
        return true;
        }else {
        return false;
        }
    }

    // Property Validation
    const validatePropertyInput = () => {
        setErrorMessage(''); 
    
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
    <BookingShowingContext.Provider value={{bookings, setBookings,currentBooking, setCurrentBooking, adults, setAdults, kids, setKids, infants, numberOfPeople, setNumberOfPeople,  setInfants, guestFirstName, setGuestFirstName, guestLastName, setGuestLastName, PostID, setPostID, guestPhoneNumber, propertyDetails, setPropertyDetails, propertyType, setPropertyType, nameOfType, setNameOfType, accommodationType, setAccommodationType, setGuestPhoneNumber, note, setNote, bookingLat, setBookingLat, bookingLng, setBookingLng, errorMessage, setErrorMessage, onValidateHotelInput, onValidateRecreationInput, onValidatePropertyInput, realtorContext, setRealtorContext, checkInDate, setCheckInDate, checkOutDate, setCheckOutDate, duration, setDuration, postPrice, setPostPrice, postCautionFee, setPostCautionFee, postOtherFeesName, setPostOtherFeesName, postOtherFeesName2, setPostOtherFeesName2, postOtherFeesPrice, setPostOtherFeesPrice, postOtherFeesPrice2, setPostOtherFeesPrice2, postTotalPrice, setPostTotalPrice, overAllPrice, setOverAllPrice, realtorPrice, setRealtorPrice, transactionReference, setTransactionReference, transactionStatus, setTransactionStatus, onStatusChange,}}>
        {children}
    </BookingShowingContext.Provider>
  )
}

export default BookingShowingContextProvider;

export const useBookingShowingContext = () => useContext(BookingShowingContext)