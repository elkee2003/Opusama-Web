import React, {useState, useContext, useEffect, createContext} from 'react'
import {useAuthContext} from './AuthProvider';

const ProfileContext = createContext({})

const ProfileContextProvider = ({children}) => {

    const {dbUser} = useAuthContext()

    const [profilePic, setProfilePic] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber]= useState("");
    const [errorMessage, setErrorMessage] = useState('');

    // For Map
    const [postData, setPostData] = useState(null);

    // For Payment
    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
    const [paymentPrice, setPaymentPrice] = useState(null);

    // For Reviews:
    const [realtorID, setRealtorID] = useState(null);

    const validateInput = () =>{
      setErrorMessage('')
      if(!firstName){
        setErrorMessage('First Name is Required')
        return false;
      }
      if(!username){
        setErrorMessage('Username is Required')
        return false;
      }
      if(phoneNumber.length < 10){
        setErrorMessage('Kindly fill in Phone Number')
        return false;
      }
      if(!address){
        setErrorMessage('Address is required')
        return false;
      }
      return true;
    }

    const onValidateInput = () =>{
      if(validateInput()){
        return true;
      }else {
        return false;
      }
    }

    useEffect(() => {
      if (dbUser) {
          setProfilePic(dbUser?.profilePic);
          setFirstName(dbUser.firstName || "");
          setLastName(dbUser.lastName || "");
          setUsername(dbUser.username || "");
          setAddress(dbUser.address || "");
          setPhoneNumber(dbUser.phoneNumber || "");
      }
    }, [dbUser]); // This effect runs whenever dbUser changes


  return (
    <ProfileContext.Provider value={{firstName,setFirstName, lastName, setLastName, username, setUsername, address, setAddress, phoneNumber, setPhoneNumber, errorMessage, setErrorMessage, profilePic, setProfilePic, onValidateInput, postData, setPostData, isPaymentSuccessful, setIsPaymentSuccessful, paymentPrice, setPaymentPrice, realtorID, setRealtorID}}>
        {children}
    </ProfileContext.Provider>
  )
}

export default ProfileContextProvider;

export const useProfileContext = () => useContext(ProfileContext)