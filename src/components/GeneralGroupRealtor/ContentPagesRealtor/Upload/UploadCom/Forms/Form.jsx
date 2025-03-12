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
// import Shop from '../DropDown/Shop';
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
    timeFrame,
    setTimeFrame,
    errors,
    onValidate,
    media,
  } = useUploadContext();

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
    const updatedTotalPrice = parseFloat(cautionFee || 0) + parseFloat(price || 0);
    setTotalPrice(updatedTotalPrice.toFixed(2));
  }, [cautionFee, price]);

  return (
    <div className="formContainer">
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

        

        {propertyType === 'Office Space' && <OfficeSpace />}

        <div className="general-row">
          <div className='moneyCon'>
            <label className="formLabel">Price:</label>
            <input
              className="moneyInput"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              type="number"
            />
          </div>
          {(propertyType !== 'House Sale' && propertyType !== 'Land Sale' && propertyType !== 'Recreation' && propertyType !== 'Nightlife') && (
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

        {(propertyType !== 'Hotel / Shortlet' && propertyType !== 'Recreation' && propertyType !== 'Nightlife') && (
          <div className='moneyCon'>
            <label className="formLabel">Inspection Fee:</label>
            <input
              className="moneyInput"
              value={inspectionFee}
              onChange={(e) => setInspectionFee(e.target.value)}
              placeholder="Inspection Fee (Opt)"
              type="number"
            />
          </div>
        )}

        {(propertyType !== 'House Sale' && propertyType !== 'Land Sale') && (
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
          </div>
        )}

        {(propertyType !== 'House Sale' && propertyType !== 'Land Sale') && (
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
          </div>
        )}

        {(propertyType !== 'House Sale' && propertyType !== 'Land Sale' && propertyType !== 'Recreation' && propertyType !== 'Nightlife') && (
          <div className='timeCon'>
            <label className="formLabel">Time Frame:</label>
            <select
              className="timeDropdown"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            >
              <option value="" disabled>
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