import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import './UploadProperty.css'
import { IoArrowBack } from "react-icons/io5";
import browserImageCompression from "browser-image-compression"; 
import ReviewUpload from "../ReviewUpload/ReviewUpload"; 
import { useAuthContext } from "../../../../../../../Providers/ClientProvider/AuthProvider";
import { useUploadContext } from "../../../../../../../Providers/RealtorProvider/UploadProvider";
import { DataStore } from "aws-amplify/datastore";
import { uploadData } from "aws-amplify/storage";
import { Post } from "../../../../../../models";

const UploadProperty = () => {
  const navigate = useNavigate();

  const { dbRealtor, sub } = useAuthContext();
  const {
    propertyType,
    setPropertyType,
    type,
    setType,
    nameOfType,
    setNameOfType,
    availableDocs,
    setAvailableDocs,
    accommodationParts,
    setAccommodationParts,
    media,
    setMedia,
    description,
    setDescription,
    bedrooms,
    setBedrooms,
    bed,
    setBed,
    cautionFee,
    setCautionFee,
    timeFrame,
    setTimeFrame,
    inspectionFee,
    setInspectionFee,
    price,
    setPrice,
    totalPrice,
    setTotalPrice,
    country,
    setCountry,
    state,
    setState,
    city,
    setCity,
    address,
    setAddress,
    lat,
    setLat,
    lng,
    setLng,
    amenities,
    setAmenities,
    policies,
    setPolicies,
    uploadPost,
    setUploadPost,
    onValidateUpload,
  } = useUploadContext();

  console.log('media:',media)

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Reset form fields function
  const resetFormFields = () => {
    setPropertyType("");
    setType("");
    setNameOfType("");
    setAvailableDocs("");
    setAccommodationParts("");
    setMedia([]);
    setDescription("");
    setAddress("");
    setLat(null);
    setLng(null);
    setBedrooms("");
    setBed("");
    setCautionFee("");
    setTimeFrame("");
    setPrice("");
    setInspectionFee("");
    setTotalPrice("");
    setCountry("");
    setState("");
    setCity("");
    setPolicies("");
    setAmenities("");
  };

  // Compress and upload images
  const uploadImages = async () => {
    try {
      const uploadPromises = media.map(async (item) => {
        // Step 1: Fetch the blob from the `uri`
        const response = await fetch(item.uri);
        const fileBlob = await response.blob();

        // Step 2: Convert blob into a File object (for compression)
        const file = new File([fileBlob], item.name, { type: fileBlob.type });

        // Step 3: Image manipulation (resize and compress)
        const options = {
          maxSizeMB: 0.5, // Compress to max 0.5 MB
          maxWidthOrHeight: 600, // Resize to 600px
          useWebWorker: true,
        };

        const compressedFile = await browserImageCompression(file, options);

        // Step 4: Create a Blob from the compressed file
        const compressedBlob = new Blob([compressedFile], { type: "image/jpeg" });

        // Step 5: Generate a unique file key
        const fileKey = `public/media/${sub}/${crypto.randomUUID()}.jpg`;

        // Step 6: Upload image to S3
        const result = await uploadData({
          path: fileKey,
          data: compressedBlob,
          options: {
            contentType: "image/jpeg",
            onProgress: ({ transferredBytes, totalBytes }) => {
              if (totalBytes) {
                const progress = Math.round(
                  (transferredBytes / totalBytes) * 100
                );
                setUploadProgress(progress); // Update upload progress
                console.log(`Upload progress: ${progress}%`);
              }
            },
          },
        }).result;

        return result.path;
      });

      // Wait for all uploads to complete
      const mediaUrls = await Promise.all(uploadPromises);
      return mediaUrls;
    } catch (e) {
      console.error("Error uploading files:", e);
      alert("Failed to upload media. Please try again.");
      return [];
    }
  };

  // Handle the upload process for all media and save post in DataStore
  const handleUpload = async () => {
    if (uploading) return;
    setUploading(true);

    if (!onValidateUpload()) {
      setUploading(false); // Reset uploading state if validation fails
      return;
    }

    try {
      const mediaUrls = await uploadImages();

      if (mediaUrls.length === 0) {
        alert("Failed to upload media. Please try again.");
        setUploading(false);
        return;
      }

      const post = await DataStore.save(
        new Post({
          propertyType,
          type,
          nameOfType,
          availableDocs,
          accommodationParts,
          media: mediaUrls,
          description,
          available: true,
          address,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          timeFrame,
          inspectionFee: parseFloat(inspectionFee),
          cautionFee: parseFloat(cautionFee),
          price: parseFloat(price),
          totalPrice: parseFloat(totalPrice),
          bed,
          bedrooms,
          amenities,
          policies,
          country,
          state,
          city,
          realtorID: dbRealtor.id,
        })
      );
      setUploadPost(post);
      alert("Post uploaded successfully!");

      // Reset form fields after upload
      resetFormFields();

      // Navigate to /upload, then to /home after a short delay
      navigate("/realtorcontent/upload");
      setTimeout(() => {
        navigate("/realtorcontent/home");
      }, 500);
    } catch (e) {
      alert(`Error uploading post: ${e.message}`);
      console.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="uploadPropContainer">
      {/* Header */}
      <h1 className="uploadPropHeader">Review</h1>

      {/* Back Icon */}
      <button className="uploadPropBckBtn" onClick={() => navigate(-1)}>
        <IoArrowBack className="bkIcon" />
      </button>

      {/* Review Details */}
      <ReviewUpload />

      {/* Upload Button */}
      <div className="uploadBtnCon">
        <button
          className="btnUpload"
          onClick={handleUpload}
          disabled={uploading}
        >
          <p className="uploadTxt">
              {uploading
              ? `Uploading... ${uploadProgress}%`
              : "Upload!"}
          </p>
        </button>
      </div>
    </div>
  );
};

export default UploadProperty;