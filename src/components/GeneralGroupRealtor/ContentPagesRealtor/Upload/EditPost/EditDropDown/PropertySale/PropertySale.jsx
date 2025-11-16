import React, { useState } from 'react';
import Select from 'react-select';
import { useUploadContext } from '../../../../../../../../Providers/RealtorProvider/UploadProvider';
import './PropertySale.css'; 

const PropertySale = () => {
  const {
    propertyType, setPropertyType,
    type, setType,
    accommodationParts, setAccommodationParts,
    bedrooms, setBedrooms,
    availableDocs, setAvailableDocs,
    customInput, setCustomInput,
  } = useUploadContext();

  const [isFocus, setIsFocus] = useState(false);

  const landData = [
    { label: 'Residential Land', value: 'Residential Land' },
    { label: 'Commercial Land', value: 'Commercial Land' },
    { label: 'Industrial Land', value: 'Industrial Land' },
    { label: 'Agricultural Land', value: 'Agricultural Land' },
    { label: 'Mixed-Use Land', value: 'Mixed-Use Land' },
    { label: 'Recreational Land', value: 'Recreational Land' },
    { label: 'Forest Land', value: 'Forest Land' },
    { label: 'Vacant Land', value: 'Vacant Land' },
    { label: 'Development Land', value: 'Development Land' },
    { label: 'Brownfield Land', value: 'Brownfield Land' },
    { label: 'Greenfield Land', value: 'Greenfield Land' },
    { label: 'Wetland', value: 'Wetland' },
    { label: 'Other', value: 'Other' },
  ];

  const houseSaleData = [
    { label: 'Self Contain', value: 'Self Contain' },
    { label: 'Bungalow', value: 'Bungalow' },
    { label: 'Duplex', value: 'Duplex' },
    { label: 'Single-Family Home', value: 'Single-Family Home' },
    { label: 'Condominium (Condo)', value: 'Condominium (Condo)' },
    { label: 'Chalet', value: 'Chalet' },
    { label: 'Apartment', value: 'Apartment' },
    { label: 'Ranch House', value: 'Ranch House' },
    { label: 'Cottage', value: 'Cottage' },
    { label: 'Villa', value: 'Villa' },
    { label: 'Mansion', value: 'Mansion' },
    { label: 'Cabin', value: 'Cabin' },
    { label: 'Farmhouse', value: 'Farmhouse' },
    { label: 'Other', value: 'Other' },
  ];

  const handleCustomInputSubmit = () => {
    if (type === 'Other' && customInput.trim()) {
      setType(customInput.trim());
    }
  };

  return (
    <div>
      {propertyType === 'Land Sale' && (
        <>
          <label className="formLabel">Land Type</label>
          <Select
            className={`dropdown ${isFocus ? 'focus' : ''}`}
            options={landData}
            placeholder="Select Land Type"
            value={landData.find((option) => option.value === type)}
            onChange={(selectedOption) => setType(selectedOption.value)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
          {type === 'Other' && (
            <input
              className="inputField"
              placeholder="Enter Land Type"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onBlur={handleCustomInputSubmit}
            />
          )}

          <div className='accommoDiv'>
            <label className="formLabel">Available Documents:</label>
            <textarea
              className="formInput"
              value={availableDocs}
              onChange={(e) => setAvailableDocs(e.target.value)}
              placeholder="Kindly input necessary and available documents"
            />
          </div>
        </>
      )}
      {propertyType === 'House Sale' && (
        <div className='accommoDiv'>
          <label className="formLabel">House Type</label>
          <Select
            className={`dropdown ${isFocus ? 'focus' : ''}`}
            options={houseSaleData}
            placeholder="Select House Type"
            value={houseSaleData.find((option) => option.value === type)}
            onChange={(selectedOption) => setType(selectedOption.value)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
          {type === 'Other' && (
            <input
              className="inputField"
              placeholder="Enter House Type"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onBlur={handleCustomInputSubmit}
            />
          )}

          <label className="formLabel">Accommodation Parts:</label>
          <textarea
            className="formInput"
            value={accommodationParts}
            onChange={(e) => setAccommodationParts(e.target.value)}
            placeholder="e.g., 2 parlours, 3 kitchens (optional)"
          />

          <label className="formLabel">Bedrooms:</label>
          <input
            className="formInput"
            type="number"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            placeholder="Number of Bedrooms"
          />

          <div className='accommoDiv'>
            <label className="formLabel">Available Documents:</label>
            <textarea
              className="formInput"
              value={availableDocs}
              onChange={(e) => setAvailableDocs(e.target.value)}
              placeholder="Kindly input necessary and available documents"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertySale;