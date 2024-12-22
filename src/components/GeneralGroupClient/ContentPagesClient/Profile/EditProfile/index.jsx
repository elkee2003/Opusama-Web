import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify';
import styles from './Styles.css';

const EditProfile = ({ profileContext }) => {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    profilePic,
    setProfilePic,
    address,
    setAddress,
    phoneNumber,
    setPhoneNumber,
    errorMessage,
    onValidateInput,
  } = profileContext;

  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNextPage = () => {
    if (onValidateInput()) {
      navigate('/review-profile');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Profile</h1>
      <div className={styles.profilePicContainer}>
        {profilePic && <img src={profilePic} alt="Profile" className={styles.img} />}
        <label className={styles.uploadLabel}>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <span className={styles.uploadButton}>Upload</span>
        </label>
      </div>
      <button className={styles.signOutBtn} onClick={handleSignOut}>Sign Out</button>
      <div className={styles.form}>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Name / Company Name"
          className={styles.input}
        />
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Surname (Optional)"
          className={styles.input}
        />
        <input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
          type="number"
          className={styles.input}
        />
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Input Address"
          className={styles.input}
        />
      </div>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      <button className={styles.nextBtn} onClick={handleNextPage}>Next</button>
    </div>
  );
};

export default EditProfile;