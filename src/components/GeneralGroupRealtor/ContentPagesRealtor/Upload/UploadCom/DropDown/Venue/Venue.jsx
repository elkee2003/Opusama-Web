import React, { useState } from 'react';
import Select from 'react-select';
import { useUploadContext } from '../../../../../../../../Providers/RealtorProvider/UploadProvider';
// import './PropertySale.css'; 

const Venue = () => {
    const {propertyType, 
        type, setType,
        packageType, setPackageType,
        capacity, setCapacity,
        customInput, setCustomInput,
        } = useUploadContext();

    const [isFocus, setIsFocus] = useState(false);

    const venueData = [
        { label: 'Banquet Hall', value: 'Banquet Hall' },
        { label: 'Conference Center', value: 'Conference Center' },
        { label: 'Event Center', value: 'Event Center' },
        { label: 'Wedding Hall', value: 'Wedding Hall' },
        { label: 'Outdoor Event Space', value: 'Outdoor Event Space' },
        { label: 'Ballroom', value: 'Ballroom' },
        { label: 'Garden Venue', value: 'Garden Venue' },
        { label: 'Hotel Event Hall', value: 'Hotel Event Hall' },
        { label: 'Civic Center', value: 'Civic Center' },
        { label: 'Private Estate Venue', value: 'Private Estate Venue' },
        { label: 'Stadium', value: 'Stadium' },
        { label: 'Community Hall', value: 'Community Hall' },
        { label: 'Multipurpose Hall', value: 'Multipurpose Hall' },
        { label: 'Open Field', value: 'Open Field' },
        { label: 'Exhibition Hall', value: 'Exhibition Hall' },
        { label: 'Luxury Tent Venue', value: 'Luxury Tent Venue' },
        { label: 'Rooftop Venue', value: 'Rooftop Venue' },
        { label: 'Beachfront Venue', value: 'Beachfront Venue' },
        {label:'Other', value:'Other'},
    ];

    const handleCustomInputSubmit = () => {
        if (type === 'Other' && customInput.trim()) {
        setType(customInput.trim());
        }
    };

  return (
    <div>
      {propertyType === 'Venue' && (
        <>
          <label className="formLabel">Venue Type</label>
          <Select
            className={`dropdown ${isFocus ? 'focus' : ''}`}
            options={venueData}
            placeholder="Select Venue"
            value={venueData.find((option) => option.value === type)}
            onChange={(selectedOption) => setType(selectedOption.value)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
          {type === 'Other' && (
            <input
              className="inputField"
              placeholder="Enter Venue Type"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onBlur={handleCustomInputSubmit}
            />
          )}

          <div className='accommoDiv'>
            <label className="formLabel">Package:</label>
            <textarea
              className="formInput"
              value={packageType}
              onChange={(e) => setPackageType(e.target.value)}
              placeholder="Exculsive, Premium, Standard, VIP, VVIP, etc... (type of package) (optional)"
            />
          </div>

          <div className='accommoDiv'>
            <label className="formLabel">Capacity:</label>
            <input
              className="formInput"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="eg: 50 - 200 people"
            />
          </div>
        </>
      )}
      
    </div>
  );
};

export default Venue;