import React, { useState } from 'react';
import Select from 'react-select';
import { useUploadContext } from '../../../../../../../../../../../Providers/RealtorProvider/UploadProvider';

const FoodDrinks = () => {
    const {propertyType, 
        type, setType,
        capacity, setCapacity,
        customInput, setCustomInput,
        } = useUploadContext();

    const [isFocus, setIsFocus] = useState(false);

    const foodDrinkData = [
      { label: 'Restaurant', value: 'Restaurant' },
      { label: 'Bar', value: 'Bar' },
      { label: 'Lounge', value: 'Lounge' },
      { label: 'Café / Coffee Shop', value: 'Café / Coffee Shop' },
      { label: 'Bistro', value: 'Bistro' },
      { label: 'Pub', value: 'Pub' },
      { label: 'Rooftop Bar', value: 'Rooftop Bar' },
      { label: 'Wine Bar', value: 'Wine Bar' },
      { label: 'Food Truck / Mobile Kitchen', value: 'Food Truck / Mobile Kitchen' },
      { label: 'Bakery / Pastry Shop', value: 'Bakery / Pastry Shop' },
      { label: 'Ice Cream / Frozen Yogurt Spot', value: 'Ice Cream / Frozen Yogurt Spot' },
      { label: 'Fast Food Outlet', value: 'Fast Food Outlet' },
      { label: 'Diner', value: 'Diner' },
      { label: 'Buffet Restaurant', value: 'Buffet Restaurant' },
      { label: 'Steakhouse', value: 'Steakhouse' },
      { label: 'Seafood Restaurant', value: 'Seafood Restaurant' },
      { label: 'Juice Bar / Smoothie Bar', value: 'Juice Bar / Smoothie Bar' },
      { label: 'Hookah Lounge / Shisha Bar', value: 'Hookah Lounge / Shisha Bar' },
      { label: 'Catering Service Venue', value: 'Catering Service Venue' },
      { label: 'Cloud Kitchen / Ghost Kitchen', value: 'Cloud Kitchen / Ghost Kitchen' },
      { label: 'Ethnic / Specialty Cuisine Venue', value: 'Ethnic / Specialty Cuisine Venue' },
      { label: 'Other', value: 'Other' },
    ];
    const handleCustomInputSubmit = () => {
        if (type === 'Other' && customInput.trim()) {
        setType(customInput.trim());
        }
    };

  return (
    <div>
      {propertyType === 'Food & Drinks' && (
        <>
          <label className="formLabel">Food & Drink Type</label>
          <Select
            className={`dropdown ${isFocus ? 'focus' : ''}`}
            options={foodDrinkData}
            placeholder="Select Food & Drink Type"
            value={foodDrinkData.find((option) => option.value === type)}
            onChange={(selectedOption) => setType(selectedOption.value)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
          {type === 'Other' && (
            <input
              className="inputField"
              placeholder="Enter Food & Drinks Type"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onBlur={handleCustomInputSubmit}
            />
          )}
        </>
      )}
      
    </div>
  );
};

export default FoodDrinks;