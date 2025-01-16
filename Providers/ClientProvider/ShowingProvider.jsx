import React, {useState, useEffect, useContext, createContext} from 'react'
import {useAuthContext} from './AuthProvider';

const ShowingContext = createContext({})

const ShowingContextProvider = ({children}) => {

    const [showing, setShowing] = useState('');
    const [clientFirstName, setClientFirstName] = useState('');
    const [clientLastName, setClientLastName] = useState('');
    const [clientPhoneNumber, setClientPhoneNumber]= useState('');
    const [note, setNote] = useState('');
    const [propertyDetails, setPropertyDetails] = useState('')
    const [PostID, setPostID] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [accommodationType, setAccommodationType] = useState('');
    const [bookingLat, setBookingLat] = useState(0);
    const [bookingLng, setBookingLng] = useState(0);
    const [realtorContext, setRealtorContext] = useState(null);
    const [postPrice, setPostPrice] = useState(null);
    const [postTotalPrice, setPostTotalPrice] = useState(null);
    const [overAllPrice, setOverAllPrice] = useState(null);
    const [realtorPrice, setRealtorPrice] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const {dbUser} = useAuthContext();

        const validateInput = () => {
            setErrorMessage(''); // Clear previous errors
        
            if (!clientFirstName) {
                setErrorMessage('First Name is Required');
                return false;
            }
        
            if (!clientLastName) {
                setErrorMessage('Last Name is Required');
                return false;
            }
        
            if (clientPhoneNumber.length < 10) {
                setErrorMessage('Phone Number must be at least 10 digits');
                return false;
            }
        
            return true;
        };

        const onValidateInput = () =>{
            if(validateInput()){
            return true;
            }else {
            return false;
            }
        }

        useEffect(() => {
            if (dbUser?.firstName) {
                setClientFirstName(dbUser.firstName);
                setClientLastName(dbUser.lastName);
                setClientPhoneNumber(dbUser.phoneNumber);
            }
        }, [dbUser]);


  return (
    <ShowingContext.Provider value={{showing, setShowing, clientFirstName, setClientFirstName, clientLastName, setClientLastName, clientPhoneNumber, note, setNote, propertyDetails, setPropertyDetails, propertyType, PostID, setPostID, setPropertyType, accommodationType, setAccommodationType, setClientPhoneNumber, bookingLat, setBookingLat, bookingLng, setBookingLng, errorMessage, setErrorMessage, onValidateInput, realtorContext, setRealtorContext, postPrice, setPostPrice, postTotalPrice, setPostTotalPrice, overAllPrice, setOverAllPrice, realtorPrice, setRealtorPrice}}>
        {children}
    </ShowingContext.Provider>
  )
}

export default ShowingContextProvider;

export const useShowingContext = () => useContext(ShowingContext)