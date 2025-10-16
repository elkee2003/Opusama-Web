import React, { useState, useEffect } from "react";
import './DetailedAlert.css'
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../../../../../../../Providers/ClientProvider/AuthProvider";
import PendingDetailedAlertCom from './Content/Content';
import { DataStore } from 'aws-amplify/datastore';
import { Booking, User, Notification } from "../../../../../../../models";

const PendingDetailedAlert = () => {
  const {dbRealtor} = useAuthContext();
  
  const { alertId } = useParams(); // Replaces useLocalSearchParams
  const [booking, setBooking] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBooking = async (alertId) => {
    setIsLoading(true);
    try {
      if (alertId) {
        const foundBooking = await DataStore.query(Booking, alertId);

        if (foundBooking) {
          const foundUser = await DataStore.query(User, foundBooking.userID);
          setBooking(foundBooking);
          setUser(foundUser);
        } else {
          setBooking(null);
        }
      }
    } catch (e) {
      console.error("Error fetching Booking", e);
      alert("Error fetching Booking");
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (newStatus) => {
    if (booking) {
      try {

        // 1️⃣ Update the booking status
        const updatedBooking = await DataStore.save(
          Booking.copyOf(booking, (updated) => {
            updated.status = newStatus;
          })
        );
        setBooking(updatedBooking); // Update local state with new status

        // 2️⃣ Build message
        const statusMessages = {
          ACCEPTED: `Your opusing for ${updatedBooking.propertyType} (${updatedBooking.accommodationType}) has been accepted.`,
          OCCUPIED: `Unfortunately, your opusing for ${updatedBooking.propertyType} (${updatedBooking.accommodationType}) is unavailable. Please try another.`,
          DENIED: `Your opusing request for ${updatedBooking.propertyType} (${updatedBooking.accommodationType}) has been denied.`,
          VIEWING: `Your opusing ${updatedBooking.accommodationType} status has been updated to Viewing.`,
          VIEWED: `Your opusing ${updatedBooking.accommodationType} has been marked as Viewed.`,
          SOLD: `The property ${updatedBooking.accommodationType} has been sold.`,
          PAID: `Your opusing ${updatedBooking.accommodationType} has been marked as Paid.`,
        };

        const message = statusMessages[newStatus] || `Opusing status updated to ${newStatus}.`;

        // 3️⃣ Notify the actual booking owner
        await DataStore.save(
          new Notification({
            creatorID: booking.realtorID,
            recipientID: booking.userID, // The person for whom the booking was made
            recipientType: "BOOKING_CLIENT",
            type: "BOOKING_STATUS_UPDATE",
            entityID: booking.id,
            message,
            read: false,
          })
        );
        // 4️⃣ If someone else booked it (opused on their behalf), notify them too
        if (booking.opusedBy && booking.opusedBy !== booking.userID) {

          const altMessages = {
            ACCEPTED: `Your opus for another was accepted (${updatedBooking.accommodationType}).`,
            OCCUPIED: `Your opus for another is unavailable (${updatedBooking.accommodationType}).`,
            DENIED: `Your opus for another was denied (${updatedBooking.accommodationType}).`,
            VIEWING: `Your opus for another is set to Viewing (${updatedBooking.accommodationType}).`,
            VIEWED: `Your opus for another was Viewed (${updatedBooking.accommodationType}).`,
            SOLD: `The property you opused for another was sold (${updatedBooking.accommodationType}).`,
            PAID: `Your opus for another was marked as Paid (${updatedBooking.accommodationType}).`,
          };
          await DataStore.save(
            new Notification({
              creatorID: booking.realtorID,
              recipientID: booking.opusedBy, // The dbUser who made the booking
              recipientType: "BOOKING_CLIENT",
              type: "BOOKING_STATUS_UPDATE",
              entityID: booking.id,
              message: altMessages[newStatus] || `Booking you made for another updated to ${newStatus}.`,
              read: false,
            })
          );
        }
            
      } catch (error) {
        console.error("Error updating booking status", error);
        alert("Unable to update booking status");
      }
    }
  };

  useEffect(() => {
    fetchBooking(alertId);
  }, [alertId]);

  useEffect(() => {
    if (!booking) {
      return;
    }

    const subscription = DataStore.observe(Booking, booking.id).subscribe(
      ({ opType, element }) => {
        if (opType === "UPDATE") {
          setBooking(element);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [booking]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="no-alert-container">
        <h2 className="no-alert-text">No Alert Found</h2>
      </div>
    );
  }

  return (
    <div className="pending-detailed-alert-container">
      <PendingDetailedAlertCom
        notification={{ ...booking, user }}
        onStatusChange={updateBookingStatus}
      />
    </div>
  );
};

export default PendingDetailedAlert;