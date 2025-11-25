import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import './UploadProperty.css'
import { IoArrowBack } from "react-icons/io5";
import browserImageCompression from "browser-image-compression"; 
import ReviewUpload from "../EditReviewUpload/ReviewUpload"; 
import { useAuthContext } from "../../../../../../../Providers/ClientProvider/AuthProvider";
import { useUploadContext } from "../../../../../../../Providers/RealtorProvider/UploadProvider";
import { DataStore } from "aws-amplify/datastore";
import { uploadData } from "aws-amplify/storage";
import { Post, BookingPostOptions } from "../../../../../../models";

// Safely determine if a file is actually an image
const isImageMime = (mime) => {
  if (!mime) return false;
  return mime.startsWith("image/");
};

// Determine file extension when type is missing
const getFileExtensionFromURI = (uri) => {
  if (!uri) return null;
  const match = uri.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov|mkv)$/i);
  return match ? match[1].toLowerCase() : null;
};

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
    eventName, 
    setEventName,
    eventDateTime, 
    setEventDateTime,
    eventEndDateTime, 
    setEventEndDateTime,
    recurrence, 
    setRecurrence,
    eventFrequency, 
    setEventFrequency,
    dressCode, 
    setDressCode,
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
    setVendorCommissionAmount,
    vendorCommissionAmount,
    vendorCommissionBreakdown, setVendorCommissionBreakdown,
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
    isSubscription, 
    setIsSubscription,
    bookingMode, 
    setBookingMode,
    allowMultiple, setAllowMultiple,
    maxCapacity, setMaxCapacity,
    sessionDuration, 
    setSessionDuration,
    sessionGap, setSessionGap,
    servicingDay, 
    setServicingDay,
    openingHour, 
    setOpeningHour,
    closingHour, 
    setClosingHour,
    amenities,
    setAmenities,
    policies,
    setPolicies,
    bookingPostOptionType, setBookingPostOptionType,
    bookingTypes, setBookingTypes,
    bookingName, setBookingName,
    optionPrice, setOptionPrice,
    minSpend, setMinSpend,
    options, setOptions,
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
    setEventName("");
    setEventDateTime("");
    setEventEndDateTime("");
    setRecurrence("");
    setEventFrequency("");
    setDressCode("");
    setPrice(null);
    setInspectionFee("");
    setOtherFeesName("");
    setOtherFeesPrice("");
    setOtherFeesName2("");
    setOtherFeesPrice2("");
    setTotalPrice("");
    setVendorCommissionAmount("");
    setVendorCommissionBreakdown({});
    setCountry("");
    setState("");
    setCity("");
    setPolicies("");
    setAmenities("");
    setIsSubscription(false);
    setBookingMode("manual");
    setAllowMultiple(false);
    setMaxCapacity(null);
    setSessionDuration(null);
    setSessionGap(null);
    setServicingDay([]);
    setOpeningHour(null);
    setClosingHour(null);
    // setBookingPostOptionType("");
    // setBookingTypes([]);
    // setBookingName("");
    // setOptionPrice(null);
    // setMinSpend(null);
    setOptions([]);
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
      const newFiles = media.filter((item) => item.uri); // FIX ✔

      const uploadPromises = newFiles.map(async (item) => {
        const response = await fetch(item.uri);
        let fileBlob = await response.blob();

        const mime = fileBlob.type;
        const isImage = isImageMime(mime);

        let ext = getFileExtensionFromURI(item.uri);
        if (!ext) ext = isImage ? "jpg" : "mp4";

        let finalBlob = fileBlob;
        if (isImage) {
          finalBlob = await compressImage(fileBlob, item.name || "image.jpg");
        }

        const fileKey = `public/media/${sub}/${crypto.randomUUID()}.${ext}`;

        const result = await uploadData({
          path: fileKey,
          data: finalBlob,
          options: {
            contentType: mime || (isImage ? "image/jpeg" : "video/mp4"),
            onProgress: ({ transferredBytes, totalBytes }) => {
              if (totalBytes) {
                const prog = Math.round((transferredBytes / totalBytes) * 100);
                setUploadProgress(prog);
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


  // Handle the update process for all media and save post in DataStore
  const handleUpdate = async () => {
    if (uploading) return;
    setUploading(true);

    if (!onValidateUpload()) {
      setUploading(false);
      return;
    }

    try {
      // 1️⃣ Fetch EXISTING POST
      const existingPost = await DataStore.query(Post, uploadPost.id);
      if (!existingPost) throw new Error("Post not found");

      // 2️⃣ Separate OLD URLs and NEW Local Files
      const oldUrls = media
        .filter(item => item && !item.uri) // keep existing S3 media
        .map(item => item.key || item);     // convert object → URL string
      const newFiles = media.filter(item => item.uri && (item.uri.startsWith("blob:") || item.uri.startsWith("file:")));


      // 3️⃣ Upload NEW media files only
      let uploadedNewFiles = [];
      if (newFiles.length > 0) {
        const uploadPromises = newFiles.map(async (item) => {
          const response = await fetch(item.uri);
          const fileBlob = await response.blob();

          let compressedBlob = fileBlob;
          if (item.type.startsWith("image")) {
            compressedBlob = await compressImage(fileBlob, item.name);
          }

          const ext = item.type.startsWith("image") ? "jpg" : "mp4";
          const fileKey = `public/media/${sub}/${crypto.randomUUID()}.${ext}`;

          const result = await uploadData({
            path: fileKey,
            data: compressedBlob,
            options: {
              contentType: item.type,
              onProgress: ({ transferredBytes, totalBytes }) => {
                if (totalBytes) {
                  const prog = Math.round((transferredBytes / totalBytes) * 100);
                  setUploadProgress(prog);
                }
              },
            },
          }).result;

          return result.path;
        });

        uploadedNewFiles = await Promise.all(uploadPromises);
      }

      // 4️⃣ Combine Old + New media
      const finalMediaUrls = [...oldUrls, ...uploadedNewFiles];

      // 5️⃣ UPDATE THE EXISTING POST
      const updatedPost = await DataStore.save(
        Post.copyOf(existingPost, (updated) => {
          updated.propertyType = propertyType;
          updated.type = type;
          updated.packageType = packageType;
          updated.nameOfType = nameOfType;
          updated.availableDocs = availableDocs;
          updated.accommodationParts = accommodationParts;
          updated.media = finalMediaUrls;
          updated.description = description;
          updated.available = true;

          updated.capacity = capacity;
          updated.eventName = eventName;
          updated.eventDateTime = eventDateTime;
          updated.eventEndDateTime = eventEndDateTime;
          updated.recurrence = recurrence;
          updated.eventFrequency = eventFrequency;
          updated.dressCode = dressCode;

          updated.fullAddress = fullAddress;
          updated.generalLocation = generalLocation;
          updated.lat = parseFloat(lat);
          updated.lng = parseFloat(lng);

          updated.timeFrame = timeFrame;
          updated.inspectionFee = parseFloat(inspectionFee);
          updated.cautionFee = parseFloat(cautionFee);
          updated.otherFeesName = otherFeesName;
          updated.otherFeesPrice = parseFloat(otherFeesPrice);
          updated.otherFeesName2 = otherFeesName2;
          updated.otherFeesPrice2 = parseFloat(otherFeesPrice2);
          updated.price = parseFloat(price);
          updated.totalPrice = parseFloat(totalPrice);

          updated.vendorCommissionAmount = parseFloat(vendorCommissionAmount);
          updated.vendorCommissionBreakdown = JSON.stringify(vendorCommissionBreakdown);

          updated.bed = bed;
          updated.bedrooms = bedrooms;
          updated.amenities = amenities;
          updated.policies = policies;

          updated.country = country;
          updated.state = state;
          updated.city = city;

          updated.isApproved = false;
          updated.isSubscription = isSubscription;
          updated.bookingMode = bookingMode;
          updated.allowMultiple = allowMultiple;
          updated.maxCapacity = maxCapacity;
          updated.sessionDuration = sessionDuration;
          updated.sessionGap = sessionGap;
          updated.servicingDay = Array.isArray(servicingDay) ? servicingDay : [servicingDay];
          updated.openingHour = openingHour;
          updated.closingHour = closingHour;

          updated.uploadStatus = "COMPLETED_EDITED";
          updated.uploadErrorMessage = "";
        })
      );

      // Updating booking options
      for (const opt of options) {
        if (opt.id) {
          await DataStore.save(
            BookingPostOptions.copyOf(
              await DataStore.query(BookingPostOptions, opt.id),
              updated => {
                updated.bookingPostOptionType = opt.bookingPostOptionType;
                updated.bookingName = opt.bookingName;
                updated.optionPrice = Number(opt.optionPrice);
                updated.minTime = opt.minSpend;               
              }
            )
          );
        } else {
          await DataStore.save(
            new BookingPostOptions({
              bookingPostOptionType: opt.bookingPostOptionType,
              optionName: opt.bookingName,
              optionPrice: Number(opt.optionPrice),
              minTime: opt.minSpend,
              propertypostID: updatedPost.id,
            })
          );
        }
      }

      alert("Post updated successfully!");

      resetFormFields();
      navigate("/realtorcontent/home");

    } catch (e) {
      console.error("Update error:", e);
      alert(`Error: ${e.message}`);
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
          onClick={handleUpdate}
          disabled={uploading}
        >
          <p className="uploadTxt">
              {uploading
              ? `Updating... ${uploadProgress}%`
              : "Update"}
          </p>
        </button>
      </div>
    </div>
  );
};

export default UploadProperty;