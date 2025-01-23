import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { signOut } from "aws-amplify/auth";
import { useAuthContext } from "../../../../../../Providers/ClientProvider/AuthProvider";
import { useProfileContext } from "../../../../../../Providers/ClientProvider/ProfileProvider";
import { FiArrowRightCircle } from "react-icons/fi"; 
import "./Styles.css";

const EditProfile = () => {
  const { authUser, dbUser } = useAuthContext();
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    profilePic,
    address,
    setAddress,
    setProfilePic,
    phoneNumber,
    setPhoneNumber,
    errorMessage,
    onValidateInput,
  } = useProfileContext();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    if (onValidateInput()) {
      navigate("/clientcontent/reviewedit"); 
      
    }
  };

  const onSignIn = () => {
    navigate('/clientcontent/home');
    
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

  // I need to add the already existing inputs for this condition and I don't have that time.
  // if (authUser){
  //     if (!dbUser) {
  //         return (
  //             <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  //             <p style={{ fontSize: 20, fontWeight: 'bold', color: '#afadad' }}>
  //                 Kindly Fill in your data to to access other pages. Thank you.
  //             </p>
  //             </div>
  //         );
  //     }
  // }

  return (
    <div className="profileContainer">
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
              className="profileInput"
              // rows={2} 
            />

            <textarea
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Surname (Optional)"
              className="profileInput"
              // rows={2} 
            />

            <textarea
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
              className="profileInput"
              // rows={2} 
            />

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Input Address"
              className="profileInputLast"
              // rows={2} 
            />
          </div>

          {/* Error Message */}
          <p className="error">{errorMessage}</p>

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