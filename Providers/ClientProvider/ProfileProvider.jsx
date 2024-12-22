import React, { useState, useContext, useEffect, createContext } from 'react';

const ProfileContext = createContext({});

const ProfileContextProvider = ({ children }) => {
  const [dbUser, setDbUser] = useState(null); // Simulating useAuthContext for web
  const [profilePic, setProfilePic] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Replace this with actual authentication context or API call
  useEffect(() => {
    // Simulating fetching user data from an auth provider or database
    setDbUser({
      profilePic: 'https://via.placeholder.com/150',
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      phoneNumber: '1234567890',
    });
  }, []);

  useEffect(() => {
    if (dbUser) {
      setProfilePic(dbUser.profilePic);
      setFirstName(dbUser.firstName || '');
      setLastName(dbUser.lastName || '');
      setAddress(dbUser.address || '');
      setPhoneNumber(dbUser.phoneNumber || '');
    }
  }, [dbUser]); // Runs whenever dbUser changes

  const validateInput = () => {
    setErrorMessage('');
    if (!firstName) {
      setErrorMessage('First Name is Required');
      return false;
    }
    if (phoneNumber.length < 10) {
      setErrorMessage('Kindly fill in Phone Number');
      return false;
    }
    if (!address) {
      setErrorMessage('Address is required');
      return false;
    }
    return true;
  };

  const onValidateInput = () => {
    return validateInput();
  };

  return (
    <ProfileContext.Provider
      value={{
        firstName,
        setFirstName,
        lastName,
        setLastName,
        address,
        setAddress,
        phoneNumber,
        setPhoneNumber,
        errorMessage,
        setErrorMessage,
        profilePic,
        setProfilePic,
        onValidateInput,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContextProvider;

export const useProfileContext = () => useContext(ProfileContext);

// // Sample Component to Display Profile
// const Profile = () => {
//   const {
//     firstName,
//     lastName,
//     address,
//     phoneNumber,
//     profilePic,
//     errorMessage,
//     onValidateInput,
//   } = useProfileContext();

//   const handleSubmit = () => {
//     if (onValidateInput()) {
//       alert('Form Submitted Successfully!');
//     }
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
//       <img
//         src={profilePic || 'https://via.placeholder.com/150'}
//         alt="Profile"
//         style={{ width: '150px', height: '150px', borderRadius: '50%' }}
//       />
//       <h1>
//         {firstName} {lastName}
//       </h1>
//       <p>Address: {address}</p>
//       <p>Phone: {phoneNumber}</p>
//       {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
//       <button onClick={handleSubmit}>Validate Profile</button>
//     </div>
//   );
// };

// // Usage Example
// const App = () => (
//   <ProfileContextProvider>
//     <Profile />
//   </ProfileContextProvider>
// );

// export default App;