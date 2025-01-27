import React from 'react';
import { useUploadContext } from '../../../../../../../Providers/RealtorProvider/UploadProvider'; 
import'./ReviewUpload.css'; 

const ReviewUpload = () => {
  const {
    propertyType,
    type,
    packageType,
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
      <div className="reviewMediaFullDisplayContainer">
        <div className="mediaDivContainer">
          {media.map((item, index) => (
            <div className="dispalyMediaContainer" key={index}>
              <img src={item.uri} alt={`media-${index}`} className="dispalyMedia" />
            </div>
          ))}
        </div>
      </div>

      {/* Data Display */}
      <div className='inputDisplay'>
        <div className='uploadPropRow'>
          <p className='displayLabel'>Property Type:</p>
          <p className='uploadPropDetails'>{propertyType}</p>
        </div>

        <div className='uploadPropRow'>
          <p className='displayLabel'>Property Sub Type:</p>
          <p className='uploadPropDetails'>{type}</p>
        </div>

        {packageType && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Type of Package:</p>
            <p className='uploadPropDetails'>{packageType}</p>
          </div>
        )}

        {nameOfType && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Name of Accommodation:</p>
            <p className='uploadPropDetails'>{nameOfType}</p>
          </div>
        )}

        {availableDocs && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Available Documents:</p>
            <p className='uploadPropDetails'>{availableDocs.trim()}</p>
          </div>
        )}

        <div className='uploadPropRow'>
          <p className='displayLabel'>Address:</p>
          <p className='uploadPropDetails'>{address?.trim()}</p>
        </div>

        <div className='uploadPropRow'>
          <p className='displayLabel'>City:</p>
          <p className='uploadPropDetails'>{city}</p>
        </div>

        <div className='uploadPropRow'>
          <p className='displayLabel'>State:</p>
          <p className='uploadPropDetails'>{state}</p>
        </div>

        <div className='uploadPropRow'>
          <p className='displayLabel'>Country:</p>
          <p className='uploadPropDetails'>{country}</p>
        </div>

        <div className='uploadPropRow'>
      <p className='displayLabel'>Price:</p>
          <p className='uploadPropDetails'>₦{formatCurrency(price)}</p>
        </div>

        {timeFrame && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Time Frame:</p>
            <p className='uploadPropDetails'>{timeFrame}</p>
          </div>
        )}

        <div className='uploadPropRow'>
          <p className='displayLabel'>Caution Fee:</p>
          <p className='uploadPropDetails'>₦{formatCurrency(cautionFee)}</p>
        </div>

        <div className='uploadPropRow'>
          <p className='displayLabel'>Total Price:</p>
          <p className='uploadPropDetails'>₦{formatCurrency(totalPrice)}</p>
        </div>

        {inspectionFee && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Inspection Fee:</p>
            <p className='uploadPropDetails'>₦{formatCurrency(inspectionFee)}</p>
          </div>
        )}

        {bedrooms && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Number of Rooms:</p>
            <p className='uploadPropDetails'>{bedrooms}</p>
          </div>
        )}

        {bed && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Number of Beds:</p>
            <p className='uploadPropDetails'>{bed}</p>
          </div>
        )}

        {accommodationParts && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Accommodation Parts:</p>
            <p className='uploadPropDetails'>{accommodationParts}</p>
            {/* <p 
              className='uploadPropDetails' 
              dangerouslySetInnerHTML={{ __html: accommodationParts.replace(/\n/g, '<br>') }} 
            /> */}
          </div>
        )}

        <div className='uploadPropRow'>
          <p className='displayLabel'>Description:</p>
          <p className='uploadPropDetails'>{description?.trim()}</p>
          {/* <p 
            className='uploadPropDetails' 
            dangerouslySetInnerHTML={{ __html: description?.trim().replace(/\n/g, '<br>') }} 
          /> */}
        </div>

        <div className='uploadPropRow'>
          <p className='displayLabel'>Amenities:</p>
          <p className='uploadPropDetails'>{amenities?.trim()}</p>
          {/* <p 
            className='uploadPropDetails' 
            dangerouslySetInnerHTML={{ __html: amenities?.trim().replace(/\n/g, '<br>') }} 
          /> */}
        </div>

        <div className='uploadPropRow'>
          <p className='displayLabel'>Policies:</p>
          <p className='uploadPropDetails'>{policies?.trim()}</p>

          {/* Asides adding white-space: pre-wrap; to styles the code under can be used as a standalone */}
          {/* <p 
            className='uploadPropDetails' 
            dangerouslySetInnerHTML={{ __html: policies?.trim().replace(/\n/g, '<br>') }} 
          /> */}
        </div>
      </div>
    </div>
  );
};

export default ReviewUpload;