import React, { useState, useEffect } from 'react';
import './DetailedAlert.css';
import AcceptedDetailedAlertcom from './Content/Content';
import { useParams } from 'react-router-dom';
import { DataStore } from 'aws-amplify/datastore';
import { Booking, User, Post } from '../../../../../../models';

const AcceptedDetailedAlert = () => {
  const { alertId } = useParams(); 
  const [booking, setBooking] = useState(null);
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [checkedInByUser, setCheckedInByUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBooking = async (alertId) => {
    setIsLoading(true);
    try {
      if (alertId) {
        const foundBooking = await DataStore.query(Booking, alertId);

        if (foundBooking) {
          const foundUser = foundBooking.userID
            ? await DataStore.query(User, foundBooking.userID)
            : null;
          const foundPost = foundBooking.PostID
            ? await DataStore.query(Post, foundBooking.PostID)
            : null;
          const foundCheckedInBy = foundBooking.checkedInByID
          ? await DataStore.query(User, foundBooking.checkedInByID)
          : null;

          setBooking(foundBooking);
          setUser(foundUser);
          setPost(foundPost);
          setCheckedInByUser(foundCheckedInBy);
        } else {
          setBooking(null);
          setPost(null);
          setCheckedInByUser(null);
        }
      }
    } catch (e) {
      alert('Error fetching Booking');
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

             // also update ticketStatus if status requires it
            if (
              newStatus === "CHECKED_IN" ||
              newStatus === "VIEWING" ||
              newStatus === "VISITING"
            ) {
              updated.ticketStatus = "used";
            }
          })
        );
        setBooking(updatedBooking); // Update local state with new status
      } catch (error) {
        alert('Error: Unable to update booking status');
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
        if (opType === 'UPDATE') {
          setBooking(element);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [booking]);

  if (!booking) {
    return (
      <div className="no-alert-container">
        <h2 className="no-alert-text">No Alert Found</h2>
      </div>
    );
  }

  return (
    <div className="accepted-detailed-alert-container">
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>Loading...</h2>
        </div>
      ) : (
        <AcceptedDetailedAlertcom
          notification={{ ...booking, user, post, checkedInByUser }}
          onStatusChange={updateBookingStatus}
        />
      )}
    </div>
  );
};

export default AcceptedDetailedAlert;