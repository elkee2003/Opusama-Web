import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; 
import { useBookingShowingContext } from '../../../../../../../../../Providers/ClientProvider/BookingShowingProvider';
import { useNavigate } from 'react-router-dom';
import './Booking.css';
import { AiOutlineArrowRight } from 'react-icons/ai'; 
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css'; 
import {generateSlots} from './SlotGenerator';


const Booking = () => {
  const [range, setRange] = useState({
    startDate: null,
    endDate: null,
  });

  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [totalPrice, setTotalPrice] = useState(0);
  const { propertyDetails, postPrice, postCautionFee, postOtherFeesPrice, postOtherFeesPrice2, postTotalPrice, setOverAllPrice, setDuration, checkInDate, setCheckInDate, setCheckOutDate, checkOutDate, setBookedSessionDuration } = useBookingShowingContext();

  // console.log('Property Details:', propertyDetails.propertyType)

  // console.log('Property Booking Mode:', propertyDetails.bookingMode)

  // console.log('Property Session Duration:', propertyDetails.sessionDuration)

  const navigate = useNavigate();

  // 🔹 Handle date changes
  const handleDateChange = (dates) => {
    if (propertyDetails.bookingMode === "auto_date" || propertyDetails.bookingMode === "manual") {
      const [start, end] = dates;

      setRange({ startDate: start, endDate: end });
    } else if (propertyDetails.bookingMode === "auto_datetime" ||
    propertyDetails.isSubscription) {
      // only check-in (single date selection)
      setRange({ startDate: dates, endDate: null });
    }
  };

  // const handleDateChange = (dates) => {
  //   const [start, end] = dates;
  //   setRange({ startDate: start, endDate: end });
  // };

  // 🔹 Save check-in / check-out dates
  useEffect(() => {
    if (!propertyDetails || !range.startDate) return;

    const bookingMode = propertyDetails.bookingMode;
    const propertyType = propertyDetails.propertyType;

    const formattedCheckInDate = dayjs(range.startDate).format("DD MMMM, YYYY");

    // Hotel / Shortlet → always save check-in and check-out
    if (propertyType === "Hotel / Shortlet") {
      let daysDifference = 1;

      if (range.endDate) {
        daysDifference = dayjs(range.endDate).diff(dayjs(range.startDate), "day");
        daysDifference = daysDifference === 0 ? 1 : daysDifference;
      }

      const formattedCheckOutDate = range.endDate
        ? dayjs(range.endDate).format("DD MMMM, YYYY")
        : null;

      setDuration(daysDifference);
      setCheckInDate(formattedCheckInDate);
      if (formattedCheckOutDate) setCheckOutDate(formattedCheckOutDate);
    }
    // Other property types → only save check-in
    else if (
      bookingMode === "auto_date" ||
      bookingMode === "auto_datetime" ||
      bookingMode === "manual"
    ) {
      setCheckInDate(formattedCheckInDate);
      setCheckOutDate(null); // clear checkout for non-Hotel types
    }
  }, [range, propertyDetails, setDuration, setCheckInDate, setCheckOutDate]);

   // 🔹 Compute total price (only for Hotel / Shortlet)
  useEffect(() => {
    if (
      range.startDate &&
      (range.endDate || propertyDetails.bookingMode === "auto_datetime") &&
      propertyDetails.propertyType === "Hotel / Shortlet"
    ) {
      let daysDifference = 1;

      if (range.endDate) {
        daysDifference = dayjs(range.endDate).diff(dayjs(range.startDate), "day");
        daysDifference = daysDifference === 0 ? 1 : daysDifference;
      }

      if (postPrice) {
        const additionalFees =
          (postCautionFee || 0) +
          (postOtherFeesPrice || 0) +
          (postOtherFeesPrice2 || 0);

        let calculatedTotalPrice = daysDifference * postPrice + additionalFees;
        setTotalPrice(calculatedTotalPrice);
      }
    }
  }, [ range, postPrice, postCautionFee, postOtherFeesPrice, postOtherFeesPrice2, postTotalPrice, propertyDetails.propertyType, propertyDetails.bookingMode, ]);

  // 🔹 Set overall price only if Hotel / Shortlet
  useEffect(() => {
    if (totalPrice && propertyDetails.propertyType === "Hotel / Shortlet") {
      setOverAllPrice(totalPrice);
    }
  }, [totalPrice, propertyDetails.propertyType, setOverAllPrice]);

  // 🔹 Generate available slots if auto_datetime
  useEffect(() => {
    if (propertyDetails.bookingMode === "auto_datetime" && range.startDate) {
      const bookedSlots = []; // TODO: fetch from DB for that date
      const slots = generateSlots(
        dayjs(range.startDate).format("YYYY-MM-DD"),
        propertyDetails.openingHour,
        propertyDetails.closingHour,
        propertyDetails.sessionDuration,
        propertyDetails.sessionGap,
        bookedSlots
      );
      setTimeSlots(slots);
    }
  }, [range.startDate, propertyDetails]);

  // const checkDatesSelected = () => {
  //   if (!range.startDate || !range.endDate) {
  //     alert('Error: Please select both check-in and check-out dates.');
  //     return false;
  //   }
  //   return true;
  // };

  const handleProceed = () => {
    if (!range.startDate) {
      alert('Error: Please select a date.');
      return;
    }

    if (
      propertyDetails.bookingMode !== "auto_datetime" && 
      !range.endDate && 
      propertyDetails.propertyType === "Hotel / Shortlet"
    ) {
      alert('Error: Please select check-out date.');
      return;
    }

    if (propertyDetails.bookingMode === "auto_datetime" && !selectedSlot) {
      alert('Error: Please select a time slot.');
      return;
    }

    if (propertyDetails.propertyType === "Hotel / Shortlet" && totalPrice === 0) {
      alert('Error: Total price cannot be ₦0. Please go back to accommodation page.');
      return;
    }

    navigate(`/clientcontent/reviewinfo`);
  };

  return (
    <div className="bookingContainer">
      <h1 className="bookingHeader">Booking</h1>

      <div className="bookingContent">
        {/* Selected Dates */}
        {/* <div className="selecteDates">
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
        </div> */}

        <div>
          {checkInDate && <p>Selected date: {checkInDate}</p>}
          {checkOutDate && <p>Selected date: {checkOutDate}</p>}
        </div>

        {/* Calendar */}
        <div className="calendar">
          <DatePicker
            selected={range.startDate}
            onChange={handleDateChange}
            startDate={range.startDate}
            endDate={
              propertyDetails.propertyType === "Hotel / Shortlet" || propertyDetails.isSubscription 
                ? range.endDate 
                : null
            }
            selectsRange={
              (propertyDetails.bookingMode !== "auto_datetime" && propertyDetails.propertyType === "Hotel / Shortlet") || propertyDetails.isSubscription          
            }
            minDate={new Date()}
            inline
            calendarClassName="custom-calendar" 
            wrapperClassName="custom-calendar-wrapper"
          />
        </div>

        {/* Show Slots if auto_datetime */}
        {propertyDetails.bookingMode === "auto_datetime" && (
          <div className="slotsContainer">
            <h3>Select a Time Slot</h3>
            <div className="slotsGrid">
              {timeSlots.map(slot => (
                <button
                  key={slot.startTime}
                  disabled={!slot.available}
                  className={`slotBtn ${selectedSlot?.startTime === slot.startTime ? "selected" : ""}`}
                  onClick={() =>{
                    setSelectedSlot(slot);
                    setBookedSessionDuration(slot);
                  }}
                >
                  {slot.label} {slot.available ? "" : "(Booked)"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Total Price → only show for Hotel / Shortlet */}
        {propertyDetails.propertyType === "Hotel / Shortlet" && (
          <div className="priceContainer">
            <p className="priceLabel">Total Price:</p>
            <p className="priceValue">₦{totalPrice?.toLocaleString()}</p>
          </div>
        )}
      </div>

      <button className="bookingNxtBtn" onClick={handleProceed}>
        <AiOutlineArrowRight className="bookingNxtIcon" />
      </button>
    </div>
  );
};

export default Booking;