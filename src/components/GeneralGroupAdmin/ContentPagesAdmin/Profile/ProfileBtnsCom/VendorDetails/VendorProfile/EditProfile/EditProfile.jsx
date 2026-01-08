import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Autocomplete, TextField } from "@mui/material";
import BankDetails from "./BankDetails";
import { signOut } from "aws-amplify/auth";
import { useAuthContext } from "../../../../../../../../../Providers/ClientProvider/AuthProvider";
import { useProfileContext } from "../../../../../../../../../Providers/RealtorProvider/ProfileProvider";
import { FiArrowRightCircle, FiCheckCircle, FiXCircle  } from "react-icons/fi"; 
import { DataStore } from "aws-amplify/datastore";
import { getUrl } from "aws-amplify/storage";
import { get } from 'aws-amplify/api';
import { User, Realtor } from '../../../../../../../../models';


const EditProfile = () => {
  const navigate = useNavigate();
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null); 
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const { authUser, dbUser, dbRealtor, setDbRealtor } = useAuthContext();
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
    bankName, 
    setBankName,
    accountName, 
    setAccountName, 
    accountNumber, 
    setAccountNumber,
    errorMessage,
    onValidateInput,

    // For admin
    selectedRealtor, 
    setSelectedRealtor,
  } = useProfileContext();
  
  const isRealtorSelected = Boolean(selectedRealtor);

  const [realtors, setRealtors] = useState([]);
  const [loadingRealtors, setLoadingRealtors] = useState(true);


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
    if (!selectedRealtor) return;

    if (!isUsernameAvailable) {
      setUsernameError("Please choose a unique username before proceeding");
      return; // 🚫 Don't navigate
    }

    if (onValidateInput()) {
      navigate("/admin/vendor_review_profile");   
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
    navigate('/admin/home');
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
      navigate('/?section=signin');
    }
  };

  // useEffect for converting S3key to URL
  useEffect(() => {
    const resolveProfilePic = async () => {
      if (!profilePic) {
        setProfilePicUrl(null);
        return;
      }

      // NEW image (blob/file) → use directly
      if (
        profilePic.startsWith("blob:") ||
        profilePic.startsWith("file:")
      ) {
        setProfilePicUrl(profilePic);
        return;
      }

      // EXISTING S3 image → convert to URL
      try {
        const result = await getUrl({
          path: profilePic,
          options: { validateObjectExistence: true },
        });
        setProfilePicUrl(result.url.toString());
      } catch (err) {
        console.error("Failed to load profile image", err);
        setProfilePicUrl(null);
      }
    };

    resolveProfilePic();
  }, [profilePic]);

  // For fetching realtors to select for admin
  useEffect(() => {
    const fetchRealtors = async () => {
      try {
        const response = await get({
          apiName: 'realtorAdminApi',
          path: '/realtors',
        }).response;

        const data = await response.body.json();
        setRealtors(data);
      } catch (err) {
        console.error("Failed to load realtors", err);
      } finally {
        setLoadingRealtors(false);
      }
    };

    fetchRealtors();
  }, []);


  // useEffect for checks on existing profile
  useEffect(() => {
    if (!selectedRealtor) return;

    const loadProfile = async () => {
      const existing = await DataStore.query(
        Realtor,
        r => r.sub.eq(selectedRealtor.sub)
      );

      if (existing.length > 0) {
        const profile = existing[0];
        setDbRealtor(profile);

        setFirstName(profile.firstName || "");
        setLastName(profile.lastName || "");
        setUsername(profile.username || "");
        setMyDescription(profile.myDescription || "");
        setAddress(profile.address || "");
        setPhoneNumber(profile.phoneNumber || "");
        setBankName(profile.bankName || "");
        setAccountName(profile.accountName || "");
        setAccountNumber(profile.accountNumber || "");
        setProfilePic(profile.profilePic || null);
      } else {
        setDbRealtor(null);
        // reset form
      }
    };

    loadProfile();
  }, [selectedRealtor]);



  // useEffect for username check
  useEffect(() => {
    if (!selectedRealtor) return; // 🚫 no realtor selected

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

        const otherUser = userResults.find(
          (user) => user.id !== dbRealtor?.id
        );

        const otherRealtor = realtorResults.find(
          (realtor) => realtor.id !== dbRealtor?.id
        );

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

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);

  }, [username, selectedRealtor, dbRealtor]);

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
          onClick={() => navigate('/?section=signin')}
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

          <Autocomplete
            options={realtors}
            getOptionLabel={(option) => option.email || ""}
            loading={loadingRealtors}
            value={selectedRealtor}
            onChange={(event, newValue) => {
              if (!newValue) {
                // 👇 Realtor cleared — reset form safely
                setSelectedRealtor(null);
                setDbRealtor(null);

                setFirstName("");
                setLastName("");
                setUsername("");
                setMyDescription("");
                setAddress("");
                setPhoneNumber("");
                setProfilePic(null);

                return;
              }

              // 👇 Realtor selected
              setSelectedRealtor(newValue ?? null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a vendor / realtor"
                placeholder="Type email to search..."
                className="realtorProfileInput"
              />
            )}
            isOptionEqualToValue={(option, value) =>
              option?.sub === value?.sub
            }
          />


          {!isRealtorSelected && (
            <p className="realtorHint">
              Please select a vendor / realtor to begin editing their profile
            </p>
          )}

          {/* Upload Profile Picture */}
          <div className="profilePicContainerEdit">
            {profilePicUrl && (
              <img src={profilePicUrl} alt="Profile" className="img" />
            )}

            {/* Plus Icon */}
            <div className="plusIconContainer">
              <input
                type="file"
                accept="image/*"
                onChange={pickImage}
                className="fileInput"
                style={{ display: "none" }} // Hide the default file input button
                disabled={!isRealtorSelected}
                id="fileInput"
              />
              {isRealtorSelected && (
                <label htmlFor="fileInput" className="plusIconLabel">
                  <span className="plusIcon">+</span>
                </label>
              )}
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
              disabled={!isRealtorSelected}
              // rows={2} 
            />

            <textarea
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name (Optional)"
              className="realtorProfileInput"
              disabled={!isRealtorSelected}
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
                disabled={!isRealtorSelected}
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
              disabled={!isRealtorSelected}
            />
            <p className="wordCount">{remainingWords}</p>

            <textarea
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
              className="realtorProfileInput"
              disabled={!isRealtorSelected}
              // rows={2} 
            />

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Input Address"
              className="realtorProfileInput"
              disabled={!isRealtorSelected}
            />

            <BankDetails/>
          </div>

          {/* Error Message */}
          <p className="realtorError">{errorMessage}</p>
          {usernameError && <p className="realtorError">{usernameError}</p>}

          <button 
            onClick={goToNxtPage} 
            className="profileNxtBtn"
            disabled={!isRealtorSelected || checkingUsername || !isUsernameAvailable}
          >
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