import React, { useState, useEffect } from 'react';
import BookingFullDetails from './Details/BookingDetails';
import { useParams } from 'react-router-dom';

import './DetailedBooking.css'; 
import { DataStore } from "aws-amplify/datastore";
import { Booking, Realtor, Post, BookingPostOptions  } from '../../../../../../models';

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
        alert('Error: Unable to update booking status');
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

    const subscription = DataStore.observe(Booking, booking.id).subscribe(({ opType, element }) => {
      if (opType === 'UPDATE') {
        setBooking(element);
      }
    });

    return () => subscription.unsubscribe();
  }, [booking]);

  if (!booking) {
    return (
      <div className='waitResponseCon'>
        <p className='waitResponse'>Wait for Realtor's Response</p>
      </div>
    );
  }

  return (
    <div>
      <BookingFullDetails 
        booking={booking}   
        realtor={realtor}
        post={post}
        onStatusUpdateChange={updateBookingStatus} 
      />
    </div>
  );
};

export default DetailedBooking;