import React from 'react';
import { useUploadContext } from '../../../../../../../Providers/RealtorProvider/UploadProvider'; 
import'./ReviewUpload.css'; 

const ReviewUpload = () => {
  const {
    propertyType,
    type,
    nameOfType,
    availableDocs,
    bedrooms,
    bed,
    accommodationParts,
    description,
    timeFrame,
    cautionFee,
    price,
    totalPrice,
    inspectionFee,
    country,
    state,
    address,
    city,
    media,
    policies,
    amenities,
  } = useUploadContext();

  const formatCurrency = (amount) => Number(amount)?.toLocaleString();

  return (
    <div className='reviewUploadCon'>
      {/* Media Display */}
      <div className='mediaFullDisplayContainer'>
        {media.map((mediaItem, index) => (
          <div key={index} className='mediaContainer'>
            <img src={mediaItem.uri} alt={`Media ${index}`} className='media' />
          </div>
        ))}
      </div>

      {/* Data Display */}
      <div className='inputDisplay'>
        <div className='uploadPropRow'>
          <p className='displayLabel'>Property Type:</p>
          <p className='uploadPropInputReview'>{propertyType}</p>
        </div>

        <div className='uploadPropRow'>
          <p className='displayLabel'>Property Sub Type:</p>
          <p className='uploadPropInputReview'>{type}</p>
        </div>

        {nameOfType && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Name of Accommodation:</p>
            <p className='uploadPropInputReview'>{nameOfType}</p>
          </div>
        )}

        {availableDocs && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Available Documents:</p>
            <p className='uploadPropInputReview'>{availableDocs.trim()}</p>
          </div>
        )}

        <div className='uploadPropRow'>
          <p className='displayLabel'>Address:</p>
          <p className='uploadPropInputReview'>{address?.trim()}</p>
        </div>

        <div className='uploadPropRow'>
          <p className='displayLabel'>City:</p>
          <p className='uploadPropInputReview'>{city}</p>
        </div>

        <div className='uploadPropRow'>
          <p className='displayLabel'>State:</p>
          <p className='uploadPropInputReview'>{state}</p>
        </div>

        <div className='uploadPropRow'>
          <p className='displayLabel'>Country:</p>
          <p className='uploadPropInputReview'>{country}</p>
        </div>

        <div className='uploadPropRow'>
      <p className='displayLabel'>Price:</p>
          <p className='uploadPropInputReview'>₦{formatCurrency(price)}</p>
        </div>

        {timeFrame && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Time Frame:</p>
            <p className='uploadPropInputReview'>{timeFrame}</p>
          </div>
        )}

        <div className='uploadPropRow'>
          <p className='displayLabel'>Caution Fee:</p>
          <p className='uploadPropInputReview'>₦{formatCurrency(cautionFee)}</p>
        </div>

        <div className='uploadPropRow'>
          <p className='displayLabel'>Total Price:</p>
          <p className='uploadPropInputReview'>₦{formatCurrency(totalPrice)}</p>
        </div>

        {inspectionFee && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Inspection Fee:</p>
            <p className='uploadPropInputReview'>₦{formatCurrency(inspectionFee)}</p>
          </div>
        )}

        {bedrooms && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Number of Rooms:</p>
            <p className='uploadPropInputReview'>{bedrooms}</p>
          </div>
        )}

        {bed && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Number of Beds:</p>
            <p className='uploadPropInputReview'>{bed}</p>
          </div>
        )}

        {accommodationParts && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Accommodation Parts:</p>
            <p className='uploadPropInputReview'>{accommodationParts}</p>
          </div>
        )}

        <div className='uploadPropRow'>
          <p className='displayLabel'>Description:</p>
          <p className='uploadPropInputReview'>{description?.trim()}</p>
        </div>

        <div className='uploadPropRow'>
          <p className='displayLabel'>Amenities:</p>
          <p className='uploadPropInputReview'>{amenities?.trim()}</p>
        </div>

        <div className='uploadPropRow'>
          <p className='displayLabel'>Policies:</p>
          <p className='uploadPropInputReview'>{policies?.trim()}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewUpload;