import React, { useState, useRef } from 'react';
import { FaArrowRight } from "react-icons/fa";
import { useAuthContext } from '../../../../../../../../../../Providers/ClientProvider/AuthProvider';
import { useUploadContext } from '../../../../../../../../../../Providers/RealtorProvider/UploadProvider';

import { useNavigate } from 'react-router-dom';
import { Autocomplete } from '@react-google-maps/api';

const GooglePlacesAutoCompleteCom = () => {
  const autocompleteRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);
  const { authUser } = useAuthContext();
  const { 
    fullAddress, 
    setFullAddress, 
    generalLocation, 
    setGeneralLocation, 
    setLat, 
    setLng,
    media,
  } = useUploadContext();
  
  const navigate = useNavigate();

  const handleOnPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (!place?.geometry) return;

      const selectedFullAddress = place.formatted_address;
      const selectedLat = place.geometry.location.lat();
      const selectedLng = place.geometry.location.lng();

      let city = "";
      let area = "";

      place.address_components?.forEach((component) => {
        if (component.types.includes("locality")) {
          city = component.long_name; // City
        }
        if (
          component.types.includes("sublocality") ||
          component.types.includes("sublocality_level_1") ||
          component.types.includes("neighborhood")
        ) {
          area = component.long_name; // Area / Neighborhood
        }
      });

      // Debug logs
      console.log('full address:', fullAddress);
      console.log('gen Addy:', generalLocation);

      // Store in context
      setFullAddress(selectedFullAddress);
      setGeneralLocation(`${area}, ${city}`);
      setLat(selectedLat);
      setLng(selectedLng);
    }
  };

  const navigateToNxtPage = () => {
    if (!authUser) {
      alert('Sign In to access');
      navigate('/?section=signin');
      return;
    }

    if (fullAddress) {
      navigate('/admin/vendor_upload_form');
    } else {
      alert('Select an address to access the next page');
    }
  };

  return (
    <div className="formUploadCon">
      <p className="formHeader">Select Address</p>

      {/* Google Places Autocomplete */}
      <div className="autocompleteContainer">
        <Autocomplete
          onLoad={(ref) => (autocompleteRef.current = ref)}
          onPlaceChanged={handleOnPlaceChanged}
          options={{
            componentRestrictions: { country: ["ng", "gh", "us"] },
          }}
        >
          <input
            type="text"
            placeholder="Search Address"
            className="inputAutoComplete"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </Autocomplete>
      </div>

      <button
        onClick={navigateToNxtPage}
        className="nxtPageNavCon"
      >
        {authUser ? (
          <FaArrowRight className="nxtPageNavTxt" />
        ) : (
          <p className="signInAuthBtnTxt">Sign In</p>
        )}
      </button>
    </div>
  );
};

export default GooglePlacesAutoCompleteCom;