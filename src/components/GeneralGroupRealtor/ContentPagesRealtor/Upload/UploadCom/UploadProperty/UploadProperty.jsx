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
    packageType, 
    setPackageType,
    nameOfType,
    setNameOfType,
    availableDocs,
    setAvailableDocs,
    capacity,
    setCapacity,
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
    otherFeesName, 
    setOtherFeesName,
    otherFeesName2, 
    setOtherFeesName2,
    otherFeesPrice, 
    setOtherFeesPrice,
    otherFeesPrice2, 
    setOtherFeesPrice2,
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
    fullAddress,
    setFullAddress,
    generalLocation, 
    setGeneralLocation,
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
    setPackageType("");
    setNameOfType("");
    setAvailableDocs("");
    setAccommodationParts("");
    setMedia([]);
    setDescription("");
    setFullAddress("");
    setGeneralLocation("");
    setLat(null);
    setLng(null);
    setBedrooms("");
    setBed("");
    setCautionFee("");
    setTimeFrame("");
    setCapacity("");
    setPrice("");
    setInspectionFee("");
    setOtherFeesName("");
    setOtherFeesPrice("");
    setOtherFeesName2("");
    setOtherFeesPrice2("");
    setTotalPrice("");
    setCountry("");
    setState("");
    setCity("");
    setPolicies("");
    setAmenities("");
  };

  // Function to compress images
  const compressImage = async (fileBlob, filename) => {
    const file = new File([fileBlob], filename, { type: fileBlob.type });
    const options = { maxSizeMB: 0.5, maxWidthOrHeight: 600, useWebWorker: true };
    const compressedFile = await browserImageCompression(file, options);
    return new Blob([compressedFile], { type: "image/jpeg" });
  };

  // Function to upload media (images & videos)
  const uploadMedia = async () => {
    try {
      let totalFiles = media.length;
      let uploadedFiles = 0;

      const uploadPromises = media.map(async (item) => {
        const response = await fetch(item.uri);
        const fileBlob = await response.blob();
        let compressedBlob = fileBlob;
        let fileExtension = item.type.startsWith("image") ? "jpg" : "mp4";

        // Compress Image
        if (item.type.startsWith("image")) {
          compressedBlob = await compressImage(fileBlob, item.name);
        }

        // Generate a unique file path
        const fileKey = `public/media/${sub}/${crypto.randomUUID()}.${fileExtension}`;

        // Upload to S3
        const result = await uploadData({
          path: fileKey,
          data: compressedBlob,
          options: {
            contentType: item.type,
            onProgress: ({ transferredBytes, totalBytes }) => {
              if (totalBytes) {
                const progress = Math.round((transferredBytes / totalBytes) * 100);
                setUploadProgress(progress); // Show progress per file (optional)
              }
            },
          },
        }).result;

        return result.path;
      });

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
      const mediaUrls = await uploadMedia();

      if (mediaUrls.length === 0) {
        alert("Failed to upload media. Please try again.");
        setUploading(false);
        return;
      }

      const post = await DataStore.save(
        new Post({
          propertyType,
          type,
          packageType,
          nameOfType,
          availableDocs,
          accommodationParts,
          media: mediaUrls,
          description,
          available: true,
          capacity,
          fullAddress,
          generalLocation,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          timeFrame,
          inspectionFee: parseFloat(inspectionFee),
          cautionFee: parseFloat(cautionFee),
          otherFeesName,
          otherFeesPrice: parseFloat(otherFeesPrice),
          otherFeesName2,
          otherFeesPrice2: parseFloat(otherFeesPrice2),
          price: parseFloat(price),
          totalPrice: parseFloat(totalPrice),
          bed,
          bedrooms,
          amenities,
          policies,
          country,
          state,
          city,
          isApproved: 'false',
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