import React,{useState, useEffect,  createContext, useContext} from 'react'

const UploadContext = createContext({});

const UPLOAD_DRAFT_KEY = "uploadDraft";
const UPLOAD_DRAFT_ID_KEY = "uploadDraftPostId";

const UploadContextProvider = ({children}) => {

    const [propertyType, setPropertyType]= useState('')
    const [type, setType] = useState('')
    const [nameOfType, setNameOfType] = useState('');
    const [packageType, setPackageType] = useState('');
    const [capacity, setCapacity] = useState(''); //Event hall capacity to hold event
    const [eventName, setEventName] = useState("");
    const [eventDateTime, setEventDateTime] = useState('');
    const [eventEndDateTime, setEventEndDateTime] = useState('');
    const [ recurrence, setRecurrence ] = useState('');
    const [eventFrequency, setEventFrequency ] = useState('');
    const [dressCode, setDressCode] = useState('');
    const [availableDocs, setAvailableDocs] = useState('');
    const [customInput, setCustomInput] = useState('');
    const [accommodationParts, setAccommodationParts] = useState('');
    const [media, setMedia] = useState([]);
    const [fullAddress, setFullAddress] = useState('');
    const [generalLocation, setGeneralLocation] = useState('');
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [bedrooms, setBedrooms] = useState('');
    const [bed, setBed] = useState('');
    const [cautionFee, setCautionFee] = useState('');
    const [inspectionFee, setInspectionFee]= useState('');
    const [otherFeesName, setOtherFeesName] = useState('');
    const [otherFeesName2, setOtherFeesName2] = useState('');
    const [otherFeesPrice, setOtherFeesPrice] = useState('');
    const [otherFeesPrice2, setOtherFeesPrice2] = useState('');
    const [price, setPrice] = useState(null);
    const [totalPrice, setTotalPrice] = useState('');
    const [vendorCommissionAmount, setVendorCommissionAmount] = useState(0);
    const [vendorCommissionBreakdown, setVendorCommissionBreakdown] = useState({
      price: 0,
      // cautionFee:0,
      inspection: 0,
      other1: 0,
      other2: 0,
      total: 0,
    })
    const [timeFrame, setTimeFrame] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState]= useState('');
    const [city, setCity] = useState('');
    const [isSubscription, setIsSubscription] = useState(false);
    const [bookingMode, setBookingMode] = useState("manual");
    const [allowMultiple, setAllowMultiple] = useState(false);
    const [maxCapacity, setMaxCapacity] = useState(null); //tickets 
    const [sessionDuration, setSessionDuration] = useState(null); 
    const [sessionGap, setSessionGap] = useState(null); 
    const [servicingDay, 
    setServicingDay] = useState([]);
    const [openingHour, setOpeningHour] = useState(null);
    const [closingHour, setClosingHour] = useState(null); 
    const [description, setDescription] = useState('');
    const [amenities, setAmenities]= useState('');
    const [policies, setPolicies] = useState('');
    const [options, setOptions] = useState([]);

    const [uploadPost, setUploadPost] = useState(null);

    const [errors, setErrors] = useState('');

    // Validation of Inputs
    const validateInput = ()=>{
        setErrors('')

        // Common fields validation
        if (!propertyType) {
          setErrors('Property Type is Required');
          return false;
        }
        if (!type) {
          setErrors('Field under Property Type is Required');
          return false;
        }

         // ✅ Specific validation for Food & Drinks
        if (propertyType === 'Food & Drinks') {
          if (!options.length) {
            setErrors('At least one booking option is required');
            return false;
          }
          const hasInvalidOption = options.some(opt => !opt.optionPrice || isNaN(opt.optionPrice));
          if (hasInvalidOption) {
            setErrors('Each option must have a valid price');
            return false;
          }
        }
        
        // If options exist, skip the price check
        if (!options.length) {
          if (price === '' || price === null || price === undefined || isNaN(price)) {
            setErrors('Price is required');
            return false;
          }
        }
        
        if (!totalPrice) {
          setErrors('Total Price is Required');
          return false;
        }
        if (!country) {
          setErrors('Country is Required');
          return false;
        }
        if (!state) {
          setErrors('State is Required');
          return false;
        }
        if (!fullAddress) {
          setErrors('Address is Required');
          return false;
        }
        if (!description) {
          setErrors('Description is Required');
          return false;
        }
        if (!amenities) {
          setErrors('Amenities are Required');
          return false;
        }
        if (!policies) {
          setErrors('Policies are Required');
          return false;
        }

        if (bookingMode === "auto_datetime" && !sessionDuration) {
          setErrors("Session Duration is required if booking requires date & time");
          return false;
        }

        // Session-based validation
        if (sessionDuration) {
          if (!openingHour || !closingHour) {
            setErrors('Opening and Closing Hours are required when Session Duration is set');
            return false;
          }
        }

        // Subscription validation
        // if (isSubscription && !timeFrame) {
        //   setErrors('Charge Per is required');
        //   return false;
        // }

        // Specific validations for each property type
        if (propertyType === 'House Rent') {
          if (!bedrooms) {
            setErrors('Number of Bedrooms is Required');
            return false;
          }
          if(!timeFrame){
            setErrors('Charge Per is required');
            return false;
          }
        } else if (propertyType === 'Hotel / Shortlet') {
          if (!bedrooms) {
            setErrors('Number of Bedrooms is Required');
            return false;
          }
          if (!bed) {
            setErrors('Number of Beds is Required');
            return false;
          }
          if(!timeFrame){
            setErrors('Charge Per is required');
            return false;
          }
        } else if (propertyType === 'House Sale') {
          if (!availableDocs) {
            setErrors('Available Documents are Required');
            return false;
          }
          if (!bedrooms) {
            setErrors('Number of Bedrooms is Required');
            return false;
          }
        } else if (propertyType === 'Land Sale') {
          if (!availableDocs) {
            setErrors('Available Documents are Required');
            return false;
          }
        } else if (propertyType === 'Student Accommodation') {
          if (!accommodationParts) {
            setErrors('Accommodation Parts are Required');
            return false;
          }
          if(!timeFrame){
            setErrors('Charge Per is required');
            return false;
          }
        } else if (propertyType === 'Office Space') {
          if(!timeFrame){
            setErrors('Charge Per is required');
            return false;
          }
        } else if (propertyType === 'Venue') {
          if(!capacity){
            setErrors('Capacity is required');
            return false;
          }
        }else if (propertyType === 'Event') {
          if(!eventName){
            setErrors('Event Name is required');
            return false;
          }
          if(!eventFrequency){
            setErrors('Event Frequency is required');
            return false;
          }
          if(eventFrequency === 'one-time' && !eventDateTime){
            setErrors('Event Start Date is required');
            return false;
          }
          if(eventFrequency === 'multi-day' && (!eventDateTime || !eventEndDateTime) ){
            setErrors('Event Start Date and End Date is required');
            return false;
          }
          if (eventFrequency === 'recurring' && (!servicingDay || !openingHour)) {
            setErrors('Recurring events require a day and an opening hour');
            return false;
          }
          // if(!eventDateTime){
          //   setErrors('Event Date & Time required');
          //   return false;
          // }
        }

        // Price validations
        if (!options.length) {
          if (isNaN(parseFloat(price))) {
            setErrors('Price must be a number');
            return false;
          }
        }
        
        if (!options.length) {
          if (isNaN(parseFloat(totalPrice))) {
            setErrors('Total Price must be a number');
            return false;
          }
        }
        
        return true;
    };


    // Function to remove media by index
    const removeMedia = (index) => {
      setMedia((prevMedia) => prevMedia.filter((_, idx) => idx !== index));
    };

    // Function for trimmed video (new media)
    const addMedia = (newMedia) => {
      setMedia([...media, newMedia]);
    };

     // Update existing media
    const updateMedia = (index, newMedia) => {
      setMedia((prevMedia) =>
        prevMedia.map((item, i) => (i === index ? newMedia : item))
      );
    };

    const onValidate = ()=>{
        if (validateInput()) {
          return true;
        }else{
          return false;
        }
    }

    const validateUpload = () =>{
      if(!propertyType){
        alert('Cannot upload empty fields');
        return false;
      }
      if(!type){
        alert('Cannot upload empty fields');
        return false;
      }
      if(!media){
        alert('Cannot upload empty fields');
        return false;
      }
      if(!description){
        alert('Cannot upload empty fields');
        return false;
      }
      if(!fullAddress){
        alert('Cannot upload empty fields');
        return false;
      }
      if (!options.length) {
        if (price === null || price === undefined || price === '' || isNaN(price)) {
          alert('Price is required');
          return false;
        }
      }
      
      if(!country){
        alert('Cannot upload empty fields');
        return false;
      }
      if(!state){
        alert('Cannot upload empty fields');
        return false;
      }
      return true;
    }

    const onValidateUpload = () =>{
      if (validateUpload()){
        return true;
      }else{
        return false;
      }
    }

    // helper: construct a minimal draft object from current state
    const _buildDraftObject = () => {
      return {
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
        customInput,
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
    };

    // --- Local draft helpers (exposed) ---
    const saveDraftToLocal = () => {
      try {
        const draft = _buildDraftObject();
        localStorage.setItem(UPLOAD_DRAFT_KEY, JSON.stringify(draft));
      } catch (e) {
        console.warn("Failed to save local draft", e);
      }
    };

    const loadDraftFromLocal = () => {
      try {
        const raw = localStorage.getItem(UPLOAD_DRAFT_KEY);
        if (!raw) return null;
        const draft = JSON.parse(raw);
        // apply fields to context using your existing setter pattern
        setPropertyType(draft.propertyType || "");
        setType(draft.type || "");
        setNameOfType(draft.nameOfType || "");
        setPackageType(draft.packageType || "");
        setCapacity(draft.capacity || "");
        setEventName(draft.eventName || "");
        setEventDateTime(draft.eventDateTime || "");
        setEventEndDateTime(draft.eventEndDateTime || "");
        setRecurrence(draft.recurrence || "");
        setEventFrequency(draft.eventFrequency || "");
        setDressCode(draft.dressCode || "");
        setAvailableDocs(draft.availableDocs || "");
        setCustomInput(draft.customInput || "");
        setAccommodationParts(draft.accommodationParts || "");
        setMedia(draft.media || []);
        setFullAddress(draft.fullAddress || "");
        setGeneralLocation(draft.generalLocation || "");
        setLat(draft.lat || 0);
        setLng(draft.lng || 0);
        setBedrooms(draft.bedrooms || "");
        setBed(draft.bed || "");
        setCautionFee(draft.cautionFee || "");
        setInspectionFee(draft.inspectionFee || "");
        setOtherFeesName(draft.otherFeesName || "");
        setOtherFeesName2(draft.otherFeesName2 || "");
        setOtherFeesPrice(draft.otherFeesPrice || "");
        setOtherFeesPrice2(draft.otherFeesPrice2 || "");
        setPrice(draft.price || null);
        setTotalPrice(draft.totalPrice || "");
        setVendorCommissionAmount(draft.vendorCommissionAmount || 0);
        setVendorCommissionBreakdown(draft.vendorCommissionBreakdown || {
          price: 0,
          inspection: 0,
          other1: 0,
          other2: 0,
          total: 0,
        });
        setTimeFrame(draft.timeFrame || "");
        setCountry(draft.country || "");
        setState(draft.state || "");
        setCity(draft.city || "");
        setIsSubscription(draft.isSubscription || false);
        setBookingMode(draft.bookingMode || "manual");
        setAllowMultiple(draft.allowMultiple || false);
        setMaxCapacity(draft.maxCapacity || null);
        setSessionDuration(draft.sessionDuration || null);
        setSessionGap(draft.sessionGap || null);
        setServicingDay(draft.servicingDay || []);
        setOpeningHour(draft.openingHour || null);
        setClosingHour(draft.closingHour || null);
        setDescription(draft.description || "");
        setAmenities(draft.amenities || "");
        setPolicies(draft.policies || "");
        setOptions(draft.options || []);
        return draft;
      } catch (e) {
        console.warn("Failed to load local draft", e);
        return null;
      }
    };

    const clearLocalDraft = () => {
      try {
        localStorage.removeItem(UPLOAD_DRAFT_KEY);
        localStorage.removeItem(UPLOAD_DRAFT_ID_KEY);
      } catch (e) {
        console.warn("Failed to clear local draft", e);
      }
    };

    // Helper function to load existing post for edit
    const loadExistingPost = (post) => {
      setPropertyType(post.propertyType || '');
      setType(post.type || '');
      setNameOfType(post.nameOfType || '');
      setPackageType(post.packageType || '');
      setCapacity(post.capacity || '');
      setEventName(post.eventName || '');
      setEventDateTime(post.eventDateTime || '');
      setEventEndDateTime(post.eventEndDateTime || '');
      setRecurrence(post.recurrence || '');
      setEventFrequency(post.eventFrequency || '');
      setDressCode(post.dressCode || '');
      setAvailableDocs(post.availableDocs || '');
      setCustomInput(post.customInput || '');
      setAccommodationParts(post.accommodationParts || '');

      setMedia(
        post.media?.map(key => ({
          key,
          type: key.endsWith(".mp4") ? "video" : "image"
        })) || []
      );

      setFullAddress(post.fullAddress || '');
      setGeneralLocation(post.generalLocation || '');
      setLat(post.lat || 0);
      setLng(post.lng || 0);
      setBedrooms(post.bedrooms || '');
      setBed(post.bed || '');
      setCautionFee(post.cautionFee || '');
      setInspectionFee(post.inspectionFee || '');
      setOtherFeesName(post.otherFeesName || '');
      setOtherFeesName2(post.otherFeesName2 || '');
      setOtherFeesPrice(post.otherFeesPrice || '');
      setOtherFeesPrice2(post.otherFeesPrice2 || '');
      setPrice(post.price || '');
      setTotalPrice(post.totalPrice || '');
      setTimeFrame(post.timeFrame || '');
      setCountry(post.country || '');
      setState(post.state || '');
      setCity(post.city || '');
      setIsSubscription(post.isSubscription || false);
      setBookingMode(post.bookingMode || "manual");
      setAllowMultiple(post.allowMultiple || false);
      setMaxCapacity(post.maxCapacity || null);
      setSessionDuration(post.sessionDuration || null);
      setSessionGap(post.sessionGap || null);
      setServicingDay(post.servicingDay ? [...post.servicingDay] : []);
      setOpeningHour(post.openingHour || null);
      setClosingHour(post.closingHour || null);
      setDescription(post.description || '');
      setAmenities(post.amenities || '');
      setPolicies(post.policies || '');
      setOptions(
        post.BookingPostOptions
          ? post.BookingPostOptions.map(opt => ({
              id: opt.id,
              bookingPostOptionType: opt.bookingPostOptionType || "", 
              bookingName: opt.bookingName || "",
              optionPrice: opt.optionPrice || 0,
              minSpend: opt.minTime || null,   // match your UI’s field
            }))
          : []
      );
      
      setUploadPost(post); // store the original for updating later
    };


    // useEffect for commission etc
    useEffect(() => {
      const priceVal = parseFloat(price || 0);
      // const cautionVal = parseFloat(cautionFee || 0);
      const inspectionVal = parseFloat(inspectionFee || 0);
      const otherVal1 = parseFloat(otherFeesPrice || 0);
      const otherVal2 = parseFloat(otherFeesPrice2 || 0);

      const isPropType = propertyType === 'House Rent' || propertyType === 'House Sale' || propertyType === 'Land Sale' || propertyType === 'Student Accommodation' || propertyType === 'Office Space' || propertyType === 'Commercial Space';

      const priceCommission = isPropType ? 0 : priceVal * 0.1;
      // const cautionCommission = isSaleType ? 0 : cautionVal * 0.1;
      const inspectionCommission = inspectionVal * 0.1;
      const otherCommission1 = isPropType ? 0 : otherVal1 * 0.1;
      const otherCommission2 = isPropType ? 0 : otherVal2 * 0.1;

      // cautionCommission  not added
      const total = priceCommission + inspectionCommission + otherCommission1 + otherCommission2;

      setVendorCommissionBreakdown({
        price: parseFloat(priceCommission.toFixed(2)),
        inspection: parseFloat(inspectionCommission.toFixed(2)),
        other1: parseFloat(otherCommission1.toFixed(2)),
        other2: parseFloat(otherCommission2.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      });

      setVendorCommissionAmount(parseFloat(total.toFixed(2)));
    }, [price, inspectionFee, otherFeesPrice, otherFeesPrice2, propertyType]);

  return (
    <UploadContext.Provider value={{
        propertyType, setPropertyType,
        type, setType,
        nameOfType, setNameOfType,
        packageType, setPackageType,
        capacity, setCapacity,
        eventName, setEventName,
        eventDateTime, setEventDateTime,
        eventEndDateTime, setEventEndDateTime,
        recurrence, setRecurrence,
        eventFrequency, setEventFrequency,
        dressCode, setDressCode,
        availableDocs, setAvailableDocs,
        customInput, setCustomInput,
        accommodationParts, setAccommodationParts,
        media, setMedia,
        fullAddress, setFullAddress,
        generalLocation, setGeneralLocation,
        lat, setLat, lng, setLng,
        bedrooms, setBedrooms,
        bed, setBed,
        cautionFee, setCautionFee,
        inspectionFee, setInspectionFee,
        otherFeesName, setOtherFeesName,
        otherFeesName2, setOtherFeesName2,
        otherFeesPrice, setOtherFeesPrice,
        otherFeesPrice2, setOtherFeesPrice2,
        price, setPrice,
        totalPrice, setTotalPrice,
        vendorCommissionAmount, setVendorCommissionAmount,
        vendorCommissionBreakdown, setVendorCommissionBreakdown,
        timeFrame, setTimeFrame,
        country, setCountry,
        state, setState,
        city, setCity,
        errors, setErrors,
        isSubscription, setIsSubscription,
        bookingMode, setBookingMode,
        allowMultiple, setAllowMultiple,
        maxCapacity, setMaxCapacity,
        sessionDuration, setSessionDuration,
        sessionGap, setSessionGap,
        servicingDay, setServicingDay,
        openingHour, setOpeningHour,
        closingHour, setClosingHour,
        description, setDescription,
        amenities, setAmenities,
        policies, setPolicies,
        options, setOptions,
        uploadPost, setUploadPost,
        onValidate, onValidateUpload,
        removeMedia, addMedia, updateMedia, loadExistingPost, 
        // new helpers:
        saveDraftToLocal,
        loadDraftFromLocal,
        clearLocalDraft,
    }}>
      {children}
    </UploadContext.Provider>
  )
}

export default UploadContextProvider

export const useUploadContext = () => useContext(UploadContext)