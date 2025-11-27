import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import './UploadProperty.css'
import { IoArrowBack } from "react-icons/io5";
import browserImageCompression from "browser-image-compression"; 
import ReviewUpload from "../ReviewUpload/ReviewUpload"; 
import { useAuthContext } from "../../../../../../../Providers/ClientProvider/AuthProvider";
import { useUploadContext } from "../../../../../../../Providers/RealtorProvider/UploadProvider";
import { DataStore } from "aws-amplify/datastore";
import { uploadData } from "aws-amplify/storage";
import { Post, BookingPostOptions } from "../../../../../../models";

const UPLOAD_DRAFT_ID_KEY = "uploadDraftPostId";
const UPLOAD_DRAFT_KEY = "uploadDraft";

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
    // local draft helpers from provider:
    saveDraftToLocal,
    loadDraftFromLocal,
    clearLocalDraft,
    loadExistingPost,
  } = useUploadContext();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

   // Cloud draft Id (persisted localStorage)
  const [cloudDraftId, setCloudDraftId] = useState(
    localStorage.getItem(UPLOAD_DRAFT_ID_KEY) || null
  );

  // Loading indicator for initial draft
  const [loadingDraft, setLoadingDraft] = useState(true);

  // Debounce refs
  const draftSyncTimer = useRef(null);
  const isMountedRef = useRef(false);

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

  // ---------- helper: extractKeyFromUrl (noop for now, keeps your existing behavior) ----------
  const extractKeyFromUrl = (url) => url;

  // ---------- Create or load cloud draft ----------
  const createCloudDraftIfNotExists = async () => {
    try {
      const existingId = localStorage.getItem(UPLOAD_DRAFT_ID_KEY);
      if (existingId) {
        setCloudDraftId(existingId);
        const existing = await DataStore.query(Post, existingId);
        if (existing) {
          setUploadPost(existing);
          // If there is cloud data, prefer loading it into context (merge)
          loadExistingPost(existing);
        } else {
          // remove invalid id
          localStorage.removeItem(UPLOAD_DRAFT_ID_KEY);
          setCloudDraftId(null);
        }
        return existing;
      }

      // create minimal cloud draft
      const draft = await DataStore.save(
        new Post({
          realtorID: dbRealtor?.id || "UNKNOWN",
          uploadStatus: "UPLOADING",
          uploadErrorMessage: null,
          propertyType: propertyType || "",
          type: type || "",
          description: description || "",
          totalPrice: totalPrice ? parseFloat(totalPrice) : 0,
          country: country || "",
          media: [],
        })
      );

      localStorage.setItem(UPLOAD_DRAFT_ID_KEY, draft.id);
      setCloudDraftId(draft.id);
      setUploadPost(draft);
      return draft;
    } catch (e) {
      console.error("createCloudDraftIfNotExists error:", e);
      return null;
    }
  };

  // ---------- Debounced sync to cloud ----------
  const syncDraftToCloud = async () => {
    if (!cloudDraftId) return;
    try {
      const original = await DataStore.query(Post, cloudDraftId);
      if (!original) return;

      await DataStore.save(
        Post.copyOf(original, (updated) => {
          updated.propertyType = propertyType || updated.propertyType;
          updated.type = type || updated.type;
          updated.packageType = packageType || updated.packageType;
          updated.nameOfType = nameOfType || updated.nameOfType;
          updated.availableDocs = availableDocs || updated.availableDocs;
          updated.accommodationParts = accommodationParts || updated.accommodationParts;

          // For draft we can store URIs (these may be local blob/file paths or S3 paths)
          updated.media = Array.isArray(media) ? media.map((m) => m.uri || m.key || m) : updated.media;

          updated.description = description || updated.description;
          updated.capacity = capacity || updated.capacity;
          updated.eventName = eventName || updated.eventName;
          updated.eventDateTime = eventDateTime || updated.eventDateTime;
          updated.eventEndDateTime = eventEndDateTime || updated.eventEndDateTime;
          updated.recurrence = recurrence || updated.recurrence;
          updated.eventFrequency = eventFrequency || updated.eventFrequency;
          updated.dressCode = dressCode || updated.dressCode;
          updated.fullAddress = fullAddress || updated.fullAddress;
          updated.generalLocation = generalLocation || updated.generalLocation;
          updated.lat = lat !== null && lat !== undefined ? parseFloat(lat) : updated.lat;
          updated.lng = lng !== null && lng !== undefined ? parseFloat(lng) : updated.lng;

          updated.timeFrame = timeFrame || updated.timeFrame;
          updated.inspectionFee = inspectionFee ? parseFloat(inspectionFee) : updated.inspectionFee;
          updated.cautionFee = cautionFee ? parseFloat(cautionFee) : updated.cautionFee;
          updated.otherFeesName = otherFeesName || updated.otherFeesName;
          updated.otherFeesPrice = otherFeesPrice ? parseFloat(otherFeesPrice) : updated.otherFeesPrice;
          updated.otherFeesName2 = otherFeesName2 || updated.otherFeesName2;
          updated.otherFeesPrice2 = otherFeesPrice2 ? parseFloat(otherFeesPrice2) : updated.otherFeesPrice2;
          updated.price = price ? parseFloat(price) : updated.price;
          updated.totalPrice = totalPrice ? parseFloat(totalPrice) : updated.totalPrice;

          updated.vendorCommissionAmount = vendorCommissionAmount || updated.vendorCommissionAmount;
          try {
            updated.vendorCommissionBreakdown = JSON.stringify(vendorCommissionBreakdown);
          } catch (e) { /* ignore */ }

          updated.bed = bed || updated.bed;
          updated.bedrooms = bedrooms || updated.bedrooms;
          updated.amenities = amenities || updated.amenities;
          updated.policies = policies || updated.policies;
          updated.country = country || updated.country;
          updated.state = state || updated.state;
          updated.city = city || updated.city;

          updated.isSubscription = isSubscription || updated.isSubscription;
          updated.bookingMode = bookingMode || updated.bookingMode;
          updated.allowMultiple = allowMultiple || updated.allowMultiple;
          updated.maxCapacity = maxCapacity || updated.maxCapacity;
          updated.sessionDuration = sessionDuration || updated.sessionDuration;
          updated.sessionGap = sessionGap || updated.sessionGap;
          updated.servicingDay = Array.isArray(servicingDay) ? servicingDay : updated.servicingDay;
          updated.openingHour = openingHour || updated.openingHour;
          updated.closingHour = closingHour || updated.closingHour;
        })
      );

      // refresh uploadPost
      const refreshed = await DataStore.query(Post, cloudDraftId);
      if (refreshed) setUploadPost(refreshed);
    } catch (e) {
      console.warn("syncDraftToCloud failed:", e);
    }
  };

  // ---------- Save local draft directly (fallback if provider helper not present) ----------
  const saveLocalDraftDirect = () => {
    try {
      const draftObj = {
        propertyType,
        type,
        nameOfType,
        packageType,
        capacity,
        eventName,
        eventDateTime,
        eventEndDateTime,
        recurrence,
        eventFrequency,
        dressCode,
        availableDocs,
        accommodationParts,
        media,
        fullAddress,
        generalLocation,
        lat,
        lng,
        bedrooms,
        bed,
        cautionFee,
        inspectionFee,
        otherFeesName,
        otherFeesName2,
        otherFeesPrice,
        otherFeesPrice2,
        price,
        totalPrice,
        vendorCommissionAmount,
        vendorCommissionBreakdown,
        timeFrame,
        country,
        state,
        city,
        isSubscription,
        bookingMode,
        allowMultiple,
        maxCapacity,
        sessionDuration,
        sessionGap,
        servicingDay,
        openingHour,
        closingHour,
        description,
        amenities,
        policies,
        options,
      };
      localStorage.setItem(UPLOAD_DRAFT_KEY, JSON.stringify(draftObj));
    } catch (e) {
      console.warn("saveLocalDraftDirect failed", e);
    }
  };

  // ---------- Load initial draft (local first, then cloud) ----------
  useEffect(() => {
    isMountedRef.current = true;

    (async () => {
      try {
        // 1) load local draft into context (provider helper if available)
        if (typeof loadDraftFromLocal === "function") {
          loadDraftFromLocal();
        } else {
          const raw = localStorage.getItem(UPLOAD_DRAFT_KEY);
          if (raw) {
            const d = JSON.parse(raw);
            if (d) loadExistingPost ? loadExistingPost(d) : null;
          }
        }

        // 2) create or load cloud draft
        await createCloudDraftIfNotExists();
      } catch (e) {
        console.warn("init draft error", e);
      } finally {
        setLoadingDraft(false);
      }
    })();

    return () => {
      isMountedRef.current = false;
      if (draftSyncTimer.current) clearTimeout(draftSyncTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- watch core fields, save local instantly and schedule cloud sync ----------
  useEffect(() => {
    if (loadingDraft) return;

    // Prefer provider helper
    if (typeof saveDraftToLocal === "function") {
      saveDraftToLocal();
    } else {
      saveLocalDraftDirect();
    }

    // Debounce cloud sync
    if (draftSyncTimer.current) clearTimeout(draftSyncTimer.current);
    draftSyncTimer.current = setTimeout(() => {
      // call cloud sync (fire and forget)
      syncDraftToCloud();
    }, 1200);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    propertyType,
    type,
    packageType,
    nameOfType,
    description,
    media,
    fullAddress,
    generalLocation,
    lat,
    lng,
    price,
    totalPrice,
    country,
    state,
    city,
    options,
    bookingMode,
    isSubscription,
    openingHour,
    closingHour,
    sessionDuration,
    sessionGap,
    allowMultiple,
    maxCapacity,
    servicingDay,
    eventName,
    eventDateTime,
    eventEndDateTime,
    eventFrequency,
    capacity,
  ]);

  // ---------- Upload media incremental (updates cloud draft after each success) ----------
  const uploadMediaIncremental = async () => {
    try {
      const uploadedKeys = [];

      for (let i = 0; i < media.length; i++) {
        const item = media[i];
        const isLocal = item?.uri?.startsWith("blob:") || item?.uri?.startsWith("file:");
        const isRemote = item?.uri?.startsWith("https://");

        if (isRemote) {
          const key = item.key || extractKeyFromUrl(item.uri);
          uploadedKeys.push(key);
          // update cloud draft
          await appendMediaToCloudDraft(uploadedKeys);
          setUploadProgress(Math.round(((i + 1) / media.length) * 100));
          continue;
        }

        // fetch blob and compress where needed
        const response = await fetch(item.uri);
        const fileBlob = await response.blob();

        let compressedBlob = fileBlob;
        if (isLocal && item.type && item.type.startsWith("image")) {
          compressedBlob = await compressImage(fileBlob, item.name || `img-${Date.now()}.jpg`);
        }

        const fileExtension = item.type && item.type.startsWith("image") ? "jpg" : "mp4";
        const fileKey = `public/media/${sub}/${crypto.randomUUID()}.${fileExtension}`;

        const result = await uploadData({
          path: fileKey,
          data: compressedBlob,
          options: {
            contentType: item.type || (fileExtension === "jpg" ? "image/jpeg" : "video/mp4"),
          },
        }).result;

        uploadedKeys.push(result.path);

        // update context media so UI reflects uploaded url
        setMedia((prev) =>
          prev.map((m, idx) => (idx === i ? { ...m, uri: result.path, key: result.path } : m))
        );

        // update cloud draft after each file
        await appendMediaToCloudDraft(uploadedKeys);

        setUploadProgress(Math.round(((i + 1) / media.length) * 100));
      }

      return uploadedKeys;
    } catch (e) {
      console.error("Error uploading files:", e);
      alert("Failed to upload media.");
      return [];
    }
  };

  // ---------- append media helper ----------
  const appendMediaToCloudDraft = async (mediaKeys) => {
    if (!cloudDraftId) return;
    try {
      const original = await DataStore.query(Post, cloudDraftId);
      if (!original) return;
      await DataStore.save(
        Post.copyOf(original, (updated) => {
          updated.media = mediaKeys;
        })
      );
      const refreshed = await DataStore.query(Post, cloudDraftId);
      if (refreshed) setUploadPost(refreshed);
    } catch (e) {
      console.warn("appendMediaToCloudDraft failed", e);
    }
  };

  // ---------- Main upload/publish handler (uses your existing logic, with cloud draft integration) ----------
  const handleUpload = async () => {
    if (uploading) return;
    setUploading(true);

    if (!onValidateUpload()) {
      setUploading(false);
      return;
    }

    let tempPost = uploadPost;

    try {
      // ensure cloud draft exists
      if (!tempPost || !tempPost.id) {
        tempPost = await createCloudDraftIfNotExists();
      }

      // mark draft as UPLOADING on cloud
      if (tempPost?.id) {
        const original = await DataStore.query(Post, tempPost.id);
        if (original) {
          await DataStore.save(
            Post.copyOf(original, (d) => {
              d.uploadStatus = "UPLOADING";
              d.uploadErrorMessage = null;
            })
          );
        }
      }

      // upload media incrementally (updates cloud after each file)
      const mediaUrls = await uploadMediaIncremental();
      if (media.length > 0 && mediaUrls.length === 0) {
        throw new Error("Media upload failed");
      }

      // Finalize post with full content
      const finalPostSource = await DataStore.query(Post, tempPost.id);
      const fullPost = await DataStore.save(
        Post.copyOf(finalPostSource, (updated) => {
          updated.propertyType = propertyType;
          updated.type = type;
          updated.packageType = packageType;
          updated.nameOfType = nameOfType;
          updated.availableDocs = availableDocs;
          updated.accommodationParts = accommodationParts;
          updated.media = mediaUrls.length ? mediaUrls : updated.media || [];
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
          updated.lat = lat ? parseFloat(lat) : updated.lat;
          updated.lng = lng ? parseFloat(lng) : updated.lng;

          updated.timeFrame = timeFrame;
          updated.inspectionFee = inspectionFee ? parseFloat(inspectionFee) : updated.inspectionFee;
          updated.cautionFee = cautionFee ? parseFloat(cautionFee) : updated.cautionFee;
          updated.otherFeesName = otherFeesName;
          updated.otherFeesPrice = otherFeesPrice ? parseFloat(otherFeesPrice) : updated.otherFeesPrice;
          updated.otherFeesName2 = otherFeesName2;
          updated.otherFeesPrice2 = otherFeesPrice2 ? parseFloat(otherFeesPrice2) : updated.otherFeesPrice2;
          updated.price = price ? parseFloat(price) : updated.price;
          updated.totalPrice = totalPrice ? parseFloat(totalPrice) : updated.totalPrice;

          updated.vendorCommissionAmount = vendorCommissionAmount ? parseFloat(vendorCommissionAmount) : updated.vendorCommissionAmount;
          try {
            updated.vendorCommissionBreakdown = JSON.stringify(vendorCommissionBreakdown);
          } catch (e) {}

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
          updated.servicingDay = Array.isArray(servicingDay) ? servicingDay : updated.servicingDay;
          updated.openingHour = openingHour;
          updated.closingHour = closingHour;

          updated.uploadStatus = "COMPLETED";
          updated.uploadErrorMessage = null;
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

      // Clear local/coud draft now that it's published
      try {
        localStorage.removeItem(UPLOAD_DRAFT_KEY);
        localStorage.removeItem(UPLOAD_DRAFT_ID_KEY);
      } catch (e) { /* ignore */ }

      alert("Post uploaded successfully!");

      resetFormFields();
      navigate("/realtorcontent/upload");
      setTimeout(() => navigate("/realtorcontent/home"), 500);
    } catch (e) {
      console.error("Upload error:", e);

      // mark failed on cloud draft if exists
      try {
        const id = (uploadPost && uploadPost.id) || cloudDraftId || localStorage.getItem(UPLOAD_DRAFT_ID_KEY);
        if (id) {
          const original = await DataStore.query(Post, id);
          if (original) {
            await DataStore.save(
              Post.copyOf(original, (updated) => {
                updated.uploadStatus = "FAILED";
                updated.uploadErrorMessage = e.message;
              })
            );
          }
        }
      } catch (saveErr) {
        console.warn("Failed to mark draft failed", saveErr);
      }

      alert(`Error: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  // ---------- Discard draft (delete cloud + local) ----------
  const discardDraft = async () => {
    const ok = window.confirm("Discard this draft and delete everything?");
    if (!ok) return;

    try {
      const id = cloudDraftId || localStorage.getItem(UPLOAD_DRAFT_ID_KEY);
      if (id) {
        // delete cloud post
        await DataStore.delete(Post, id);
      }
    } catch (e) {
      console.warn("Failed to delete cloud draft", e);
    } finally {
      // clear local
      try {
        localStorage.removeItem(UPLOAD_DRAFT_KEY);
        localStorage.removeItem(UPLOAD_DRAFT_ID_KEY);
      } catch (e) { /* ignore */ }

      if (typeof clearLocalDraft === "function") clearLocalDraft();
      resetFormFields();
      navigate("/realtorcontent/upload");
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

        {/* Discard Draft */}
        <button className="btnUpload" onClick={discardDraft} style={{ backgroundColor: "#bbb" }}>
          <p className="uploadTxt">Discard Draft</p>
        </button>
      </div>
    </div>
  );
};

export default UploadProperty;