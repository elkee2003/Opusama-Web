import React, {useState, useEffect} from 'react';
import './Content.css';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../../../../../../Providers/ClientProvider/AuthProvider';
import { useUploadContext } from '../../../../../../../Providers/RealtorProvider/UploadProvider';
import { DataStore } from "aws-amplify/datastore";
import { Post } from '../../../../../../models';

function EditPostContent({post}) {
    const navigate = useNavigate();
    const { dbRealtor, sub } = useAuthContext();
    const {
        
        packageType, setPackageType,
        nameOfType, setNameOfType,
        availableDocs, setAvailableDocs,
        capacity, setCapacity,
        eventDateTime, setEventDateTime,
        eventEndDateTime,  setEventEndDateTime,
        recurrence, setRecurrence,
        eventFrequency, setEventFrequency,
        dressCode, setDressCode,
        accommodationParts, setAccommodationParts,
        media, setMedia,
        bedrooms, setBedrooms,
        bed, setBed,
        cautionFee, setCautionFee,
        timeFrame, setTimeFrame,
        inspectionFee, setInspectionFee,
        otherFeesName, setOtherFeesName,
        otherFeesName2, setOtherFeesName2,
        otherFeesPrice, setOtherFeesPrice,
        otherFeesPrice2, setOtherFeesPrice2,
        totalPrice, setTotalPrice,
        setVendorCommissionAmount,vendorCommissionAmount,
        vendorCommissionBreakdown, setVendorCommissionBreakdown,
        country, setCountry,
        state, setState,
        city, setCity,
        fullAddress, setFullAddress,
        generalLocation, setGeneralLocation,
        lat, setLat,
        lng, setLng,
        isSubscription, setIsSubscription,
        bookingMode, setBookingMode,
        allowMultiple, setAllowMultiple,
        maxCapacity, setMaxCapacity,
        sessionDuration, setSessionDuration,
        serviceDay, setServiceDay,
        openingHour, setOpeningHour,
        closingHour, setClosingHour,
        uploadPost, setUploadPost,
        onValidateUpload,
    } = useUploadContext();

    const [propertyType, setPropertyType] = useState(post.propertyType)
    const [type, setType] = useState(post.type);
    const [description, setDescription] = useState(post.description);
    const [price, setPrice] = useState(post.price);
    const [amenities, setAmenities] = useState(post.amenities);
    const [policies, setPolicies] = useState(post.policies);
    const [loading, setLoading] = useState(false);


    // Function to Update / Edit Post
    const handleSave = async () => {
        setLoading(true);
        try {
        const original = await DataStore.query(Post, post.id);
        if (!original) {
            alert("Post not found");
            return;
        }

        await DataStore.save(
            Post.copyOf(original, (updated) => {
                updated.description = description;
                updated.amenities = amenities
                updated.policies = policies
                updated.price = parseFloat(price);
            })
        );

        alert("Post updated successfully!");
        navigate(-1)
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Failed to update post.");
        } finally {
            setLoading(false);
        }
    };

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
    <div className='editPostCon'>
        <p className='editPostTitle'>Edit Post</p>
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
                'Criteria to attend event')
            }

            {propertyType === 'Commercial Space' &&
                renderFields('Commercial Space', 'Describe commercial space etc.', 
                'Advantage of commercial space', 
                'What client needs to get space')
            }

            {propertyType === 'Food & Drinks' &&
                renderFields('Food & Drinks', 'Describe food, drink or list ingredients etc.', 
                'Why one would get food or drink', 
                'Criteria of getting food or drink')
            }
        </div>

        <div className="uploadBtnCon">
            <button 
                className="btnUpload"
                onClick={handleSave}
                disabled={loading}
            >
                <p className="uploadTxt">
                    {loading ? "Saving..." : "Save Changes"}
                </p>
            </button>
        </div>
    </div>
  )
}

export default EditPostContent;
