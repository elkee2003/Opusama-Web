import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useUploadContext } from '../../../../../../../../Providers/RealtorProvider/UploadProvider';
import './Accommodation.css'; 

const AccommodationDropDown = () => {
  const {
    propertyType, setPropertyType,
    type, setType,
    nameOfType, setNameOfType,
    customInput, setCustomInput,
    accommodationParts, setAccommodationParts,
    bedrooms, setBedrooms,
    bed, setBed,
  } = useUploadContext();

  const [isFocus, setIsFocus] = useState(false);

  const propertyTypes = [
    { label: 'House Rent', value: 'House Rent' },
    { label: 'Hotel / Shortlet', value: 'Hotel / Shortlet' },
    { label: 'House Sale', value: 'House Sale' },
    { label: 'Land Sale', value: 'Land Sale' },
    { label: 'Recreation', value: 'Recreation' },
    { label: 'Nightlife', value: 'Nightlife' },
    { label: 'Office Space', value: 'Office Space' },
    { label: 'Student Accommodation', value: 'Student Accommodation' },
    // { label: 'Events & Halls', value: 'Events & Halls' },
    // { label: 'Food & Drinks', value: 'Food & Drinks' },
  ];

  const houseData = [
    { label: 'Self Contain', value: 'Self Contain' },
    { label: 'One Bedroom', value: 'One Bedroom' },
    { label: 'Two Bedroom', value: 'Two Bedroom' },
    { label: 'Three Bedroom', value: 'Three Bedroom' },
    { label: 'Five Bedroom', value: 'Five Bedroom' },
    { label: 'Bungalow', value: 'Bungalow' },
    { label: 'Duplex', value: 'Duplex' },
    { label: 'Shared Apartment', value: 'Shared Apartment' },
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
    { label: 'Other', value: 'Other' }, // Add "Other" option
  ];

  const hotelData = [
    {label:'Standard Room', value:'Standard Room'},
    {label:'Single Room', value:'Single Room'},
    {label:'Double Room', value:'Double Room'},
    { label: 'Bungalow', value: 'Bungalow' },
    { label: 'Duplex', value: 'Duplex' },
    {label:'Twin Room', value:'Twin Room'},
    {label:'Triple Room', value:'Triple Room'},
    {label:'Studio Room', value:'Studio Room'},
    {label:'Quad Room', value:'Quad Room'},
    {label:'Queen Room', value:'Queen Room'},
    {label:'King Room', value:'King Room'},
    {label:'Suite', value:'Suite'},
    {label:'Connecting Rooms', value:'Connecting Rooms'},
    {label:'Accessible Room', value:'Accessible Room'},
    {label:'Whole Floor', value:'Whole Floor'},
    {label:'Half Floor', value:'Half Floor'},
    {label:'Balcony/Terrace Room', value:'Balcony/Terrace Room'},
    {label:'Deluxe Room', value:'Deluxe Room'},
    {label:'Penthouse', value:'Penthouse'},
    {label: 'Other', value: 'Other' }, // Add "Other" option
  ];

  const studentData = [
    {label:'Single Room', value:'Single Room'},
    {label:'Single Shared Room', value:'Single Shared Room'},
    {label:'Double Room', value:'Double Room'},
    {label:'Suite-Style Room', value:'Suite-Style Room'},
    {label:'Off-Campus Apartment', value:'Off-Campus Apartment'},
    {label:'Studio Apartment (Off-Campus)', value:'Studio Apartment (Off-Campus)'},
    {label:'One-Bedroom Apartment (Off-Campus)', value:'One-Bedroom Apartment (Off-Campus)'},
    {label:'Shared Apartment (Off-Campus)', value:'Shared Apartment (Off-Campus)'},
    {label:'House', value:'House'},
    {label:'Condo', value:'Condo'},
    {label:'Homestay', value:'Homestay'},
    {label:'University-Owned Apartment', value:'University-Owned Apartment'},
    {label:'Purpose-Built Student Accommodation (PBSA)', value:'Purpose-Built Student Accommodation (PBSA)'},
    {label:'Other', value:'Other'},
  ];

  const handleCustomInputSubmit = () => {
    if (type === 'Other' && customInput.trim()) {
      setType(customInput.trim());
    }
  };

  return (
    <div className="accommoContainer">
        <label className="formLabel">Property Type</label>
        <Select
            options={propertyTypes}
            placeholder="Select Property Type"
            value={propertyTypes.find(option => option.value === propertyType)}
            onChange={(selected) => {
            setPropertyType(selected.value);
            setCustomInput('');
            }}
            className="dropdown"
        />

        {propertyType === 'House Rent' && (
            <div className='accomoDiv'>
            <label className="formLabel">Accommodation Type</label>
            <Select
                options={houseData}
                placeholder="Select House Type"
                value={houseData.find(option => option.value === type)}
                onChange={(selected) => setType(selected.value)}
                className="dropdown"
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

            <div className='accommoDiv'>
                <label className="formLabel">Accommodation Parts</label>
                <textarea
                    className="accommoTxtArea"
                    placeholder="e.g., 2 parlours, 3 kitchens (optional)"
                    value={accommodationParts}
                    onChange={(e) => setAccommodationParts(e.target.value)}
                />
            </div>

            <div className='accommoDiv'>
                <label className="formLabel">Bedrooms:</label>
                <input
                    className="inputField"
                    placeholder="Number of Bedrooms"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    type="number"
                />
            </div>
            </div>
        )}

        {propertyType === 'Hotel / Shortlet' && (
            <div className='accomoDiv'>
            <label className="formLabel">Accommodation Type</label>
            <Select
                options={hotelData}
                placeholder="Select Hotel/Shortlet Type"
                value={hotelData.find(option => option.value === type)}
                onChange={(selected) => setType(selected.value)}
                className="dropdown"
            />
            {type === 'Other' && (
                <input
                className="inputField"
                placeholder="Enter Hotel/Shortlet Type"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onBlur={handleCustomInputSubmit}
                />
            )}

            <label className="formLabel">Name of Accommodation</label>
            <input
                className="inputField"
                placeholder="e.g., Room 202 Lavenda (optional)"
                value={nameOfType}
                onChange={(e) => setNameOfType(e.target.value)}
            />

            <div className='accommoDiv'>
                <label className="formLabel">Accommodation Parts</label>
                <textarea
                    className="accommoTxtArea"
                    placeholder="e.g., 2 parlours, 3 kitchens (optional)"
                    value={accommodationParts}
                    onChange={(e) => setAccommodationParts(e.target.value)}
                />
            </div>

            <div className="formRow">
                <div className="formColumn">
                <label className="formLabel">Bedrooms:</label>
                <input
                    className="inputField"
                    placeholder="Number of Bedrooms"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    type="number"
                />
                </div>
                <div className="formColumn">
                <label className="formLabel">Beds:</label>
                <input
                    className="inputField"
                    placeholder="Number of Beds"
                    value={bed}
                    onChange={(e) => setBed(e.target.value)}
                    type="number"
                />
                </div>
            </div>
            </div>
        )}

        {propertyType === 'Student Accommodation' && (
            <div className='accomoDiv'>
            <label className="formLabel">Accommodation Type</label>
            <Select
                options={studentData}
                placeholder="Select Student Accommodation Type"
                value={studentData.find(option => option.value === type)}
                onChange={(selected) => setType(selected.value)}
                className="dropdown"
            />
            {type === 'Other' && (
                <input
                className="inputField"
                placeholder="Enter Accommodation Type"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onBlur={handleCustomInputSubmit}
                />
            )}

            <div className='accommoDiv'>
                <label className="formLabel">Accommodation Parts</label>
                <textarea
                    className="accommoTxtArea"
                    placeholder="e.g., 2 parlours, 3 kitchens (optional)"
                    value={accommodationParts}
                    onChange={(e) => setAccommodationParts(e.target.value)}
                />
            </div>
            </div>
        )}
    </div>
  );
};

export default AccommodationDropDown;