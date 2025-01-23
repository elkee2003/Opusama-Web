import React, { useState, useEffect } from 'react';
import './Form.css'; 
import { IoArrowBack } from "react-icons/io5";
import { useUploadContext } from '../../../../../../../Providers/RealtorProvider/UploadProvider';
import AccommodationDropDown from '../DropDown/AccommodationDropDown/Accommodation';
import CountryDropDown from '../DropDown/CountryDropDown/CountryDropDown';
import PropertySale from '../DropDown/PropertySale/PropertySale';
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
        {propertyType === 'Office Space' && <OfficeSpace />}

        <div className="general-row">
          <div>
            <label className="label">Price:</label>
            <input
              className="input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              type="number"
            />
          </div>
          {propertyType !== 'House Sale' && propertyType !== 'Land Sale' && (
            <div>
              <label className="label">Caution Fee:</label>
              <input
                className="input"
                value={cautionFee}
                onChange={(e) => setCautionFee(e.target.value)}
                placeholder="Caution Fee"
                type="number"
              />
            </div>
          )}
        </div>

        {propertyType !== 'Hotel / Shortlet' && (
          <div>
            <label className="label">Inspection Fee:</label>
            <input
              className="input"
              value={inspectionFee}
              onChange={(e) => setInspectionFee(e.target.value)}
              placeholder="Inspection Fee (Opt)"
              type="number"
            />
          </div>
        )}

        {propertyType !== 'House Sale' && propertyType !== 'Land Sale' && (
          <div>
            <label className="label">Time Frame:</label>
            <select
              className="dropdown"
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

      <p className="error">{errors}</p>

      <button onClick={goToReview} className="btn-review">
        Review
      </button>
    </div>
  );
};

export default Forms;