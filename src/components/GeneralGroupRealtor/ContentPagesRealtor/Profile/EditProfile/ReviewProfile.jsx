import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5"; 
import { useProfileContext } from '../../../../../../Providers/RealtorProvider/ProfileProvider';
import { useAuthContext } from '../../../../../../Providers/ClientProvider/AuthProvider';
import { DataStore } from 'aws-amplify/datastore';
import { Realtor } from '../../../../../models';
import { uploadData, remove } from 'aws-amplify/storage';

const ReviewDetails = () => {
  const navigate = useNavigate();

  const {firstName, lastName, profilePic, setProfilePic, address, phoneNumber, bankname, accountName, accountNumber, myDescription} = useProfileContext()

  const { dbRealtor, setDbRealtor, sub } = useAuthContext();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Function to manipulate the image using canvas. Then with multiple images I used browserImageCompression 
  const manipulateImage = async (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const targetWidth = 600;
        const scale = targetWidth / img.width;
        canvas.width = targetWidth;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.7 // Compression quality
        );
      };

      img.onerror = (error) => {
        reject(error);
      };
    });
  };

  // Function to upload image
  async function uploadImage() {
    try {
      if (dbRealtor?.profilePic) {
        await remove({ path: dbRealtor.profilePic });
      }

      const manipulatedBlob = await manipulateImage(profilePic);
      const fileKey = `public/profilePhoto/${sub}/${crypto.randomUUID()}.jpg`;

      const result = await uploadData({
        path: fileKey,
        data: manipulatedBlob,
        options: {
          contentType: "image/jpeg",
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              const progress = Math.round((transferredBytes / totalBytes) * 100);
              setUploadProgress(progress);
            }
          },
        },
      }).result;

      return result.path;
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  }

  // This function is to delete profile picture. A Realtor is not meant to be without a profile pic
  // const deleteProfilePic = async () => {
  //   if (!dbRealtor?.profilePic) return;

  //   setUploading(true);
  //   try {
  //     await remove({ path: dbRealtor.profilePic });
  //     const updatedUser = await DataStore.save(
  //       User.copyOf(dbRealtor, (updated) => {
  //         updated.profilePic = null;
  //       })
  //     );

  //     setDbRealtor(updatedUser);
  //     alert("Profile Picture Removed");
  //     setProfilePic(null);
  //   } catch (error) {
  //     alert("Error removing profile picture");
  //     console.error("Error removing profile picture:", error);
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const createUser = async () => {
    if (uploading) return;
    setUploading(true);

    try {
      const uploadedImagePath = await uploadImage();
      const user = await DataStore.save(
        new Realtor({
          profilePic: uploadedImagePath,
          firstName, lastName, myDescription, address, phoneNumber, bankname, accountName, accountNumber,
          sub
        })
      );
      setDbRealtor(user);
    } catch (e) {
      alert(`Error: ${e.message}`);
    }
  };

  const updateUser = async () => {
    if (uploading) return;
    setUploading(true);

    try {
      const uploadedImagePath = await uploadImage();
      const user = await DataStore.save(
        Realtor.copyOf(dbRealtor, (updated) => {
          updated.firstName = firstName;
          updated.lastName = lastName;
          updated.myDescription = myDescription;
          updated.profilePic = uploadedImagePath;
          updated.address = address;
          updated.phoneNumber = phoneNumber;
          updated.bankname = bankname;
          updated.accountName = accountName,
          updated.accountNumber = accountNumber;
        })
      );
      setDbRealtor(user);
    } catch (e) {
      alert(`Error: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (dbRealtor) {
      await updateUser();
      navigate("/realtorcontent/profile"); 
      setTimeout(() => {
        navigate('/realtorcontent/home');
      }, 1000);
    } else {
      await createUser();
      navigate("/realtorcontent/profile");
      setTimeout(() => {
        navigate('/realtorcontent/home');
      }, 1000);
    }
  };

  return (
    <div className='reviewProContainer'>
      <h1 className='title'>Review Profile</h1>

      <button onClick={() => window.history.back()} className='bckBtnCon'>
        <IoArrowBack className='bckBtnIcon' />
      </button>

      <div className='scrollContainer'>
        {profilePic && (
          <div className="profilePicContainerFull">
            <div className='profilePicContainer'>
              <img src={profilePic} alt="Profile" className='img' />
            </div>
          </div>
        )}

        <p className='subHeader'>First Name:</p>
        <p className='inputReview'>{firstName?.trim()}</p>

        <p className='subHeader'>Last Name:</p>
        <p className='inputReview'>{lastName?.trim()}</p>

        <p className='subHeader'>Address:</p>
        <p className='inputReview'>{address?.trim()}</p>

        <p className='subHeader'>My Description:</p>
        <p className='inputReview'>{myDescription?.trim()}</p>
        <p className='subHeader'>Address:</p>
        <p className='inputReview'>{address?.trim()}</p>
        <p className='subHeader'>Phone Number:</p>
        <p className='inputReview'>{phoneNumber}</p>
        <p className='subHeader'>Bank Name:</p>
        <p className='inputReview'>{bankname?.trim()}</p>
        <p className='subHeader'>Account Name:</p>
        <p className='inputReview'>{accountName?.trim()}</p>
        <p className='subHeader'>Account Number:</p>
        <p className='inputReviewLast'>{accountNumber}</p>
      </div>

      <button className='saveBtn' disabled={uploading} onClick={handleSave}>
        <p className="saveBtnTxt">
          {uploading ? `Saving... ${uploadProgress}%` : "Save"}
        </p>
      </button>
    </div>
  );
};

export default ReviewDetails;