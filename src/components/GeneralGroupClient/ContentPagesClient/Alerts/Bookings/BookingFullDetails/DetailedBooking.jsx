import React, { useState, useEffect } from 'react';
import BookingFullDetails from './Details/BookingDetails';
import { useParams } from 'react-router-dom';
import { useBookingShowingContext } from '../../../../../../../Providers/ClientProvider/BookingShowingProvider';
import './DetailedBooking.css'; 
import { DataStore } from "aws-amplify/datastore";
import { Booking, Realtor, Post } from '../../../../../../models';

const DetailedBooking = () => {
  const { bookingId } = useParams();
  const { setCurrentBooking } = useBookingShowingContext();
  const [booking, setBooking] = useState(null);
  const [realtor, setRealtor] = useState(null);
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (booking) {
      setCurrentBooking(booking);
    }

    return () => {
      // 🧹 Clear booking from context when leaving this page
      setCurrentBooking(null);
    };
  }, [booking, setCurrentBooking]);

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
        notification={{ ...booking, realtor, post }} 
        // onStatusChange={updateBookingStatus} 
      />
    </div>
  );
};

export default DetailedBooking;