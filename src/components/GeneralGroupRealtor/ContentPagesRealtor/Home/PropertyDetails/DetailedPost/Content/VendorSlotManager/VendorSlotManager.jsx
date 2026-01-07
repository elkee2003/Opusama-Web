import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import dayjs from "dayjs";
import { DataStore } from "aws-amplify/datastore";
import { Booking } from "../../../../../../../../models";
import { generateSlotsVendor } from "./SlotGeneratorVendor";

const VendorSlotManager = ({ post }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  // 🔹 Fetch booked slots for selected date
  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedDate) return;
      setLoading(true);
      try {
        const formattedDate = dayjs(selectedDate).format("DD MMMM, YYYY");
        const bookings = await DataStore.query(Booking, (b) =>
          b.and((condition) => [
            condition.PostID.eq(post.id),
            condition.checkInDate.eq(formattedDate),
          ])
        );
        const bookedLabels = bookings.map((b) => b.bookedSessionDuration);
        setBookedSlots(bookedLabels);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [selectedDate, post.id]);

  // 🔹 Generate slots when date changes
  useEffect(() => {
    if (!selectedDate) return;
    const slots = generateSlotsVendor(
      dayjs(selectedDate).format("YYYY-MM-DD"),
      post.openingHour,
      post.closingHour,
      post.sessionDuration,
      post.sessionGap || 0,
      bookedSlots
    );
    setTimeSlots(slots);
  }, [selectedDate, bookedSlots, post]);

  // 🔹 Mark a slot manually (offline booking)
  const handleManualBooking = async (slot) => {
    if (!selectedDate) {
      alert("Please select a date first.");
      return;
    }

    const formattedDate = dayjs(selectedDate).format("DD MMMM, YYYY");

    const confirmMsg = `Mark ${slot.label} on ${formattedDate} as booked for offline guest?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      // Check if the slot is already booked before saving
      const existingBookings = await DataStore.query(Booking, (b) =>
        b.and((condition) => [
          condition.PostID.eq(post.id),
          condition.checkInDate.eq(formattedDate),
          condition.bookedSessionDuration.eq(slot.label),
        ])
      );

      if (existingBookings.length > 0) {
        alert(`Slot ${slot.label} is already booked for ${formattedDate}.`);
        return;
      }

      // 🔹 Save new offline booking
      await DataStore.save(
        new Booking({
          PostID: post.id,
          realtorID: post.realtorID,
          userID: "OFFLINE_BOOKING",
          checkInDate: formattedDate,
          bookedSessionDuration: slot.label,
          isOfflineBooking: true,
          purpose: "Offline manual booking by vendor",
          status: "ACCEPTED", 
        })
      );

      alert(`Slot ${slot.label} has been marked as booked manually.`);
      setBookedSlots((prev) => [...prev, slot.label]);
    } catch (error) {
      console.error("Error saving offline booking:", error);
      alert("Failed to mark slot as booked.");
    }
  };

 
  return (
    <div className="vendorSlotManager">
      <div className="headerWithArrow" onClick={() => setExpanded(!expanded)}>
        <p className="vendorMangeSlotHeader">📅 Manage Booking Slots</p>
        <button className="arrowBtn">
          {expanded ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </button>
      </div>
      
      {expanded && (
        <>
          <p>Select a date to view or block time slots.</p>

          <div style={{ marginBottom: "10px" }}>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              inline
              minDate={new Date()}
            />
          </div>

          {loading && <p>Loading booked slots...</p>}

          {!loading && selectedDate && (
            <div className="slotsGridVendor">
              {timeSlots.length > 0 ? (
                timeSlots.map((slot) => (
                  <button
                    key={slot.startTime}
                    disabled={!slot.available}
                    className={`slotBtn ${slot.available ? "" : "booked"}`}
                    onClick={() => handleManualBooking(slot)}
                  >
                    {slot.label} {slot.available ? "" : "(Booked)"}
                  </button>
                ))
              ) : (
                <p>No slots available for this day.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VendorSlotManager;
