import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './EditProfile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { signOut } from "aws-amplify/auth";
import { useAuthContext } from "../../../../../../Providers/ClientProvider/AuthProvider";
import { useProfileContext } from "../../../../../../Providers/RealtorProvider/ProfileProvider";
import { FiArrowRightCircle, FiCheckCircle, FiXCircle  } from "react-icons/fi"; 
import { DataStore } from "aws-amplify/datastore";
import { User, Realtor } from '../../../../../models';


const EditProfile = () => {
  const navigate = useNavigate();
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null); 
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const { authUser, dbRealtor } = useAuthContext();
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    username,
    setUsername,
    myDescription, 
    setMyDescription,
    profilePic,
    setProfilePic,
    address,
    setAddress,
    phoneNumber,
    setPhoneNumber,
    bankname, 
    setBankname,
    accountName, 
    setAccountName, 
    accountNumber, 
    setAccountNumber,
    errorMessage,
    onValidateInput,
  } = useProfileContext();
  

  // const [loading, setLoading] = useState(false);

  const [remainingWords, setRemainingWords] = useState(150);
  

  // Pick Image function for web
  const pickImage = (e) => {
    const file = e.target.files[0]; // Get the first file from the input
    if (file) {
      // Create a URL for the picked image
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl); // Set the profile picture URI to the image URL
    }
  };

  // Navigation Function
  const goToNxtPage = () => {

    if (!isUsernameAvailable) {
      setUsernameError("Please choose a unique username before proceeding");
      return; // 🚫 Don't navigate
    }

    if (onValidateInput()) {
      navigate("/realtorcontent/reviewprofile");   
    }
  };

  // Helper function to count words
  const countWords = (text) => text.trim().length;

  // Handle text change for myDescription with word limit
  const handleDescriptionChange = (text) => {
    const words = countWords(text);
    if (words <= 150) {
      setMyDescription(text);
      setRemainingWords(150 - words);
    }
  };

  const onSignIn = () => {
    navigate('/realtorcontent/home');
    
  };

  // Signout function
  async function handleSignOut() {
    try {
      await signOut({ global: true });
      navigate('/');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  // Signout prompt
  const onSignout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      handleSignOut();
    }
  };

  const handleAuthAction = () => {
    if (authUser) {
      onSignout(); // Call the sign-out function if the user is authenticated
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    const checkUsername = async () => {
      if (!username || username.trim().length < 3) {
        setIsUsernameAvailable(null);
        setUsernameError("");
        return;
      }
  
      setCheckingUsername(true);
      try {
        const trimmed = username.trim();
        
        const [userResults, realtorResults] = await Promise.all([
          DataStore.query(User, (u) => u.username.eq(trimmed)),
          DataStore.query(Realtor, (r) => r.username.eq(trimmed)),
        ]);
  
        const otherUser = userResults.find((user) => user.id !== dbRealtor?.id);
        const otherRealtor = realtorResults.find((realtor) => realtor.id !== dbRealtor?.id);
  
        if (otherUser || otherRealtor) {
          setIsUsernameAvailable(false);
          setUsernameError("Username already taken");
        } else {
          setIsUsernameAvailable(true);
          setUsernameError("");
        }
  
      } catch (error) {
        console.error("Error checking username:", error);
        setIsUsernameAvailable(null);
        setUsernameError("Something went wrong. Try again.");
      } finally {
        setCheckingUsername(false);
      }
    };
  
    const timeoutId = setTimeout(() => {
      checkUsername();
    }, 500); // debounce
  
    return () => clearTimeout(timeoutId);
  }, [username, dbRealtor?.id]);

  if (!authUser) {
    return (
      <div className="emptyProfileCon">
        <h1 className="title">Sign In</h1>
        {/* Sign In */}
        <button className="signoutBtn" onClick={handleAuthAction}>
          <p className="signoutTxt">
            {authUser ? "Sign Out" : "Sign In"}
          </p>
        </button>

        {/* Circle for image */}
        <div className="profilePicContainer" />

        {/* Empty inputs */}
        <div className="emptyInputCon">
          <div className="emptyInput" />
          <div className="emptyInput" />
          <div className="emptyInput" />
        </div>
        <button
          className="emptyBtnCon"
          onClick={() => navigate('/')}
        >
          <p className="emptyBtnTxt">Sign In</p>
        </button>
      </div>
    );
  };

  return (
    <div className="realtorProfContainer">
      {authUser && (
        <div>
          <h1 className="title">Edit Profile</h1>

          {/* Upload Profile Picture */}
          <div className="profilePicContainerEdit">
            {profilePic && <img src={profilePic} alt="Profile" className="img" />}
            <div className="plusIconContainer">
              <input
                type="file"
                accept="image/*"
                onChange={pickImage}
                className="fileInput"
                style={{ display: "none" }} // Hide the default file input button
                id="fileInput"
              />
              <label htmlFor="fileInput" className="plusIconLabel">
                <span className="plusIcon">+</span>
              </label>
            </div>
          </div>

          {/* Backbutton */}
          <button 
            className='bckBtnCon' 
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon 
              icon={faArrowLeft}
              className='bckBtnIcon' 
              size="2x"
            />
          </button>

          {/* Sign out button */}
          <button className="signoutBtn" onClick={handleAuthAction}>
            <p className="signoutTxt">
              {authUser ? "Sign Out" : "Sign In"}
            </p>
          </button>

          <div className="formContainer">
            
            <textarea
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name / Company name"
              className="realtorProfileInput"
              // rows={2} 
            />

            <textarea
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name (Optional)"
              className="realtorProfileInput"
              // rows={2} 
            />

            <div className="realtorUsernameInputWrapper">
              <textarea
                value={username}
                onChange={(e) => {
                  const input = e.target.value.replace(/@/g, ""); // remove all @s
                  setUsername(input);
                }}
                placeholder="Username eg: tonari"
                autoCapitalize="none"
                autoCorrect="off"
                className= {`profileInputRealtorUsername ${isUsernameAvailable === false ? "errorInput" : ""}`}
              />

              {checkingUsername ? (
                <span className="loadingIcon">...</span> // optional loading UI
              ) : isUsernameAvailable === true ? (
                <FiCheckCircle color="green" size={20} />
              ) : isUsernameAvailable === false ? (
                <FiXCircle color="red" size={20} />
              ) : null}
            </div>

            <textarea
              value={myDescription}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="A description of yourself(Optional)"
              className="realtorProfileInput"
            />
            <p className="wordCount">{remainingWords}</p>

            <textarea
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
              className="realtorProfileInput"
              // rows={2} 
            />

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Input Address"
              className="realtorProfileInput"
            />

            <textarea
              value={bankname}
              onChange={(e) => setBankname(e.target.value)}
              placeholder="Bank name"
              className="realtorProfileInput"
            />

            <textarea
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Account name"
              className="realtorProfileInput"
            />

            <textarea
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Account number"
              className="realtorProfileInputLast"
            />
          </div>

          {/* Error Message */}
          <p className="realtorError">{errorMessage}</p>
          {usernameError && <p className="realtorError">{usernameError}</p>}

          <button onClick={goToNxtPage} className="profileNxtBtn">
            <FiArrowRightCircle
              className="nxtBtnIcon"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default EditProfile;