import React, { useState, useEffect, useRef } from 'react';
import './Form.css';
import { FaArrowRight } from "react-icons/fa";
import { useUploadContext } from '../../../../../../../Providers/RealtorProvider/UploadProvider';
import { useNavigate } from 'react-router-dom';
import { GOOGLE_API_KEY } from '../../../../../../../keys';
import { GoogleMap, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';

const libraries = ["places"]; // Declare libraries outside the component to maintain consistency.

const GooglePlacesAutoCompleteCom = () => {
  const autocompleteRef = useRef(null);

  // Load the Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries, // Use the consistent libraries array
  });

  const [isFocused, setIsFocused] = useState(false);
  const { address, setAddress, setLat, setLng } = useUploadContext();
  const navigate = useNavigate();

  const handleOnPlacesChanged = () => {
    if (autocompleteRef.current) {
      const places = autocompleteRef.current.getPlaces();
      if (places?.length > 0) {
        const place = places[0];
        const selectedAddress = place.formatted_address;
        const selectedLat = place.geometry.location.lat();
        const selectedLng = place.geometry.location.lng();

        console.log('Selected address:', selectedAddress);
        console.log('Latitude:', selectedLat, 'Longitude:', selectedLng);

        setAddress(selectedAddress);
        setLat(selectedLat);
        setLng(selectedLng);
      }
    }
  };

  const navigateToNxtPage = () =>{
    if (address) {
      navigate('/realtorcontent/form');
    }else{
      alert('Select an address to access the next page')
    }
  }

  // useEffect(() => {
  //   if (address) {
  //     navigate('/realtorcontent/form');
  //   }
  // }, [address, navigate]);

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