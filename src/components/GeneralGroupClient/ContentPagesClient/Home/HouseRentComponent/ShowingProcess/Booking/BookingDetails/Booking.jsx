import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; 
import { useBookingShowingContext } from '../../../../../../../../../Providers/ClientProvider/BookingShowingProvider';
import { useNavigate } from 'react-router-dom';
import './Booking.css';
import { AiOutlineArrowRight } from 'react-icons/ai'; 
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css'; 

const Booking = () => {
  const [range, setRange] = useState({
    startDate: null,
    endDate: null,
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const { postPrice, postCautionFee, postOtherFeesPrice, postOtherFeesPrice2, postTotalPrice, setOverAllPrice, setDuration, setCheckInDate, setCheckOutDate } = useBookingShowingContext();

  const navigate = useNavigate();

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setRange({ startDate: start, endDate: end });
  };

  useEffect(() => {
    if (range.startDate && range.endDate) {
      let daysDifference = dayjs(range.endDate).diff(dayjs(range.startDate), 'day');
      daysDifference = daysDifference === 0 ? 1 : daysDifference;

      const formattedCheckInDate = dayjs(range.startDate).format('DD MMMM, YYYY');
      const formattedCheckOutDate = dayjs(range.endDate).format('DD MMMM, YYYY');

      setDuration(daysDifference);
      setCheckInDate(formattedCheckInDate);
      setCheckOutDate(formattedCheckOutDate);

      if (postPrice) {
        // ✅ Sum all the fees together
        const additionalFees = (postCautionFee || 0) + (postOtherFeesPrice || 0) + (postOtherFeesPrice2 || 0);
        let calculatedTotalPrice = daysDifference * postPrice + additionalFees;

        setTotalPrice(calculatedTotalPrice);
      }
    }
  }, [range, postPrice, postCautionFee, postOtherFeesPrice, postOtherFeesPrice2, postTotalPrice]);

  useEffect(() => {
    if (totalPrice) {
      setOverAllPrice(totalPrice);
    }
  }, [totalPrice]);

  const checkDatesSelected = () => {
    if (!range.startDate || !range.endDate) {
      alert('Error: Please select both check-in and check-out dates.');
      return false;
    }
    return true;
  };

  const handleProceed = () => {
    if (!checkDatesSelected()) {
      return
    }

    if (totalPrice === 0) {
      alert('Error: Total price cannot be ₦0. Please go back to accommodation page.');
      return;
    }

    navigate(`/clientcontent/reviewinfo`);
  };

  return (
    <div className="bookingContainer">
      <h1 className="bookingHeader">Check In / Check Out</h1>

      <div className="bookingContent">
        {/* Selected Dates */}
        <div className="selecteDates">
          {range.startDate ? (
            <p className="range">
              <strong>From:</strong> {dayjs(range.startDate).format('DD MMMM, YYYY')}
            </p>
          ) : (
            <p className="selectCheck">Select Check-in date</p>
          )}
          {range.endDate ? (
            <p className="range">
              <strong>To:</strong> {dayjs(range.endDate).format('DD MMMM, YYYY')}
            </p>
          ) : (
            <p className="selectCheck">Select Check-out date</p>
          )}
        </div>

        {/* Calendar */}
        <div className="calendar">
          <DatePicker
            selected={range.startDate}
            onChange={handleDateChange}
            startDate={range.startDate}
            endDate={range.endDate}
            selectsRange
            minDate={new Date()}
            inline
            calendarClassName="custom-calendar" /* Optional custom class */
            wrapperClassName="custom-calendar-wrapper"
          />
        </div>

        {/* Total Price */}
        <div className="priceContainer">
          <p className="priceLabel">Total Price:</p>
          <p className="priceValue">₦{totalPrice?.toLocaleString()}</p>
        </div>
      </div>

      <button className="bookingNxtBtn" onClick={handleProceed}>
        <AiOutlineArrowRight className="bookingNxtIcon" />
      </button>
    </div>
  );
};

export default Booking;