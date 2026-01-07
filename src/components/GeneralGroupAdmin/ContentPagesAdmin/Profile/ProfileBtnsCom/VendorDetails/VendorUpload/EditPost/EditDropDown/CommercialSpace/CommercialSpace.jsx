import React, { useState } from 'react';
import Select from 'react-select';
import { useUploadContext } from '../../../../../../../../../../../Providers/RealtorProvider/UploadProvider';

const CommercialSpace = () => {
    const {propertyType, 
        type, setType,
        capacity, setCapacity,
        customInput, setCustomInput,
        } = useUploadContext();

    const [isFocus, setIsFocus] = useState(false);

    const commercialSpaceData = [
        // Retail & Consumer Spaces
        { label: 'Retail Shop / Outlet', value: 'Retail Shop / Outlet' },
        { label: 'Supermarket / Grocery Store', value: 'Supermarket / Grocery Store' },
        { label: 'Shopping Mall Space', value: 'Shopping Mall Space' },
        { label: 'Boutique Store', value: 'Boutique Store' },
        { label: 'Convenience Store', value: 'Convenience Store' },
        { label: 'Pharmacy / Drugstore', value: 'Pharmacy / Drugstore' },
        { label: 'Showroom', value: 'Showroom' },
        { label: 'Pop-Up Store', value: 'Pop-Up Store' },
        { label: 'Kiosk / Stall', value: 'Kiosk / Stall' },
        { label: 'Electronics Store', value: 'Electronics Store' },

        // Industrial & Storage
        { label: 'Warehouse', value: 'Warehouse' },
        { label: 'Distribution Center', value: 'Distribution Center' },
        { label: 'Cold Storage Facility', value: 'Cold Storage Facility' },
        { label: 'Storage Unit / Mini Warehouse', value: 'Storage Unit / Mini Warehouse' },
        { label: 'Factory / Manufacturing Plant', value: 'Factory / Manufacturing Plant' },
        { label: 'Workshop / Fabrication Yard', value: 'Workshop / Fabrication Yard' },
        { label: 'Logistics Hub', value: 'Logistics Hub' },

        // Auto & Services
        { label: 'Car Showroom', value: 'Car Showroom' },
        { label: 'Mechanic Workshop', value: 'Mechanic Workshop' },
        { label: 'Car Wash / Auto Detailing', value: 'Car Wash / Auto Detailing' },
        { label: 'Gas Station', value: 'Gas Station' },
        { label: 'Auto Parts Store', value: 'Auto Parts Store' },

        // Others
        { label: 'Clinic / Diagnostic Center', value: 'Clinic / Diagnostic Center' },
        { label: 'Training Center / Institute', value: 'Training Center / Institute' },
        { label: 'Event Space / Conference Hall', value: 'Event Space / Conference Hall' },
        { label: 'Studio (Photo, Music, Art)', value: 'Studio (Photo, Music, Art)' },
        { label: 'Bank / Financial Institution', value: 'Bank / Financial Institution' },
        { label: 'Religious Store / Bookstore', value: 'Religious Store / Bookstore' },
        { label: 'Other', value: 'Other' },
    ];
    const handleCustomInputSubmit = () => {
        if (type === 'Other' && customInput.trim()) {
        setType(customInput.trim());
        }
    };

  return (
    <div>
      {propertyType === 'Commercial Space' && (
        <>
          <label className="formLabel">Commercial Space Type</label>
          <Select
            className={`dropdown ${isFocus ? 'focus' : ''}`}
            options={commercialSpaceData}
            placeholder="Select Commercial Space"
            value={commercialSpaceData.find((option) => option.value === type)}
            onChange={(selectedOption) => setType(selectedOption.value)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
          {type === 'Other' && (
            <input
              className="inputField"
              placeholder="Enter Commercial Space Type"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onBlur={handleCustomInputSubmit}
            />
          )}

          {/* Capacity */}
          <div className='accommoDiv'>
            <label className="formLabel">Capacity:</label>
            <input
              className="formInput"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="(optional)"
            />
          </div>
        </>
      )}
      
    </div>
  );
};

export default CommercialSpace;