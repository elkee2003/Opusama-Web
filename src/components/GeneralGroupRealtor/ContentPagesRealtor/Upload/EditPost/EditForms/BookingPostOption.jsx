import React, { useState } from 'react';
import Select from 'react-select';
import './BookingPostOption.css'
import { useUploadContext } from '../../../../../../../Providers/RealtorProvider/UploadProvider';
// import './PropertySale.css'; 

/* ---------------- VALIDATION ---------------- */
const validateOption = (option) => {
  if (!option.bookingPostOptionType) return false;

  if (option.bookingPostOptionType === "WALK_IN") {
    return true; // price can be 0
  }

  if (option.bookingPostOptionType === "RESERVATION") {
    return option.optionPrice > 0; // must pay
  }

  if (option.bookingPostOptionType === "TICKET") {
    return option.optionPrice > 0; // must pay
  }

  if (option.bookingPostOptionType === "VOUCHER") {
    return option.optionPrice > 0;
  }

  if (option.bookingPostOptionType === "PICKUP") {
    return option.optionPrice >= 0;
  }

  return true;
};

const BookingPostOption = () => {
  const { options, setOptions, setPrice } = useUploadContext();
  const [errors, setErrors] = useState({});

  /* ---------------- ADD OPTION ---------------- */
  const addOption = () => {
    if (options.length >= 5) {
      alert("You can only add up to 5 booking options.");
      return;
    }

    setOptions([
      ...options,
      {
        bookingPostOptionType: '',
        bookingName: '',
        optionPrice: 0,
        minSpend: null,
      },
    ]);

    setPrice(0); // options pricing overrides main price
  };

  /* ---------------- REMOVE OPTION ---------------- */
  const removeOption = (index) => {
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);

    setErrors(prev => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  /* ---------------- UPDATE OPTION ---------------- */
  const updateOption = (index, field, value) => {
    const updated = [...options];
    updated[index][field] = value;

    // Normalize by booking type
    if (field === "bookingPostOptionType") {
      if (value === "WALK_IN") {
        updated[index].optionPrice = 0;
        updated[index].minSpend = null;
      }

      if (value !== "RESERVATION") {
        updated[index].minSpend = null;
      }
    }

    setOptions(updated);
    setPrice(0); // any option pricing overrides main price

    // Validate immediately
    const isValid = validateOption(updated[index]);
    setErrors(prev => ({
      ...prev,
      [index]: !isValid,
    }));
  };

  return (
    <div>
      <h3>Booking Price Options (optional)</h3>

      {options.map((option, index) => (
        <div key={index} className="optionCard">
          <h4>Option {index + 1}</h4>

          {/* Booking Type */}
          <label>Booking Type</label>
          <select
            value={option.bookingPostOptionType ?? ""}
            onChange={(e) =>
              updateOption(index, "bookingPostOptionType", e.target.value)
            }
          >
            <option value="">Select</option>
            <option value="RESERVATION">Reservation</option>
            <option value="WALK_IN">Walk-in (No booking)</option>
            <option value="PICKUP">Pickup / Takeaway</option>
            <option value="VOUCHER">Voucher</option>
            <option value="TICKET">Ticket</option>
          </select>

          {/* Option Name */}
          <label>Option Name</label>
          <input
            type="text"
            value={option.bookingName ?? ""}
            onChange={(e) =>
              updateOption(index, "bookingName", e.target.value)
            }
            placeholder={
              option.bookingPostOptionType === "RESERVATION"
                ? "e.g. Standard Table, VIP Table"
                : option.bookingPostOptionType === "WALK_IN"
                ? "e.g. Eat-in Service"
                : option.bookingPostOptionType === "PICKUP"
                ? "e.g. Burger Combo"
                : option.bookingPostOptionType === "VOUCHER"
                ? "e.g. ₦10k Food Voucher"
                : option.bookingPostOptionType === "TICKET"
                ? "e.g. Entry Ticket"
                : "Option Name"
            }
          />

          {/* Price */}
          <label>Price (₦)</label>
          <input
            type="number"
            value={option.optionPrice ?? ""}
            onChange={(e) =>
              updateOption(index, "optionPrice", Number(e.target.value))
            }
            min="0"
          />

          {/* Validation Error */}
          {errors[index] && (
            <p className="errorText">
              {option.bookingPostOptionType === "TICKET" ||
              option.bookingPostOptionType === "VOUCHER"
                ? "Price must be greater than ₦0"
                : "Invalid option configuration"}
            </p>
          )}

          {/* Reservation-only */}
          {option.bookingPostOptionType === "RESERVATION" && (
            <>
              <label>Min Spend (₦)</label>
              <input
                type="number"
                value={option.minSpend ?? ""}
                onChange={(e) =>
                  updateOption(index, "minSpend", Number(e.target.value))
                }
                min="0"
              />
            </>
          )}

          {/* Pickup-only */}
          {option.bookingPostOptionType === "PICKUP" && (
            <p>Status: {option.pickupStatus || "Pending"}</p>
          )}

          {/* Remove */}
          <button
            type="button"
            className="removeBtn"
            onClick={() => removeOption(index)}
          >
            Remove
          </button>
        </div>
      ))}

      {/* Add Option */}
      <button
        type="button"
        className="addBtn"
        onClick={addOption}
        disabled={options.length >= 5}
      >
        + Add Another Option
      </button>
    </div>
  );
};

export default BookingPostOption;
