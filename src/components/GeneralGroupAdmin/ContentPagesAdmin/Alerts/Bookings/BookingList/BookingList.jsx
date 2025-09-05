import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import BookingSingle from "../BookingSingle/BookingSingle";
import { useAuthContext } from "../../../../../../../Providers/ClientProvider/AuthProvider";
import { DataStore } from "aws-amplify/datastore";
import { Booking, Realtor, Post } from "../../../../../../models";
import "./BookingList.css";

const BookingList = () => {
  const { dbUser, authUser } = useAuthContext();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(()=>{
      if(authUser){
        if(!dbUser){
          alert(
              'Kindly fill in your data to access pages. Thank you.'
          );
          navigate('/clientcontent/profile')
        }else if (!dbUser.username) {
          alert('Please fill in your username to proceed.');
          navigate('/clientcontent/editprofile');
        }
      };
      
  },[dbUser])

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Fetch bookings for the current user
      const userBookings = await DataStore.query(Booking, (booking) =>
        booking.userID.eq(dbUser.id)
      );

      // Filter out bookings with the "REMOVED" status
      const filteredBookings = userBookings.filter(
        (booking) => booking.status !== "REMOVED_CLIENT"
      );

      // Sort bookings by creation date in descending order
      const sortedBookings = filteredBookings.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Add realtor and post details to each booking
      const bookingsWithDetails = await Promise.all(
        sortedBookings.map(async (booking) => {
          // Fetch associated realtor
          const realtor = booking.realtorID
            ? await DataStore.query(Realtor, (r) => r.id.eq(booking.realtorID))
            : null;

          // Fetch associated post
          const post = booking.PostID
            ? await DataStore.query(Post, (p) => p.id.eq(booking.PostID))
            : null;

          return {
            ...booking,
            realtor: realtor ? realtor[0] : null,
            post: post ? post[0] : null,
          };
        })
      );
      setBookings(bookingsWithDetails);
    } catch (e) {
      <p>Error fetching booking</p>
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const bookingToUpdate = await DataStore.query(Booking, bookingId);
      if (bookingToUpdate) {
        await DataStore.save(
          Booking.copyOf(bookingToUpdate, (updated) => {
            updated.status = newStatus;
          })
        );
      }
    } catch (e) {
      console.error("Error updating booking status:", e);
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      const bookingToDelete = await DataStore.query(Booking, bookingId);
      if (bookingToDelete && bookingToDelete.status !== "ACCEPTED") {
        await DataStore.delete(bookingToDelete);
      }
    } catch (e) {
      console.error("Error deleting order", e);
    }
  };

  useEffect(() => {
    fetchBookings();

    const subscription = DataStore.observe(Booking).subscribe(({ opType }) => {
      if (opType === "INSERT" || opType === "UPDATE" || opType === "DELETE") {
        fetchBookings();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };
  
//   No AuthUse display
    if (!authUser) {
        return (
        <div className='mainContainer'>
            <p className='emptyText'>Booking List</p>

            <p className="emptyTextWriteUp">Cannot access, kindly sign In</p>
            <div className='emptyBtnCon'>
                <button className='emptyBtnTxt' onClick={() => navigate('/?section=signin')}>
                    Sign In
                </button>
            </div>
        </div>
        );
    } 

  return (
    <div className='bookingTabContainer'>
      <h1 className='header'>Bookings</h1>

      {loading ? (
        <div className='loader'>Loading...</div>
      ) : bookings.length === 0 ? (
        <div className='noBookingsCon'>
          <span className='noBookings'>No Bookings</span>
        </div>
      ) : (
        <div className='list'>
          {bookings.map((item) => (
            <BookingSingle
              key={item.id}
              booking={item}
              onDelete={() => deleteBooking(item.id)}
              onUpdateStatus={updateBookingStatus}
            />
          ))}
        </div>
      )}

      <button onClick={handleRefresh} className='refreshButton'>
            {refreshing ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  );
};

export default BookingList;