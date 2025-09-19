import React, { useState } from 'react';
import Select from 'react-select';
import { useUploadContext } from '../../../../../../../../Providers/RealtorProvider/UploadProvider';
// import './PropertySale.css'; 

const NightLife = () => {
    const {propertyType, 
        type, setType,
        packageType, setPackageType,
        customInput, setCustomInput,
        } = useUploadContext();

    const [isFocus, setIsFocus] = useState(false);

    const nightLifeData = [
        {label:'Bar & Lounge', value:'Bar & Lounge'},
        {label:'Night Club', value:'Night Club'},
        { label: 'Casino', value: 'Casino' },
        {label:'Live Music', value:'Live Music'},
        {label:'Sit Out', value:'Sit Out'},
        {label:'Theater / Cinema', value:'Theater / Cinema'},
        {label:'Comedy Club', value:'Comedy Club'},
        {label:'Karaoke Bar', value:'Karaoke Bar'},
        { label: 'Rooftop Bar', value: 'Rooftop Bar' },
        { label: 'Game & Arcade', value: 'Game & Arcade' },
        { label: 'Escape Room', value: 'Escape Room' },
        { label: 'Late-Night Cafe', value: 'Late-Night Cafe' },
        { label: 'Private Club', value: 'Private Club' },
        {label:'Other', value:'Other'},
    ];

    const handleCustomInputSubmit = () => {
        if (type === 'Other' && customInput.trim()) {
        setType(customInput.trim());
        }
    };

  return (
    <div>
      {propertyType === 'Nightlife' && (
        <>
          <label className="formLabel">Nightlife Type</label>
          <Select
            className={`dropdown ${isFocus ? 'focus' : ''}`}
            options={nightLifeData}
            placeholder="Select Nightlife Type"
            value={nightLifeData.find((option) => option.value === type)}
            onChange={(selectedOption) => setType(selectedOption.value)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
          {type === 'Other' && (
            <input
              className="inputField"
              placeholder="Enter Nightlife Type"
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
              placeholder="Exculsive, Standard, VIP or use Booking Options for multiple packages and price"
            />
          </div>
        </>
      )}
      
    </div>
  );
};

export default NightLife;