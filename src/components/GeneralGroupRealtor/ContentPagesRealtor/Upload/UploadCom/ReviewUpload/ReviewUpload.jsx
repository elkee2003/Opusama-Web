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
    capacity,
    eventDateTime,
    eventEndDateTime,
    recurrence,
    eventFrequency,
    dressCode,
    bedrooms,
    bed,
    accommodationParts,
    description,
    timeFrame,
    cautionFee,
    price,
    totalPrice,
    inspectionFee,
    otherFeesName,
    otherFeesPrice,
    otherFeesName2,
    otherFeesPrice2,
    country,
    state,
    fullAddress,
    city,
    media,
    policies,
    amenities,
    isSubscription,
    bookingMode,
    allowMultiple, 
    maxCapacity,
    sessionDuration,
    sessionGap,
    serviceDay,
    openingHour,
    closingHour,
    options,
  } = useUploadContext();

  const formatCurrency = (amount) => Number(amount)?.toLocaleString();

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins === 0 
      ? `${hours} hour${hours > 1 ? 's' : ''}`
      : `${hours} hr ${mins} min`;
  };

  const bookingModeLabels = {
    auto_date: "Automatic Acceptance (Client requires date only)",
    auto_datetime: "Automatic Acceptance (Client requires time frame & date)",
    auto_event: "Automatic Acceptance (Client can book & Pay)"
  };

  return (
    <div className='reviewUploadCon'>
      {/* Media Display */}
      <div className="reviewMediaFullDisplayContainer">
        <div className="mediaDivContainer">
        {media.map((item, index) => (
            <div className="dispalyMediaContainer" key={index}>
              {item.type === 'video' ? (
                <video className="dispalyMedia" controls>
                  <source src={item.uri} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={item.uri} alt={`media-${index}`} className="dispalyMedia" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Data Display */}
      <div className='inputDisplay'>
        {/* Property Type */}
        <div className='uploadPropRow'>
          <p className='displayLabel'>Property Type:</p>
          <p className='uploadPropDetails'>{propertyType}</p>
        </div>

        {/* Property Sub Type */}
        <div className='uploadPropRow'>
          <p className='displayLabel'>Property Sub Type:</p>
          <p className='uploadPropDetails'>{type}</p>
        </div>

        {/* Package Type Name */}
        {packageType && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Type of Package:</p>
            <p className='uploadPropDetails'>{packageType}</p>
          </div>
        )}

        {/* Name of Accommodation */}
        {nameOfType && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Name of Accommodation:</p>
            <p className='uploadPropDetails'>{nameOfType}</p>
          </div>
        )}

        {/* Available Docs */}
        {availableDocs && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Available Documents:</p>
            <p className='uploadPropDetails'>{availableDocs.trim()}</p>
          </div>
        )}

        {/* Address */}
        <div className='uploadPropRow'>
          <p className='displayLabel'>Address:</p>
          <p className='uploadPropDetails'>{fullAddress?.trim()}</p>
        </div>

        {/* City */}
        <div className='uploadPropRow'>
          <p className='displayLabel'>City:</p>
          <p className='uploadPropDetails'>{city}</p>
        </div>

        {/* State */}
        <div className='uploadPropRow'>
          <p className='displayLabel'>State:</p>
          <p className='uploadPropDetails'>{state}</p>
        </div>

        {/* Country */}
        <div className='uploadPropRow'>
          <p className='displayLabel'>Country:</p>
          <p className='uploadPropDetails'>{country}</p>
        </div>

        {/* Price */}
        {options.length === 0 && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Price:</p>
            <p className='uploadPropDetails'>₦{formatCurrency(price)}</p>
          </div>
        )}

        {/* Subscription */}
        <div className='uploadPropRow'>
          <p className='displayLabel'>Subscription:</p>
          <p className='uploadPropDetails'>{isSubscription ? 'Enabled' : 'Disabled'}</p>
        </div>

        {/* Booking Mode acceptance */}
        <div className='uploadPropRow'>
          <p className='displayLabel'>Booking Mode (How booking is accepted):</p>
          <p className='uploadPropDetails'>{(bookingModeLabels[bookingMode]) || "Manual Acceptance"}</p>
        </div>

        {/* Session Duration */}
        {bookingMode !== 'manual' && sessionDuration != null && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Session Duration:</p>
            <p className='uploadPropDetails'>{formatDuration(sessionDuration)}</p>
          </div>
        )}
        {sessionDuration && sessionGap && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Session Gap:</p>
            <p className='uploadPropDetails'>{formatDuration(sessionGap)}</p>
          </div>
        )}
        
        {/* Booking Options */}
        {options && options.length > 0 && (
          <div className="uploadPropRow">
            <p className="displayLabel">Booking Options:</p>
            <div className="uploadPropDetails">
              {options.map((opt, index) => (
                <div key={index} className="optionCard">
                  <p><strong>Type:</strong> {opt.bookingPostOptionType}</p>
                  <p><strong>Name:</strong> {opt.bookingName}</p>
                  <p><strong>Price:</strong> ₦{formatCurrency(opt.optionPrice)}</p>

                  {opt.minSpend && (
                    <p><strong>Min Spend:</strong> ₦{formatCurrency(opt.minSpend)}</p>
                  )}
                  {opt.maxGuests && (
                    <p><strong>Max Guests:</strong> {opt.maxGuests}</p>
                  )}
                  {opt.pickupStatus && (
                    <p><strong>Status:</strong> {opt.pickupStatus}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Opening Hour */}
        {bookingMode !== 'manual' && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Opening Hour:</p>
            <p className='uploadPropDetails'>{openingHour}</p>
          </div>
        )}

        {/* Closing Hour */}
        {bookingMode !== 'manual' && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Closing Hour:</p>
            <p className='uploadPropDetails'>{closingHour}</p>
          </div>
        )}

        {/* Allow Multiple book */}
        {allowMultiple && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Allow Multiple Booking:</p>
            <p className='uploadPropDetails'>Enabled</p>
          </div>
        )}

        {/* Maximum Capacity of tickets */}
        {maxCapacity && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Maximum Capacity:</p>
            <p className='uploadPropDetails'>{maxCapacity}</p>
          </div>
        )}

        {/* Time Frame */}
        {timeFrame && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Time Frame:</p>
            <p className='uploadPropDetails'>{timeFrame}</p>
          </div>
        )}

        {capacity && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Capacity:</p>
            <p className='uploadPropDetails'>{capacity}</p>
          </div>
        )}

        {serviceDay.length > 0 && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Service Day:</p>
            <p className='uploadPropDetails'>{serviceDay.join(", ")}</p>
          </div>
        )}

        {/* Event Start Date & Time */}
        {eventDateTime && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Event Start Date & Time:</p>
            <p className='uploadPropDetails'>
             {new Date(eventDateTime).toLocaleString([], {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </div>
        )}

        {/* Event End Date & Time */}
        {eventEndDateTime && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Event End Date & Time:</p>
            <p className='uploadPropDetails'>
              {new Date(eventEndDateTime).toLocaleString([], {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </div>
        )}

        {/* Event Frequency */}
        {eventFrequency && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Event Frequency:</p>
            <p className='uploadPropDetails'>{eventFrequency}</p>
          </div>
        )}

        {/* Event Recurrence */}
        {recurrence && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Event Recurrence:</p>
            <p className='uploadPropDetails'>{recurrence}</p>
          </div>
        )}

        {dressCode && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Dress Code:</p>
            <p className='uploadPropDetails'>{dressCode}</p>
          </div>
        )}

        {/* Caution Fee */}
        <div className='uploadPropRow'>
          <p className='displayLabel'>Caution Fee:</p>
          <p className='uploadPropDetails'>₦{formatCurrency(cautionFee)}</p>
        </div>

        {inspectionFee && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Inspection Fee:</p>
            <p className='uploadPropDetails'>₦{formatCurrency(inspectionFee)}</p>
          </div>
        )}

        {/* OtherFees 1 */}
        {otherFeesPrice && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>{otherFeesName}:</p>
            <p className='uploadPropDetails'>₦{formatCurrency(otherFeesPrice)}</p>
          </div>
        )}

        {/* OtherFees 2 */}
        {otherFeesPrice2 && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>{otherFeesName2}:</p>
            <p className='uploadPropDetails'>₦{formatCurrency(otherFeesPrice2)}</p>
          </div>
        )}

        {/* Total Price */}
        <div className='uploadPropRow'>
          <p className='displayLabel'>Total Price:</p>
          <p className='uploadPropDetails'>₦{formatCurrency(totalPrice)}</p>
        </div>

        {/* Bedrooms */}
        {bedrooms && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Number of Rooms:</p>
            <p className='uploadPropDetails'>{bedrooms}</p>
          </div>
        )}

        {/* Beds */}
        {bed && (
          <div className='uploadPropRow'>
            <p className='displayLabel'>Number of Beds:</p>
            <p className='uploadPropDetails'>{bed}</p>
          </div>
        )}

        {/* AccommocationParts */}
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

        {/* Description */}
        <div className='uploadPropRow'>
          <p className='displayLabel'>Description:</p>
          <p className='uploadPropDetails'>{description?.trim()}</p>
          {/* <p 
            className='uploadPropDetails' 
            dangerouslySetInnerHTML={{ __html: description?.trim().replace(/\n/g, '<br>') }} 
          /> */}
        </div>

        {/* Amenties */}
        <div className='uploadPropRow'>
          <p className='displayLabel'>Amenities:</p>
          <p className='uploadPropDetails'>{amenities?.trim()}</p>
          {/* <p 
            className='uploadPropDetails' 
            dangerouslySetInnerHTML={{ __html: amenities?.trim().replace(/\n/g, '<br>') }} 
          /> */}
        </div>

        {/* Policies */}
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