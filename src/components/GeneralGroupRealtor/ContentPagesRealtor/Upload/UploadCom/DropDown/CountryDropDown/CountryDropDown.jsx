import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { COUNTRY_STATE_CITY_KEY } from '../../../../../../../../keys';
import { useUploadContext } from '../../../../../../../../Providers/RealtorProvider/UploadProvider';
import './CountryDropDown.css'; 
const LocationDropDown = () => {
  const {
    country,
    setCountry,
    state,
    setState,
    city,
    setCity,
  } = useUploadContext();

  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const [selectedCountryCode, setSelectedCountryCode] = useState(null);
  const [selectedStateCode, setSelectedStateCode] = useState(null);

  const apiKey = COUNTRY_STATE_CITY_KEY;

  useEffect(() => {
    const fetchCountries = async () => {
      const headers = new Headers();
      headers.append('X-CSCAPI-KEY', apiKey);

      const requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
      };

      try {
        const response = await fetch(
          'https://api.countrystatecity.in/v1/countries',
          requestOptions
        );
        const data = await response.json();
        const countryArray = data.map((country) => ({
          value: country.iso2,
          label: country.name,
        }));
        setCountryData(countryArray);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, [apiKey]);

  const handleState = async (countryCode) => {
    const headers = new Headers();
    headers.append('X-CSCAPI-KEY', apiKey);

    const requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow',
    };

    try {
      const response = await fetch(
        `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
        requestOptions
      );
      const data = await response.json();
      const stateArray = data.map((state) => ({
        value: state.iso2,
        label: state.name,
      }));
      setStateData(stateArray);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const handleCity = async (countryCode, stateCode) => {
    const headers = new Headers();
    headers.append('X-CSCAPI-KEY', apiKey);

    const requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow',
    };

    try {
      const response = await fetch(
        `https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`,
        requestOptions
      );
      const data = await response.json();
      const cityArray = data.map((city) => ({
        value: city.id,
        label: city.name,
      }));
      setCityData(cityArray);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  return (
    <div className="formSectionCon">
      {/* Country */}
      <label className="formLabel">Country</label>
      <Select
        className="dropdown"
        options={countryData}
        placeholder="Select Country"
        value={countryData.find((item) => item.label === country) || null}
        onChange={(item) => {
          setCountry(item.label);
          setSelectedCountryCode(item.value);
          handleState(item.value);
        }}
      />

      {/* State */}
      <label className="formLabel">State</label>
      <Select
        className="dropdown"
        options={stateData}
        placeholder="Select State"
        value={stateData.find((item) => item.label === state) || null}
        onChange={(item) => {
          setState(item.label);
          setSelectedStateCode(item.value);
          handleCity(selectedCountryCode, item.value);
        }}
      />

      {/* City */}
      <label className="formLabel">City</label>
      <Select
        className="dropdown"
        options={cityData}
        placeholder="Select City"
        value={cityData.find((item) => item.label === city) || null}
        onChange={(item) => {
          setCity(item.label);
        }}
      />
    </div>
  );
};

export default LocationDropDown;