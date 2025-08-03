import React, { useState, useEffect, useRef } from 'react';
import './Form.css';
import { FaArrowRight } from "react-icons/fa";
import { useUploadContext } from '../../../../../../../Providers/RealtorProvider/UploadProvider';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';

const libraries = ["places"]; // Declare libraries outside the component to maintain consistency.

const GooglePlacesAutoCompleteCom = () => {
  const autocompleteRef = useRef(null);

  const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  // Load the Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleApiKey,
    libraries, // Use the consistent libraries array
  });

  const [isFocused, setIsFocused] = useState(false);
  const { fullAddress, setFullAddress, generalLocation, setGeneralLocation, setLat, setLng } = useUploadContext();
  const navigate = useNavigate();

  const handleOnPlacesChanged = () => {
    if (autocompleteRef.current) {
      const places = autocompleteRef.current.getPlaces();
      if (places?.length > 0) {
        const place = places[0];

        const selectedFullAddress = place?.formatted_address
        // `${place?.name}, ${place?.formatted_address}`;
        const selectedLat = place.geometry.location.lat();
        const selectedLng = place.geometry.location.lng();

        let city = "";
        let area = "";

        place.address_components.forEach((component) => {
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

        console.log('full address:', fullAddress)
        console.log('gen Addy:', generalLocation);

        // Store in context
        setFullAddress(selectedFullAddress);
        setGeneralLocation(`${area}, ${city}`);
        setLat(selectedLat);
        setLng(selectedLng);
      }
    }
  };

  const navigateToNxtPage = () =>{
    if (fullAddress) {
      navigate('/realtorcontent/form');
    }else{
      alert('Select an address to access the next page')
    }
  }

  // useEffect(() => {
  //   if (address) {
  //     navigate('/realtorcontent/form');
  //   }
  // }, [fullAddress, navigate]);

  return (
    <div className="formContainer">
      <p className="formHeader">Select Address</p>

      {/* Google Places Autocomplete */}
      <div className="autocompleteContainer">
        {isLoaded && (
          <StandaloneSearchBox
            onLoad={(ref) => (autocompleteRef.current = ref)}
            onPlacesChanged={handleOnPlacesChanged}
            options={{
              componentRestrictions: { country: ["ng", "gh","us"] },
            }}
          >
            <input
              type="text"
              placeholder="Search Address"
              className="inputAutoComplete"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </StandaloneSearchBox>
        )}
      </div>

      <button
        onClick={navigateToNxtPage}
        className='nxtPageNavCon'
      >
        <FaArrowRight className='nxtPageNavTxt' />
      </button>
    </div>
  );
};

export default GooglePlacesAutoCompleteCom;