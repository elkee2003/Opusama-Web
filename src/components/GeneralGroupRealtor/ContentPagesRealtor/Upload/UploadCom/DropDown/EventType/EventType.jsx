import React, { useState } from 'react';
import Select from 'react-select';
import { format } from 'date-fns';
import { useUploadContext } from '../../../../../../../../Providers/RealtorProvider/UploadProvider';
// import './PropertySale.css'; 

const EventType = () => {
    const {propertyType, 
        type, setType,
        packageType, setPackageType,
        eventDateTime, setEventDateTime,
        dressCode, setDressCode,
        capacity, setCapacity,
        customInput, setCustomInput,
        } = useUploadContext();

    const [isFocus, setIsFocus] = useState(false);

    const eventData = [
        { label: 'House Party', value: 'House Party' },
        { label: 'Pool Party', value: 'Pool Party' },
        { label: 'Beach Party', value: 'Beach Party' },
        { label: 'Birthday Party', value: 'Birthday Party' },
        { label: 'Wedding', value: 'Wedding' },
        { label: 'Engagement Party', value: 'Engagement Party' },
        { label: 'Bridal Shower', value: 'Bridal Shower' },
        { label: 'Baby Shower', value: 'Baby Shower' },
        { label: 'Bachelor/Bachelorette Party', value: 'Bachelor/Bachelorette Party' },
        { label: 'Graduation Party', value: 'Graduation Party' },
        { label: 'Anniversary Celebration', value: 'Anniversary Celebration' },
        { label: 'Club Night', value: 'Club Night' },
        { label: 'Bar Night', value: 'Bar Night' },
        { label: 'Comedy Night', value: 'Comedy Night' },
        { label: 'Game Night', value: 'Game Night' },
        { label: 'Live Concert', value: 'Live Concert' },
        { label: 'Music Festival', value: 'Music Festival' },
        { label: 'Cultural Festival', value: 'Cultural Festival' },
        { label: 'Fashion Show', value: 'Fashion Show' },
        { label: 'Corporate Event', value: 'Corporate Event' },
        { label: 'Conference/Seminar', value: 'Conference/Seminar' },
        { label: 'Product Launch', value: 'Product Launch' },
        { label: 'Exhibition/Expo', value: 'Exhibition/Expo' },
        { label: 'Networking Event', value: 'Networking Event' },
        { label: 'Religious Event', value: 'Religious Event' },
        { label: 'Fundraiser/Gala', value: 'Fundraiser/Gala' },
        { label: 'Photo/Video Shoot', value: 'Photo/Video Shoot' },
        { label: 'Sports Viewing Party', value: 'Sports Viewing Party' },
        { label: 'Carnival or Parade', value: 'Carnival or Parade' },
        { label: 'Reunion/Gathering', value: 'Reunion/Gathering' },
        { label: 'Private Dinner', value: 'Private Dinner' },
        { label: 'Pop-up Event', value: 'Pop-up Event' },
        { label: 'Themed Party (e.g. Halloween)', value: 'Themed Party (e.g. Halloween)' },
        { label: 'Other', value: 'Other' },
    ];

    const handleCustomInputSubmit = () => {
        if (type === 'Other' && customInput.trim()) {
        setType(customInput.trim());
        }
    };

  return (
    <div>
      {propertyType === 'Event' && (
        <>
          <label className="formLabel">Event Type</label>
          <Select
            className={`dropdown ${isFocus ? 'focus' : ''}`}
            options={eventData}
            placeholder="Select Event"
            value={eventData.find((option) => option.value === type)}
            onChange={(selectedOption) => setType(selectedOption.value)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
          {type === 'Other' && (
            <input
              className="inputField"
              placeholder="Enter Event Type"
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

          {/* Dress Code */}
          <div className='accommoDiv'>
            <label className="formLabel">
                Dress Code:
            </label>
            <input
                className="formInput"
                value={dressCode}
                onChange={(e) => setDressCode(e.target.value)}
                placeholder="e.g. All-white, Traditional, Formal, No slippers allowed (optional)"
            />
          </div>

          {/* Capacity */}
          <div className='accommoDiv'>
            <label className="formLabel">Capacity:</label>
            <input
              className="formInput"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="eg: 50 - 200 people (optional)"
            />
          </div>

          {/* Date and Time */}
          <div className='accommoDiv'>
            <label className="formLabel">
                Event Date & Time:
            </label>
            <input
                className="formInput"
                type="datetime-local"
                value={eventDateTime}
                onChange={(e) => setEventDateTime(e.target.value)}
            />
            {eventDateTime && (
                <div className="event-date-display" style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#555' }}>
                Selected Date: {format(new Date(eventDateTime), "d MMMM, yyyy 'at' h:mma")}
                </div>
            )}
          </div>
        </>
      )}
      
    </div>
  );
};

export default EventType;