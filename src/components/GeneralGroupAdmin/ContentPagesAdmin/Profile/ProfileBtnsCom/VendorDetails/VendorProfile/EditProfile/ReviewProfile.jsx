import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5"; 
import { useProfileContext } from '../../../../../../../../../Providers/RealtorProvider/ProfileProvider';
import { useAuthContext } from '../../../../../../../../../Providers/ClientProvider/AuthProvider';
import { DataStore } from 'aws-amplify/datastore';
import { Realtor } from '../../../../../../../../models';
import { getUrl, uploadData, remove } from 'aws-amplify/storage';

const ReviewDetails = () => {
  const navigate = useNavigate();

  const {firstName, lastName, username, myDescription, profilePic, address, phoneNumber, bankName, accountName, accountNumber,
    // For admin
    selectedRealtor,
  } = useProfileContext()

  const { dbRealtor, setDbRealtor, } = useAuthContext();

  const isLocalImage = (value) =>
    typeof value === "string" &&
    (value.startsWith("blob:") || value.startsWith("file:"));

  const [profilePicUrl, setProfilePicUrl] = useState(null);

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
  async function uploadImageIfChanged() {
    // 1️⃣ No image at all
    if (!profilePic) return null;

    // 2️⃣ Image NOT changed → return existing S3 key
    if (!isLocalImage(profilePic)) {
      return profilePic;
    }

    // 3️⃣ Image WAS changed → upload new one
    const response = await fetch(profilePic);
    const blob = await response.blob();

    const ownerSub = selectedRealtor?.sub;
    const fileKey = `public/profilePhoto/${ownerSub}/${crypto.randomUUID()}.jpg`;

    const result = await uploadData({
      path: fileKey,
      data: blob,
      options: {
        contentType: "image/jpeg",
        onProgress: ({ transferredBytes, totalBytes }) => {
          if (totalBytes) {
            setUploadProgress(
              Math.round((transferredBytes / totalBytes) * 100)
            );
          }
        },
      },
    }).result;

    // 4️⃣ Delete OLD image only if it was replaced
    if (dbRealtor?.profilePic) {
      await remove({ path: dbRealtor.profilePic });
    }

    return result.path;
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

  // To create a new Vendor
  const createUser = async () => {
    if (!selectedRealtor) return alert("Select a realtor first");
    if (uploading) return;

    setUploading(true);

    try {
      const uploadedImagePath = await uploadImageIfChanged();

      const user = await DataStore.save(
        new Realtor({
          sub: selectedRealtor.sub,
          email: selectedRealtor.email,

          firstName,
          lastName,
          username,
          myDescription,
          address,
          phoneNumber,
          bankName,
          accountName,
          accountNumber,

          profilePic: uploadedImagePath,
          directPayment: false,
        })
      );

      setDbRealtor(user);
    } catch (e) {
      alert(`Error: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  // To update Vendor
  const updateUser = async () => {
    if (!dbRealtor || !selectedRealtor || uploading) return;
    setUploading(true);

    try {
      const uploadedImagePath = await uploadImageIfChanged();

      const user = await DataStore.save(
        Realtor.copyOf(dbRealtor, (updated) => {
          updated.firstName = firstName;
          updated.lastName = lastName;
          updated.username = username;
          updated.email = selectedRealtor.email;
          updated.myDescription = myDescription;
          updated.address = address;
          updated.phoneNumber = phoneNumber;
          updated.bankName = bankName;
          updated.accountName = accountName;
          updated.accountNumber = accountNumber;

          if (uploadedImagePath) {
            updated.profilePic = uploadedImagePath;
          }
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
      navigate("/admin/profile"); 
      setTimeout(() => {
        navigate('/admin/home');
      }, 1000);
    } else {
      await createUser();
      navigate("/admin/profile");
      setTimeout(() => {
        navigate('/admin/home');
      }, 1000);
    }
  };

  // useEffect for converting S3key to URL
  useEffect(() => {
    const resolveImage = async () => {
      if (!profilePic) {
        setProfilePicUrl(null);
        return;
      }

      if (isLocalImage(profilePic)) {
        setProfilePicUrl(profilePic);
        return;
      }

      const result = await getUrl({ path: profilePic });
      setProfilePicUrl(result.url.toString());
    };

    resolveImage();
  }, [profilePic]);

  return (
    <div className='realtorReviewProContainer'>
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
        <p className='realtorInputReview'>{firstName?.trim()}</p>

        <p className='subHeader'>Last Name:</p>
        <p className='realtorInputReview'>{lastName?.trim()}</p>

        <p className='subHeader'>Username:</p>
        <p className='realtorInputReview'>@{username?.trim()}</p>

        <p className='subHeader'>Address:</p>
        <p className='realtorInputReview'>{address?.trim()}</p>

        <p className='subHeader'>My Description:</p>
        <p className='realtorInputReview'>{myDescription?.trim()}</p>
        <p className='subHeader'>Address:</p>
        <p className='realtorInputReview'>{address?.trim()}</p>
        <p className='subHeader'>Phone Number:</p>
        <p className='realtorInputReview'>{phoneNumber}</p>
        <p className='subHeader'>Bank Name:</p>
        <p className='realtorInputReview'>{bankName?.trim()}</p>
        <p className='subHeader'>Account Name:</p>
        <p className='realtorInputReview'>{accountName?.trim()}</p>
        <p className='subHeader'>Account Number:</p>
        <p className='realtorInputReviewLast'>{accountNumber}</p>
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