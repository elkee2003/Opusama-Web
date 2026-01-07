import React from 'react';
import { useUploadContext } from '../../../../../../../../../../../Providers/RealtorProvider/UploadProvider';


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
                renderFields('House Rent', 'Kindly describe House', 
                '24/7 Security, Parking, Swimming, Pool, Gym, Building is around banks', 
                'Lawn must be mowed every 2 weeks, Paint building every year')
            }

            {propertyType === 'Hotel / Shortlet' &&
                renderFields('Hotel / Shortlet', 'Kindly describe Hotel / Shortlet', 
                '24/7 Security, Parking, Swimming, Pool, Gym, Breakfast', 
                'No guns allowed, Caution fees applicable, Paint building every year, Not more than 5 Guests')
            }

            {propertyType === 'Student Accommodation' &&
                renderFields('Student Accommodation', 'Kindly describe Student Accommodation', 
                '24/7 Security, Parking, Swimming, Pool, Gym, Breakfast, library', 
                'Gate closes at 8:00pm, Not more than 2 Guests')
            }

            {propertyType === 'Land Sale' &&
                renderFields('Land', 'Unit measurement, method of measurement, situation etc.', 
                'Advantage of purchase', 
                'What potential buyer needs for purchase')
            }

            {propertyType === 'House Sale' &&
                renderFields('House', 'Describe house, situation etc.', 
                'Advantage of Purchase', 
                'What potential buyer needs')
            }

            {propertyType === 'Recreation' &&
                renderFields('Recreation', 'Describe the services you offer.', 
                'Advantage of using your services', 
                'How clients should behave and act while using your service')
            }

            {propertyType === 'Nightlife' &&
                renderFields('Nightlife', 'Describe the services you offer.', 
                'Advantage of using your services', 
                'How clients should behave and act while using your service')
            }

            {propertyType === 'Office Space' &&
                renderFields('Office Space', 'Describe office space.', 
                'Advantage of Space', 
                'What potential clients need to get Office Space')
            }

            {propertyType === 'Venue' &&
                renderFields('Venue', 'Describe Venue / Hall.', 
                'Advantage of using your venue / hall', 
                'Criteria to fulfil before using and while using your venue / hall')
            }

            {propertyType === 'Event' &&
                renderFields('Event', 'Describe event.', 
                'Reason why event is interesting', 
                'Criteria to attend event or things not to do at event')
            }

            {propertyType === 'Commercial Space' &&
                renderFields('Commercial Space', 'Describe commercial space etc.', 
                'Advantage of commercial space', 
                'What client needs to get space')
            }

            {propertyType === 'Food & Drinks' &&
                renderFields('Food & Drinks', 'Describe food, drink or list ingredients etc.', 
                'Why one would get food or drink', 
                'Criteria for getting food or drink, age restrictions etc')
            }
        </div>
    );
};

export default WriteDescription;