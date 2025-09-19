import React, { useState, useEffect } from 'react';
import './Form.css'; 
import { IoArrowBack } from "react-icons/io5";
import { Switch } from "@mui/material";
import { useUploadContext } from '../../../../../../../Providers/RealtorProvider/UploadProvider';
import AccommodationDropDown from '../DropDown/AccommodationDropDown/Accommodation';
import CountryDropDown from '../DropDown/CountryDropDown/CountryDropDown';
import PropertySale from '../DropDown/PropertySale/PropertySale';
import Recreation from '../DropDown/Recreation/Recreation';
import NightLife from '../DropDown/NightLife/NightLife';
import BookingPostOption from './BookingPostOption';
import WriteDescription from '../DropDown/Desription/Description';
import OfficeSpace from '../DropDown/OfficeSpace/OfficeSpace';
import CommercialSpace from '../DropDown/CommercialSpace/CommercialSpace';
import EventType from '../DropDown/EventType/EventType';
import FoodDrinks from '../DropDown/FoodDrinks/FoodDrink';
import Venue from '../DropDown/Venue/Venue';
import { useNavigate } from 'react-router-dom';

const Forms = () => {
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const {
    propertyType,
    setServicingDay,
    eventFrequency,
    options,
    setEventDateTime,
    setEventEndDateTime,
    cautionFee,
    setCautionFee,
    otherFeesName, 
    setOtherFeesName,
    otherFeesName2, 
    setOtherFeesName2,
    otherFeesPrice, 
    setOtherFeesPrice,
    otherFeesPrice2, 
    setOtherFeesPrice2,
    price,
    setPrice,
    inspectionFee,
    setInspectionFee,
    totalPrice,
    setTotalPrice,
    vendorCommissionAmount,
    vendorCommissionBreakdown,
    timeFrame,
    setTimeFrame,
    isSubscription, setIsSubscription,
    bookingMode, setBookingMode,
    allowMultiple, setAllowMultiple,
    maxCapacity, setMaxCapacity,
    sessionDuration, setSessionDuration,
    sessionGap, setSessionGap,
    openingHour, setOpeningHour,
    closingHour, setClosingHour,
    errors,
    onValidate,
    media,
  } = useUploadContext();

  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [isCustomGap, setIsCustomGap] = useState(false);

  // Earnings = Value - Commission
  const priceValue = parseFloat(price || 0);
  const priceEarnings = priceValue - vendorCommissionBreakdown.price;

  const inspectionValue = parseFloat(inspectionFee || 0);
  const inspectionEarnings = inspectionValue - vendorCommissionBreakdown.inspection;

  const otherFeesValue = parseFloat(otherFeesPrice || 0);
  const otherFeesEarnings = otherFeesValue - vendorCommissionBreakdown.other1;

  const otherFeesValue2 = parseFloat(otherFeesPrice2 || 0);
  const otherFeesEarnings2 = otherFeesValue2 - vendorCommissionBreakdown.other2;

  const timeOptions = [
    { label: 'Day', value: 'Day' },
    { label: 'Night', value: 'Night' },
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Quarterly', value: 'Quarterly' },
    { label: 'Annually', value: 'Annually' },
  ];

  const goToReview = () => {
    if (onValidate()) {
      navigate('/realtorcontent/uploadproperty');
    }
  };

  useEffect(() => {
    const updatedTotalPrice = 
      parseFloat(price || 0) + 
      parseFloat(cautionFee || 0) + 
      parseFloat(otherFeesPrice || 0) + 
      parseFloat(otherFeesPrice2 || 0);
      
      setTotalPrice(updatedTotalPrice.toFixed(2));
  }, [price, cautionFee, inspectionFee, otherFeesPrice, otherFeesPrice2]);

  // useEffect for manual
  useEffect(() => {
    if (bookingMode === "manual") {
      setSessionDuration(null);
      setOpeningHour(null);
      setClosingHour(null);
    }

  }, [bookingMode, setSessionDuration, setOpeningHour, setClosingHour]);

  // For Recurring
  useEffect (()=>{
    if(eventFrequency === 'recurring'){
      setEventDateTime(null);
      setEventEndDateTime(null);
    }
  }, [eventFrequency])

  useEffect (()=>{
    if(eventFrequency !== 'recurring'){
      setServicingDay([]);
    }
  }, [eventFrequency])

  // useEffect for maxCapacity 
  useEffect(()=>{
    if (!allowMultiple){
      setMaxCapacity(null);
    }
  }, [allowMultiple, maxCapacity])



  return (
    <div className="formUploadCon">
      <h1 className="formHeader">Property Details</h1>

      {/* Back Icon */}
      <button className="formBckBtn" onClick={() => navigate(-1)}>
        <IoArrowBack className="bkIcon" />
      </button>

      <div className="scroll-container">
        <AccommodationDropDown />

        {propertyType === 'Land Sale' && <PropertySale />}

        {propertyType === 'House Sale' && <PropertySale />}

        {propertyType === 'Nightlife' && <NightLife/>}

        {propertyType === 'Recreation' && <Recreation/>}

        {propertyType === 'Commercial Space' && <CommercialSpace/>}

        {propertyType === 'Event' && <EventType/>}

        {propertyType === 'Food & Drinks' && <FoodDrinks/>}

        {propertyType === 'Venue' && <Venue/>}

        {propertyType === 'Office Space' && <OfficeSpace />}

        <div className="general-row">

          {/* Booking Post Options */}
          <BookingPostOption/>

          {/* Subscription Toggle */}
          {(propertyType === 'Recreation' || propertyType === 'Food & Drinks' ) && (
              <div className='subToggle'>
                <span className="formLabel">Offer as Subscription:</span>
                <Switch
                  checked={isSubscription}
                  onChange={(e) => setIsSubscription(e.target.checked)}
                  color='primary'
                />
              </div>
          )}

          {/* Manual Acceptance or Auto */}
          <div className="acceptanceCon">
            <p className="formLabel">Booking Acceptance Type:</p>

            <div className="acceptanceOptions">
              {/* Manual Acceptance */}
              <label className="radioOption">
                <input
                  type="radio"
                  name="acceptance"
                  value="manual"
                  checked={bookingMode === "manual"}
                  onChange={() => setBookingMode("manual")}
                />
                Manually accept
              </label>

              {/* Auto Acceptance */}
              <label className="radioOption">
                <input
                  type="radio"
                  name="acceptance"
                  value="auto"
                  checked={["auto_date", "auto_datetime", "auto_event"].includes(bookingMode)}
                  onChange={() => setBookingMode("auto_date")} 
                />
                Automatically accept
              </label>
            </div>

            {/* Require date only / date & time → shown only if auto */}
            {["auto_date", "auto_datetime", "auto_event"].includes(bookingMode) && (
              <div className="autoOptions">
                {/* Date only */}
                <label className="radioOption">
                  <input
                    type="radio"
                    name="autoMode"
                    value="auto_date"
                    checked={bookingMode === "auto_date"}
                    onChange={() => setBookingMode("auto_date")}
                  />
                  Booking requires date only (e.g. hotel stay)
                </label>

                {/* Date + Time */}
                <label className="radioOption">
                  <input
                    type="radio"
                    name="autoMode"
                    value="auto_datetime"
                    checked={bookingMode === "auto_datetime"}
                    onChange={() => setBookingMode("auto_datetime")}
                  />
                  Booking requires date & time (e.g. serviced pitch)
                </label>

                {/* Fixed Event */}
                <label className="radioOption">
                  <input
                    type="radio"
                    name="autoMode"
                    value="auto_event"
                    checked={bookingMode === "auto_event"}
                    onChange={() => setBookingMode("auto_event")}
                  />
                  Booking doesn't require date nor time (book instantly e.g. event)
                </label>

                {/* Capacity Options */}
                <div className="capacityOptions">
                  <label className='capacityLabel'>
                    <input
                      type="checkbox"
                      checked={allowMultiple}
                      onChange={(e) => setAllowMultiple(e.target.checked)}
                    />
                    {bookingMode === "auto_event"
                      ? "Allow multiple tickets for this event"
                      : "Allow multiple clients to book the same slot"}
                  </label>

                  {allowMultiple && (
                    <input
                      type="number"
                      placeholder="Max capacity (leave empty for unlimited)"
                      value={maxCapacity || ""}
                      onChange={(e) => setMaxCapacity(Number(e.target.value))}
                      className="moneyInput"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {bookingMode === "auto_datetime" && (
            <div className="sessionConfig">
              <label className="formLabel">Session Duration:</label>
              <select
                className='moneyInput'
                value={sessionDuration || ""}
                onChange={(e) => {
                  if (e.target.value === "custom") {
                    setIsCustomDuration(true);
                    setSessionDuration(null); 
                  } else if (e.target.value === "0" || e.target.value === "") {
                    setIsCustomDuration(false);
                    setSessionDuration(null);
                  } else {
                    setIsCustomDuration(false);
                    setSessionDuration(Number(e.target.value)); 
                  }
                }}
              >
                <option value={0}>-- Select duration (optional) --</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1 hr 30 mins</option>
                <option value={120}>2 hours</option>
                <option value="custom">Other (enter manually)</option>
              </select>

              {/* Show input only if user chooses "custom" */}
              {isCustomDuration && (
                <input
                  type="number"
                  placeholder="Enter duration in minutes"
                  className="moneyInput"
                  value={sessionDuration || ""}
                  onChange={(e) => setSessionDuration(Number(e.target.value))}
                />
              )}

              {/* Gap Between Sessions */}
              <div className="sessionGapConfig">
                <label className="formLabel">Gap Between Sessions:</label>
                <select
                  className="moneyInput"
                  value={sessionGap || ""}
                  onChange={(e) => {
                    if (e.target.value === "custom") {
                      setIsCustomGap(true);
                      setSessionGap(null);
                    } else if (e.target.value === "0" || e.target.value === "") {
                      setIsCustomGap(false);
                      setSessionGap(null);
                    } else {
                      setIsCustomGap(false);
                      setSessionGap(Number(e.target.value));
                    }
                  }}
                >
                  <option value={0}>-- No gap --</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value="custom">Other (enter manually)</option>
                </select>

                {/* Show input if custom */}
                {isCustomGap && sessionDuration && (
                  <input
                    type="number"
                    placeholder="Enter gap in minutes"
                    className="moneyInput"
                    value={sessionGap || ""}
                    onChange={(e) => setSessionGap(Number(e.target.value))}
                  />
                )}
              </div>
            </div>
          )}

          {/* Opening & Closing Time */}
          {propertyType !== 'House Rent' && propertyType !== 'House Sale' && propertyType !== 'Land Sale' && propertyType !== 'Student Accommodation' && propertyType !== 'Office Space' && propertyType !== 'Commercial Space' && !(propertyType === 'Event' && eventFrequency !== 'recurring')  && (
            <div className='openingClosingTimeCon'>
              <label className="formLabel">Opening Hour {!sessionDuration && " (Opt)"}:</label>
              <input
                className='moneyInput'
                type="time"
                value={openingHour}
                onChange={(e) => setOpeningHour(e.target.value)}
              />

              <label className="formLabel">Closing Hour {!sessionDuration && " (Opt)"}:</label>
              <input
                className='moneyInput'
                type="time"
                value={closingHour}
                onChange={(e) => setClosingHour(e.target.value)}
              />
            </div>
          )}

          {/* Price */}
          {propertyType !== "Food & Drinks" && options.length === 0 && (
            <div className='moneyCon'>
              <label className="formLabel">Price:</label>
              <input
                className="moneyInput"
                value={price}
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow empty input while typing
                  if (value === '') {
                    setPrice('');
                    return;
                  }

                  // Convert to number and only allow >= 0
                  const num = Number(value);
                  if (num >= 0) {
                    setPrice(num);
                  }
                }}
                placeholder="Price"
                type="number"
                min="0"
              />

              {/* Price Helper text */}
              {!price && price !== 0 && (
                <p className="priceHelperText">
                  If service / listing is free, please enter 0
                </p>
              )}
              
              {/* Display message */}
              {price !== '' && propertyType !== 'House Rent' && propertyType !== 'House Sale' && propertyType !== 'Land Sale' && propertyType !== 'Student Accommodation' && propertyType !== 'Office Space' && propertyType !== 'Commercial Space' && (
                <p className="commissionMsg">
                  You are setting 
                  <span className='displayedValue'> ₦{priceValue.toFixed(2)}</span>,
                  Opusama will take <span className='displayedValue'>₦{vendorCommissionBreakdown.price.toFixed(2)} (10%)</span>.
                    You'll earn <span className='displayedValue'>₦{priceEarnings.toFixed(2)}</span>.
                </p>
              )}
            </div>
          )}

          {/* Rate */}
          {['House Rent', 'Hotel / Shortlet', 'Student Accommodation', 'Office Space', 'Commercial Space', 'Recreation']
          .includes(propertyType) && (
            <div className='timeCon'>
              <label className="formLabel">Charge Per {propertyType === 'Recreation' && <span>(opt)</span>} :</label>
              <select
                className="timeDropdown"
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              >
                <option value="">
                  Select Price interval time
                </option>
                {timeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Caution Fee */}
          {(propertyType !== 'House Sale' && propertyType !== 'Land Sale' && propertyType !== 'Recreation' && propertyType !== 'Nightlife' && propertyType !== 'Event' && propertyType !== 'Food & Drinks') && (
            <div className='moneyCon'>
              <label className="formLabel">Caution Fee:</label>
              <input
                className="moneyInput"
                value={cautionFee}
                onChange={(e) => {
                  const value = e.target.value;
                
                  // Allow empty input while typing
                  if (value === '') {
                    setCautionFee('');
                    return;
                  }

                  // Convert to number and only allow >= 0
                  const num = Number(value);
                  if (num >= 0) {
                    setCautionFee(num);
                  }
                }}
                placeholder="Caution Fee"
                type="number"
                min={"0"}
              />
            </div>
          )}
        </div>

        {/* Inspection Fee */}
        {(propertyType !== 'Hotel / Shortlet' && propertyType !== 'Recreation' && propertyType !== 'Nightlife' && propertyType !== 'Event' && propertyType !== 'Food & Drinks' && propertyType !== 'Venue') && (
          <div className='moneyCon'>
            <label className="formLabel">Inspection Fee:</label>

            <input
              className="moneyInput"
              value={inspectionFee}
              onChange={(e) => {
                const value = e.target.value;
                
                // Allow empty input while typing
                if (value === '') {
                  setInspectionFee('');
                  return;
                }

                // Convert to number and only allow >= 0
                const num = Number(value);
                if (num >= 0) {
                  setInspectionFee(num);
                }
              }}
              placeholder="Inspection Fee (Opt)"
              type="number"
              min={"0"}
            />

            {/* Display message */}
            {inspectionFee && (
              <p className="commissionMsg">
                You are setting 
                <span className='displayedValue'> ₦{inspectionValue.toFixed(2)}</span>,
                 Opusama will take <span className='displayedValue'>₦{vendorCommissionBreakdown.inspection.toFixed(2)} (10%)</span>.
                  You'll earn <span className='displayedValue'>₦{inspectionEarnings.toFixed(2)}</span>.
              </p>
            )}
          </div>
        )}

        {/* Other Fees 1 */}
        {(propertyType !== 'House Sale' && propertyType !== 'Land Sale' && propertyType !== 'Nightlife' && propertyType !== 'Event' && propertyType !== 'Food & Drinks' ) && (
          <div className='moneyCon'>
            <label className="formLabel">Other Fees:</label>
            <textarea
              className="formInput"
              value={otherFeesName}
              onChange={(e) => setOtherFeesName(e.target.value)}
              placeholder="Name of any other fee client pays (Opt)"
            />

            <input
              className="moneyInput"
              value={otherFeesPrice}
              onChange={(e) => {
                const value = e.target.value;
                
                // Allow empty input while typing
                if (value === '') {
                  setOtherFeesPrice('');
                  return;
                }

                // Convert to number and only allow >= 0
                const num = Number(value);
                if (num >= 0) {
                  setOtherFeesPrice(num);
                }
              }}
              placeholder="Amount of other fee (Opt)"
              type="number"
              min={"0"}
            />

            {/* Display message */}
            {otherFeesPrice && (
              <p className="commissionMsg">
                You are setting 
                <span className='displayedValue'> ₦{otherFeesValue.toFixed(2)}</span>,
                 Opusama will take <span className='displayedValue'>₦{vendorCommissionBreakdown.other1.toFixed(2)} (10%)</span>.
                  You'll earn <span className='displayedValue'>₦{otherFeesEarnings.toFixed(2)}</span>.
              </p>
            )}
          </div>
        )}

        {/* Other Fees 2 */}
        {(propertyType !== 'House Sale' && propertyType !== 'Land Sale' && propertyType !== 'Nightlife' && propertyType !== 'Event' && propertyType !== 'Food & Drinks') && (
          <div className='moneyCon'>
            <label className="formLabel">2nd Other Fees:</label>
            <textarea
              className="formInput"
              value={otherFeesName2}
              onChange={(e) => setOtherFeesName2(e.target.value)}
              placeholder="Name of any other 2nd fee client pays (Opt)"
            />

            <input
              className="moneyInput"
              value={otherFeesPrice2}
              onChange={(e) => {
                const value = e.target.value;
                
                // Allow empty input while typing
                if (value === '') {
                  setOtherFeesPrice2('');
                  return;
                }

                // Convert to number and only allow >= 0
                const num = Number(value);
                if (num >= 0) {
                  setOtherFeesPrice2(num);
                }
              }}
              placeholder="Amount of other 2nd fee (Opt)"
              type="number"
              min={"0"}
            />

            {/* Display message */}
            {otherFeesPrice2 && (
              <p className="commissionMsg">
                You are setting 
                <span className='displayedValue'> ₦{otherFeesValue2.toFixed(2)}</span>,
                 Opusama will take <span className='displayedValue'>₦{vendorCommissionBreakdown.other2.toFixed(2)} (10%)</span>.
                  You'll earn <span className='displayedValue'>₦{otherFeesEarnings2.toFixed(2)}</span>.
              </p>
            )}
          </div>
        )}

        <CountryDropDown />
        <WriteDescription />
      </div>

      <p className="formError">{errors}</p>

      {/* Form review btn */}
      <div className='formReviewBtnDiv'>
        <button onClick={goToReview} className="formBtnReview">
          <p className='formBtnReviewTxt'>
            Review
          </p>
        </button>
      </div>
    </div>
  );
};

export default Forms;