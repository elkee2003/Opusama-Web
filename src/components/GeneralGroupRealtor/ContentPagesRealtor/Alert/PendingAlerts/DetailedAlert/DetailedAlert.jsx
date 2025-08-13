import React, { useState, useEffect } from "react";
import './DetailedAlert.css'
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../../../../../../Providers/ClientProvider/AuthProvider";
import PendingDetailedAlertCom from './Content/Content';
import { DataStore } from 'aws-amplify/datastore';
import { Booking, User, Notification } from '../../../../../../models';

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

        // 2️⃣ Determine who gets the notification
        // Example: realtor updates -> send to client
        const recipientID = user.id; 
        const recipientType = 'BOOKING_CLIENT';

        // 3️⃣ Build a message based on status
        const statusMessages = {
          ACCEPTED: `Your booking for ${updatedBooking.propertyType} (${updatedBooking.accommodationType}) has been accepted.`,
          OCCUPIED: `Unfortunately, your booking for ${updatedBooking.propertyType} (${updatedBooking.accommodationType}) is unavailable. Please try another.`,
          DENIED: `Your booking request for ${updatedBooking.propertyType} (${updatedBooking.accommodationType}) has been denied.`,
          
          VIEWING: `Your booking ${updatedBooking.accommodationType} status has been updated to Viewing.`,
          VIEWED: `Your booking ${updatedBooking.accommodationType} has been marked as Viewed.`,
          SOLD: `The property ${updatedBooking.accommodationType} has been sold.`,
          PAID: `Your booking ${updatedBooking.accommodationType} has been marked as Paid.`,
        };

        const message = statusMessages[newStatus] || `Booking status updated to ${newStatus}.`;
        
         // 4️⃣ Save the notification
        await DataStore.save(
          new Notification({
            creatorID: booking.realtorID, 
            recipientID: recipientID,
            recipientType: recipientType,
            type: 'BOOKING_STATUS_UPDATE',
            entityID: booking.id,
            message: message,
            read: false,
          })
        );
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