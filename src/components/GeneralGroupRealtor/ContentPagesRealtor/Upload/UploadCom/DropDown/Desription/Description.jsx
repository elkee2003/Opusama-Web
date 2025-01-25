import React from 'react';
import { useUploadContext } from '../../../../../../../../Providers/RealtorProvider/UploadProvider';
import './Description.css'; 

const WriteDescription = () => {
    const {
        propertyType, setPropertyType,
        description, setDescription,
        amenities, setAmenities,
        policies, setPolicies,
    } = useUploadContext();

    const renderFields = (type, descriptionPlaceholder, amenitiesPlaceholder, policiesPlaceholder) => (
        <>
            <label className="formLabel">{type} Description:</label>
            <textarea
                className="formInput"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={descriptionPlaceholder}
                rows={4}
            />
            <label className="formLabel">Amenities:</label>
            <textarea
                className="formInput"
                value={amenities}
                onChange={(e) => setAmenities(e.target.value)}
                placeholder={amenitiesPlaceholder}
                rows={4}
            />
            <label className="formLabel">Policies:</label>
            <textarea
                className="formInputLast"
                value={policies}
                onChange={(e) => setPolicies(e.target.value)}
                placeholder={policiesPlaceholder}
                rows={4}
            />
        </>
    );

    return (
        <div className="formSectionCon">
            {propertyType === 'House Rent' &&
                renderFields('House', 'Kindly describe House', 
                '24/7 Security, Parking, Swimming, Pool, Gym, Building is around banks', 
                'Lawn must be mowed every 2 weeks, Paint building every year')}

            {propertyType === 'Hotel / Shortlet' &&
                renderFields('Hotel / Shortlet', 'Kindly describe Hotel / Shortlet', 
                '24/7 Security, Parking, Swimming, Pool, Gym, Breakfast', 
                'No guns allowed, Caution fees applicable, Paint building every year, Not more than 5 Guests')}

            {propertyType === 'Student Accommodation' &&
                renderFields('Student Accommodation', 'Kindly describe Student Accommodation', 
                '24/7 Security, Parking, Swimming, Pool, Gym, Breakfast, library', 
                'Gate closes at 8:00pm, Not more than 2 Guests')}

            {propertyType === 'Land Sale' &&
                renderFields('Land', 'Unit measurement, method of measurement, situation etc.', 
                'Advantage of purchase', 
                'What potential buyer needs for purchase')}

            {propertyType === 'House Sale' &&
                renderFields('House', 'Describe house, situation etc.', 
                'Advantage of Purchase', 
                'What potential buyer needs')}

            {propertyType === 'Office Space' &&
                renderFields('Office Space', 'Describe office space.', 
                'Advantage of Space', 
                'What potential clients need to get Office Space')}

            {propertyType === 'Shop' &&
                renderFields('Shop', 'Describe shop etc.', 
                'Advantage of getting shop', 
                'What potential client needs to get shop')}
        </div>
    );
};

export default WriteDescription;