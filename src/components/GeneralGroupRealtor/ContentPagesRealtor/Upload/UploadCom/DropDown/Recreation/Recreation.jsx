import React, { useState } from 'react';
import Select from 'react-select';
import { useUploadContext } from '../../../../../../../../Providers/RealtorProvider/UploadProvider';
// import './PropertySale.css'; 

const Recreation = () => {
    const {propertyType, 
        type, setType,
        packageType, setPackageType,
        customInput, setCustomInput,
        } = useUploadContext();

    const [isFocus, setIsFocus] = useState(false);

    const recreationData = [
        {label:'Gym & Fitness Center', value:'Gym & Fitness Center'},
        {label:'Yoga', value:'Yoga'},
        { label: 'Spa & Wellness Center', value: 'Spa & Wellness Center' },
        {label:'Park & Garden', value:'Parks & Garden'},
        {label:'Swimming Pool', value:'Swimming Pool'},
        {label:'Cinema', value:'Cinema'},
        {label:'Zoo', value:'Zoo'},
        {label:'Aquarium', value:'Aquarium'},
        { label: 'Skating Rink', value: 'Skating Rink' },
        { label: 'Paint Ball', value: 'Paint Ball' },
        { label: 'Football Pitch', value: 'Football Pitch' },
        { label: 'Serviced Pitch', value: 'Serviced Pitch' },
        { label: 'Basketball Court', value: 'Basketball Court' },
        { label: 'Boat Rental', value: 'Boat Rental' },
        { label: 'Boat Cruise', value: 'Boat Cruise' },
        { label: 'Horseback Riding', value: 'Horseback Riding' },
        {label:'Beach & Waterfront', value:'Beach & Waterfront'},
        {label:'Amusement Park', value:'Amusement Park'},
        {label:'Playground & Kiddie Park', value:'Playground & Kiddie Park'},
        {label:'Hiking Trail', value:'Hiking Trail'},
        { label: 'Art Gallery', value: 'Art Gallery' },
        { label: 'Cultural & Art Center', value: 'Cultural & Art Center' },
        {label:'Karate Dojo', value:'Karate Dojo'},
        { label: 'Golf Course', value: 'Golf Course' },
        { label: 'Mini Golf', value: 'Mini Golf' },
        { label: 'Arcade', value: 'Arcade' },
        { label: 'Bowling Alley', value: 'Bowling Alley' },
        { label: 'Meditation Garden', value: 'Meditation Garden' },
        {label:'Other', value:'Other'},
    ];

    const handleCustomInputSubmit = () => {
        if (type === 'Other' && customInput.trim()) {
        setType(customInput.trim());
        }
    };

  return (
    <div>
      {propertyType === 'Recreation' && (
        <>
          <label className="formLabel">Recreation Type</label>
          <Select
            className={`dropdown ${isFocus ? 'focus' : ''}`}
            options={recreationData}
            placeholder="Select Recreation Type"
            value={recreationData.find((option) => option.value === type)}
            onChange={(selectedOption) => setType(selectedOption.value)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
          {type === 'Other' && (
            <input
              className="inputField"
              placeholder="Enter Recreation Type"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onBlur={handleCustomInputSubmit}
            />
          )}

          <div className='accommoDiv'>
            <label className="formLabel">Package (opt):</label>
            <textarea
              className="formInput"
              value={packageType}
              onChange={(e) => setPackageType(e.target.value)}
              placeholder="Exculsive, Standard, VIP or use Booking Options for multiple packages and prices"
            />
          </div>
        </>
      )}
      
    </div>
  );
};

export default Recreation;