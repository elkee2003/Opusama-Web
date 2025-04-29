import React, { useState, useEffect } from 'react';
import BookingFullDetails from './Details/BookingDetails';
import { useParams } from 'react-router-dom';
import { DataStore } from "aws-amplify/datastore";
import { Booking, Realtor, Post } from '../../../../../../models';

const DetailedBooking = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [realtor, setRealtor] = useState(null);
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBooking = async (bookingId) => {
    setIsLoading(true);
    try {
      if (bookingId) {
        const foundBooking = await DataStore.query(Booking, bookingId);

        if (foundBooking) {
          // Fetch associated realtor
          const foundRealtor = await DataStore.query(Realtor, foundBooking.realtorID);

          // Fetch associated post
          const foundPost = await DataStore.query(Post, foundBooking.PostID);

          setBooking(foundBooking);
          setRealtor(foundRealtor);
          setPost(foundPost);
        } else {
          setBooking(null);
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
          })
        );
        setBooking(updatedBooking); // Update local state with new status
      } catch (error) {
        alert('Unable to update booking status');
      }
    }
  };

  useEffect(() => {
    fetchBooking(bookingId);
  }, [bookingId]);

  useEffect(() => {
    if (!booking) {
      return;
    }

    const subscription = DataStore.observe(Booking, booking.bookingId).subscribe(({ opType, element }) => {
      if (opType === 'UPDATE') {
        setBooking(element);
      }
    });

    return () => subscription.unsubscribe();
  }, [booking]);

  if (!booking) {
    return (
      <div style={{ marginTop: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#afadad' }}>Wait for Realtor's Response</p>
      </div>
    );
  }

  return (
    <div>
      <BookingFullDetails 
        notification={{ ...booking, realtor, post }} 
        onStatusChange={updateBookingStatus} 
      />
    </div>
  );
};

export default DetailedBooking;