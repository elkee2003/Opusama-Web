import React, { useState } from 'react';
import Select from 'react-select';
import { useUploadContext } from '../../../../../../../../Providers/RealtorProvider/UploadProvider';
import './OfficeSpace.css'; 

const OfficeSpace = () => {
  const {
    propertyType,
    setPropertyType,
    type,
    setType,
    customInput,
    setCustomInput,
  } = useUploadContext();

  const [isFocus, setIsFocus] = useState(false);

  const officeData = [
    { label: 'Private Office', value: 'Private Office' },
    { label: 'Coworking Space', value: 'Coworking Space' },
    { label: 'Executive Suite', value: 'Executive Suite' },
    { label: 'Virtual Office', value: 'Virtual Office' },
    { label: 'Meeting Room', value: 'Meeting Room' },
    { label: 'Hot Desk', value: 'Hot Desk' },
    { label: 'Dedicated Desk', value: 'Dedicated Desk' },
    { label: 'Serviced Office', value: 'Serviced Office' },
    { label: 'Open-plan Office', value: 'Open-plan Office' },
    { label: 'Team Office', value: 'Team Office' },
    { label: 'Creative Studio', value: 'Creative Studio' },
    { label: 'Training Room', value: 'Training Room' },
    { label: 'Shared Office', value: 'Shared Office' },
    { label: 'Industrial Office', value: 'Industrial Office' },
    { label: 'Subleased Office', value: 'Subleased Office' },
    { label: 'Startup Incubator', value: 'Startup Incubator' },
    { label: 'Other', value: 'Other' },
  ];

  const handleCustomInputSubmit = () => {
    if (type === 'Other' && customInput.trim()) {
      setType(customInput.trim());
    }
  };

  return (
    <div>
      {propertyType === 'Office Space' && (
        <>
          <label className="formLabel">Office Space Type</label>
          <Select
            className={`dropdown ${isFocus ? 'focus' : ''}`}
            options={officeData}
            placeholder="Select Office Space Type"
            value={officeData.find((option) => option.value === type)}
            onChange={(selectedOption) => {
              setType(selectedOption.value);
            }}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
          {type === 'Other' && (
            <input
              type="text"
              className="inputField"
              placeholder="Enter Office Space Type"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onBlur={handleCustomInputSubmit} // Update the type state when the user submits the custom input
            />
          )}
        </>
      )}
    </div>
  );
};

export default OfficeSpace;