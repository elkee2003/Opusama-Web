import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataStore } from 'aws-amplify';
import { User } from '../models';
import styles from './Styles.css';

const ReviewDetails = ({ profileContext, authContext }) => {
  const { firstName, lastName, profilePic, address, phoneNumber } = profileContext;
  const { dbUser, setDbUser, sub } = authContext;

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigate = useNavigate();

  const handleSave = async () => {
    setUploading(true);
    try {
      const updatedUser = await DataStore.save(
        dbUser
          ? User.copyOf(dbUser, (updated) => {
              updated.firstName = firstName;
              updated.lastName = lastName;
              updated.address = address;
              updated.phoneNumber = phoneNumber;
              updated.profilePic = profilePic;
            })
          : new User({
              firstName,
              lastName,
              address,
              phoneNumber,
              profilePic,
              sub,
            })
      );
      setDbUser(updatedUser);
      navigate('/profile');
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Review Profile</h1>
      {profilePic && (
        <div className={styles.profilePicContainer}>
          <img src={profilePic} alt="Profile" className={styles.img} />
        </div>
      )}
      <div className={styles.details}>
        <p>
          <strong>First Name:</strong> {firstName}
        </p>
        <p>
          <strong>Last Name:</strong> {lastName}
        </p>
        <p>
          <strong>Address:</strong> {address}
        </p>
        <p>
          <strong>Phone Number:</strong> {phoneNumber}
        </p>
      </div>
      <button className={styles.saveBtn} onClick={handleSave} disabled={uploading}>
        {uploading ? `Saving... ${uploadProgress}%` : 'Save'}
      </button>
    </div>
  );
};

export default ReviewDetails;