import React, {useState, useEffect, useContext, createContext} from 'react';
import {useAuthContext} from './AuthProvider';

const BookingShowingContext = createContext({})

const BookingShowingContextProvider = ({children}) => {

    // Booking Hotel/Shortlet
    const [bookings, setBookings] = useState('');
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
    const [postTotalPrice, setPostTotalPrice] = useState(null);
    const [overAllPrice, setOverAllPrice] = useState(0);
    const [realtorPrice, setRealtorPrice] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const {dbUser} = useAuthContext();

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
    <BookingShowingContext.Provider value={{bookings, setBookings, adults, setAdults, kids, setKids, infants, numberOfPeople, setNumberOfPeople,  setInfants, guestFirstName, setGuestFirstName, guestLastName, setGuestLastName, PostID, setPostID, guestPhoneNumber, propertyDetails, setPropertyDetails, propertyType, setPropertyType, nameOfType, setNameOfType, accommodationType, setAccommodationType, setGuestPhoneNumber, note, setNote, bookingLat, setBookingLat, bookingLng, setBookingLng, errorMessage, setErrorMessage, onValidateHotelInput, onValidateRecreationInput, onValidatePropertyInput, realtorContext, setRealtorContext, checkInDate, setCheckInDate, checkOutDate, setCheckOutDate, duration, setDuration, postPrice, setPostPrice, postCautionFee, setPostCautionFee, postTotalPrice, setPostTotalPrice, overAllPrice, setOverAllPrice, realtorPrice, setRealtorPrice}}>
        {children}
    </BookingShowingContext.Provider>
  )
}

export default BookingShowingContextProvider;

export const useBookingShowingContext = () => useContext(BookingShowingContext)