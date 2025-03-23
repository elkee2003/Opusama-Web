import React,{useState, createContext, useContext} from 'react'

const UploadContext = createContext({})

const UploadContextProvider = ({children}) => {

    const [propertyType, setPropertyType]= useState('')
    const [type, setType] = useState('')
    const [nameOfType, setNameOfType] = useState('');
    const [packageType, setPackageType] = useState('');
    const [availableDocs, setAvailableDocs] = useState('');
    const [customInput, setCustomInput] = useState('');
    const [accommodationParts, setAccommodationParts] = useState('');
    const [media, setMedia] = useState([]);
    const [description, setDescription] = useState('');
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
    const [price, setPrice] = useState('');
    const [totalPrice, setTotalPrice] = useState('');
    const [timeFrame, setTimeFrame] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState]= useState('');
    const [city, setCity] = useState('');
    const [amenities, setAmenities]= useState('');
    const [policies, setPolicies] = useState('');
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
        if (!price) {
          setErrors('Price is Required');
          return false;
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

        // Specific validations for each property type
        if (propertyType === 'House Rent') {
          if (!bedrooms) {
            setErrors('Number of Bedrooms is Required');
            return false;
          }
          if(!timeFrame){
            setErrors('Time frame is required');
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
            setErrors('Time frame is required');
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
            setErrors('Time frame is required');
            return false;
          }
        } else if (propertyType === 'Office Space') {
          if(!timeFrame){
            setErrors('Time frame is required');
            return false;
          }
        }

        // Price validations
        if (isNaN(parseFloat(price))) {
          setErrors('Price must be a number');
          return false;
        }

        if (isNaN(parseFloat(totalPrice))) {
          setErrors('Total Price must be a number');
          return false;
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
      if(!price){
        alert('Cannot upload empty fields');
        return false;
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

  return (
    <UploadContext.Provider value={{
        propertyType, setPropertyType,
        type, setType,
        nameOfType, setNameOfType,
        packageType, setPackageType,
        availableDocs, setAvailableDocs,
        customInput, setCustomInput,
        accommodationParts, setAccommodationParts,
        media, setMedia,
        description, setDescription,
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
        timeFrame, setTimeFrame,
        country, setCountry,
        state, setState,
        city, setCity,
        errors, setErrors,
        amenities, setAmenities,
        policies, setPolicies,
        uploadPost, setUploadPost,
        onValidate, onValidateUpload,
        removeMedia, addMedia, updateMedia
    }}>
      {children}
    </UploadContext.Provider>
  )
}

export default UploadContextProvider

export const useUploadContext = () => useContext(UploadContext)