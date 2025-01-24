import React, { useState, useEffect } from "react";
import './DetailedAlert.css'
import { useParams } from "react-router-dom";
import PendingDetailedAlertCom from './Content/Content';
import { DataStore } from 'aws-amplify/datastore';
import { Booking, User } from '../../../../../../models';

const PendingDetailedAlert = () => {
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
        const updatedBooking = await DataStore.save(
          Booking.copyOf(booking, (updated) => {
            updated.status = newStatus;
          })
        );
        setBooking(updatedBooking); // Update local state with new status
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

    const subscription = DataStore.observe(Booking, booking.alertId).subscribe(
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