import React, { useState, useEffect } from 'react';
import './Form.css'; 
import { IoArrowBack } from "react-icons/io5";
import { useUploadContext } from '../../../../../../../Providers/RealtorProvider/UploadProvider';
import AccommodationDropDown from '../DropDown/AccommodationDropDown/Accommodation';
import CountryDropDown from '../DropDown/CountryDropDown/CountryDropDown';
import PropertySale from '../DropDown/PropertySale/PropertySale';
import Recreation from '../DropDown/Recreation/Recreation';
import NightLife from '../DropDown/NightLife/NightLife';
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
    errors,
    onValidate,
    media,
  } = useUploadContext();

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
    { label: 'Night', value: 'Night' },
    { label: 'Week', value: 'Week' },
    { label: 'Month', value: 'Month' },
    { label: 'Year', value: 'Year' },
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

          {/* Price */}
          <div className='moneyCon'>
            <label className="formLabel">Price:</label>
            <input
              className="moneyInput"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              type="number"
            />
            
            {/* Display message */}
            {price && propertyType !== 'House Rent' && propertyType !== 'House Sale' && propertyType !== 'Land Sale' && propertyType !== 'Student Accommodation' && propertyType !== 'Office Space' && propertyType !== 'Commercial Space' && (
              <p className="commissionMsg">
                You are setting 
                <span className='displayedValue'> ₦{priceValue.toFixed(2)}</span>,
                 Opusama will take <span className='displayedValue'>₦{vendorCommissionBreakdown.price.toFixed(2)} (10%)</span>.
                  You'll earn <span className='displayedValue'>₦{priceEarnings.toFixed(2)}</span>.
              </p>
            )}
          </div>

          {/* Caution Fee */}
          {(propertyType !== 'House Sale' && propertyType !== 'Land Sale' && propertyType !== 'Recreation' && propertyType !== 'Nightlife' && propertyType !== 'Event' && propertyType !== 'Food & Drinks') && (
            <div className='moneyCon'>
              <label className="formLabel">Caution Fee:</label>
              <input
                className="moneyInput"
                value={cautionFee}
                onChange={(e) => setCautionFee(e.target.value)}
                placeholder="Caution Fee"
                type="number"
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
              onChange={(e) => setInspectionFee(e.target.value)}
              placeholder="Inspection Fee (Opt)"
              type="number"
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
              onChange={(e) => setOtherFeesPrice(e.target.value)}
              placeholder="Amount of other fee (Opt)"
              type="number"
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
              onChange={(e) => setOtherFeesPrice2(e.target.value)}
              placeholder="Amount of other 2nd fee (Opt)"
              type="number"
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

        {(propertyType !== 'House Sale' && propertyType !== 'Land Sale' && propertyType !== 'Nightlife') && (
          <div className='timeCon'>
            <label className="formLabel">Time Frame:</label>
            <select
              className="timeDropdown"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            >
              <option value="">
                Select Time Frame
              </option>
              {timeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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