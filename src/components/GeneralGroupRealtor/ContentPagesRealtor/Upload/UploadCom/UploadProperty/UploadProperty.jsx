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
    setPackageType("");
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

  // Function to upload images and videos
  const uploadMedia = async () => {
    try {
      const uploadPromises = media.map(async (item) => {
        const response = await fetch(item.uri);
        const fileBlob = await response.blob();

        if (item.type.startsWith("image")) {
          // Compress Image
          const file = new File([fileBlob], item.name, { type: fileBlob.type });
          const options = { maxSizeMB: 0.5, maxWidthOrHeight: 600, useWebWorker: true };
          const compressedFile = await browserImageCompression(file, options);
          const compressedBlob = new Blob([compressedFile], { type: "image/jpeg" });

          const fileKey = `public/media/${sub}/${crypto.randomUUID()}.jpg`;

          const result = await uploadData({
            path: fileKey,
            data: compressedBlob,
            options: {
              contentType: "image/jpeg",
              onProgress: ({ transferredBytes, totalBytes }) => {
                if (totalBytes) {
                  setUploadProgress(Math.round((transferredBytes / totalBytes) * 100));
                }
              },
            },
          }).result;

          return result.path;
        } 
        else if (item.type.startsWith("video")) {
          // Compress Video
          const fileKey = `public/media/${sub}/${crypto.randomUUID()}.mp4`;
          const compressedBlob = await compressVideo(fileBlob);

          const result = await uploadData({
            path: fileKey,
            data: compressedBlob,
            options: {
              contentType: "video/mp4",
              onProgress: ({ transferredBytes, totalBytes }) => {
                if (totalBytes) {
                  setUploadProgress(Math.round((transferredBytes / totalBytes) * 100));
                }
              },
            },
          }).result;

          return result.path;
        }
      });

      const mediaUrls = await Promise.all(uploadPromises);
      return mediaUrls;
    } catch (e) {
      console.error("Error uploading files:", e);
      alert("Failed to upload media. Please try again.");
      return [];
    }
  };

  // Video Compression Helper Function
  const compressVideo = async (videoBlob) => {
    return new Promise((resolve, reject) => {
      const videoElement = document.createElement("video");
      videoElement.src = URL.createObjectURL(videoBlob);
      videoElement.muted = true;
      videoElement.play();

      videoElement.onloadedmetadata = () => {
        const canvas = document.createElement("canvas");
        canvas.width = videoElement.videoWidth / 2;
        canvas.height = videoElement.videoHeight / 2;
        const ctx = canvas.getContext("2d");

        const stream = canvas.captureStream();
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm",
          videoBitsPerSecond: 500000, 
        });

        const chunks = [];
        mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
        mediaRecorder.onstop = () => {
          const compressedBlob = new Blob(chunks, { type: "video/mp4" });
          resolve(compressedBlob);
        };

        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), Math.min(videoElement.duration, 5000));
      };

      videoElement.onerror = (err) => reject(err);
    });
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
          address,
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