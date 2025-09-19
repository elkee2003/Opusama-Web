import React, { useState } from 'react';
import Select from 'react-select';
import './BookingPostOption.css'
import { useUploadContext } from '../../../../../../../Providers/RealtorProvider/UploadProvider';
// import './PropertySale.css'; 

const BookingPostOption = () => {

    const {
        options, setOptions, setPrice
    } = useUploadContext();

    // Add a new empty booking option
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
    };

    // Remove an option by index
    const removeOption = (index) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    // Update a field in a specific option
    const updateOption = (index, field, value) => {
        const updated = [...options];
        updated[index][field] = value;
        setOptions(updated);

        // If user sets optionPrice, reset main price to 0
        if (field === "optionPrice" && value > 0) {
            setPrice(0);
        }
    };

  return (
    <div>
        {/* Booking Name */}
        <h3>Booking Options (opt)</h3>

        {options.map((option, index) => (
            <div key={index} className="optionCard">
                <h4>Option {index + 1}</h4>

                {/* Booking Type */}
                <label>Booking Type</label>
                <select
                    value={option.bookingPostOptionType || ""}
                    onChange={(e) =>
                        updateOption(index, "bookingPostOptionType", e.target.value)
                    }
                >
                    <option value="">Select</option>
                    <option value="RESERVATION">Reservation</option>
                    <option value="VOUCHER">Voucher</option>
                    <option value="PICKUP">Pickup</option>
                </select>

                {/* Shared: Option Name */}
                <label>Option Name</label>
                <input
                type="text"
                value={option.bookingName || ""}
                onChange={(e) => updateOption(index, "bookingName", e.target.value)}
                placeholder={
                    option.bookingPostOptionType === "RESERVATION"
                    ? "e.g. Standard Table, VIP Table, Table of 5"
                    : option.bookingPostOptionType === "VOUCHER"
                    ? "e.g. Entry Ticket, Regular, VIP, Table of 5"
                    : option.bookingPostOptionType === "PICKUP"
                    ? "e.g. Cocktail Pack"
                    : "Option Name"
                }
                />

                {/* Shared: Price */}
                <label>Price (₦)</label>
                <input
                    type="number"
                    value={option.optionPrice || ""}
                    onChange={(e) =>
                        updateOption(index, "optionPrice", Number(e.target.value))
                    }
                    placeholder="Enter price"
                    min={"0"}
                />

                {/* Reservation-specific */}
                {option.bookingPostOptionType === "RESERVATION" && (
                <>
                    <label>Min Spend (₦)</label>
                    <input
                        type="number"
                        value={option.minSpend || ""}
                        onChange={(e) =>
                            updateOption(index, "minSpend", Number(e.target.value))
                        }
                        placeholder="Minimum spend required"
                        min={"0"}
                    />
                </>
                )}

                {/* Pickup-specific */}
                {option.bookingPostOptionType === "PICKUP" && (
                <p>Status: {option.pickupStatus || "Pending"}</p>
                )}

                {/* Remove option */}
                <button
                    type="button"
                    className="removeBtn"
                    onClick={() => removeOption(index)}
                >
                    Remove
                </button>
            </div>
        ))}

        {/* Add button */}
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