import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { IoArrowBack } from "react-icons/io5";
import browserImageCompression from "browser-image-compression"; 
import ReviewUpload from "../ReviewUpload/ReviewUpload"; 
import { useAuthContext } from "../../../../../../../../../../Providers/ClientProvider/AuthProvider";
import { useUploadContext } from "../../../../../../../../../../Providers/RealtorProvider/UploadProvider";
import { DataStore } from "aws-amplify/datastore";
import { uploadData } from "aws-amplify/storage";
import { Post, BookingPostOptions } from "../../../../../../../../../models";

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
    setExistingMedia,
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

    // Admin states
    selectedRealtor,
    setSelectedRealtor,
  } = useUploadContext();

  const realtorIdToUse = selectedRealtor?.id;
  const realtorSubToUse = selectedRealtor?.sub;

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
    
    // ✅ Clear selection state ONLY
    setExistingMedia(prev =>
      prev.map(m => ({ ...m, selected: false }))
    );
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

    // Admin state
    setSelectedRealtor("");
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
      const uploadPromises = media.map(async (item) => {
        const isLocal =
          item.uri.startsWith("blob:") || item.uri.startsWith("file:");
        const isRemote = item.uri.startsWith("https://");

        // 1️⃣ If remote (already in S3), DO NOT re-upload
        if (isRemote) {
          const key = item.key || extractKeyFromUrl(item.uri);
          return key;
        }

        // 2️⃣ For device media — upload
        const response = await fetch(item.uri);
        const fileBlob = await response.blob();

        let compressedBlob = fileBlob;

        if (isLocal && item.type.startsWith("image")) {
          compressedBlob = await compressImage(fileBlob, item.name);
        }

        const fileExtension = item.type.startsWith("image") ? "jpg" : "mp4";
        const fileKey = `public/media/${realtorSubToUse}/${crypto.randomUUID()}.${fileExtension}`;

        const result = await uploadData({
          path: fileKey,
          data: compressedBlob,
          options: {
            contentType: item.type,
          },
        }).result;

        return result.path;
      });

      const mediaUrls = await Promise.all(uploadPromises);
      return mediaUrls;
    } catch (e) {
      console.error("Error uploading files:", e);
      alert("Failed to upload media.");
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

    let tempPost = null;

    try {
      // 1️⃣ Create lightweight draft post FIRST
      tempPost = await DataStore.save(
        new Post({
          realtorID: realtorIdToUse,
          uploadStatus: "UPLOADING",
          uploadErrorMessage: null,
          
          // REQUIRED FIELDS
          propertyType: propertyType || "TEMP",
          type: type || "TEMP",
          description: description || "TEMP",
          totalPrice: parseFloat(totalPrice) || 0,
          country: country || "TEMP",
        })
      );

      setUploadPost(tempPost);

      // 2️⃣ Upload media
      const mediaUrls = await uploadMedia();
      if (mediaUrls.length === 0) throw new Error("Media upload failed");

      // 3️⃣ Update post with full content
      const fullPost = await DataStore.save(
        Post.copyOf(tempPost, (updated) => {
          updated.propertyType = propertyType;
          updated.type = type;
          updated.packageType = packageType;
          updated.nameOfType = nameOfType;
          updated.availableDocs = availableDocs;
          updated.accommodationParts = accommodationParts;
          updated.media = mediaUrls;
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
          updated.servicingDay = Array.isArray(servicingDay)
            ? servicingDay
            : [servicingDay];
          updated.openingHour = openingHour;
          updated.closingHour = closingHour;
        })
      );

      // 4️⃣ Save BookingPostOptions
      await Promise.all(
        options.map((opt) =>
          DataStore.save(
            new BookingPostOptions({
              postID: fullPost.id,
              bookingPostOptionType: opt.bookingPostOptionType,
              bookingName: opt.bookingName,
              optionPrice: parseFloat(opt.optionPrice) || 0,
              minSpend: parseFloat(opt.minSpend) || 0,
              maxGuests: opt.maxGuests || null,
            })
          )
        )
      );

      // 5️⃣ Mark COMPLETED
      await DataStore.save(
        Post.copyOf(fullPost, (updated) => {
          updated.uploadStatus = "COMPLETED";
          updated.uploadErrorMessage = null;
        })
      );

      alert("Post uploaded successfully!");

      resetFormFields();
      navigate("/admin/profile");
      setTimeout(() => navigate("/admin/home"), 500);
    } catch (e) {
      console.error("Upload error:", e);

      if (tempPost?.id) {
        await DataStore.save(
          Post.copyOf(tempPost, (updated) => {
            updated.uploadStatus = "FAILED";
            updated.uploadErrorMessage = e.message;
          })
        );
      }

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