import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useAuthContext } from '../../../../../../../Providers/ClientProvider/AuthProvider';
import { DataStore } from 'aws-amplify/datastore';
import { RealtorReview, User, Booking } from '../../../../../../models';
import './UsersReview.css';

const UserReviews = ({ realtor }) => {
  const {dbUser} = useAuthContext();
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [usersReviews, setUsersReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const userBookings = await DataStore.query(Booking, (booking) =>
        booking.and((b) => [b.realtorID.eq(realtor?.id), b.userID.eq(dbUser?.id)])
      );
      setBookings(userBookings);
    } catch (e) {
      alert('Error fetching bookings: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
      fetchBookings();
  },[realtor?.id, dbUser?.id])

  const handleRating = (rating) => setUserRating(rating);

  const saveReview = async () => {
    if (!review || userRating === 0) {
      alert('Incomplete: Please provide a rating and review.');
      return;
    }

    setLoading(true);
    try {
      const existingReview = await DataStore.query(RealtorReview, (c) =>
        c.and((c) => [c.realtorID.eq(realtor.id), c.userID.eq(dbUser.id)])
      );

      if (existingReview.length > 0) {
        await DataStore.save(
          RealtorReview.copyOf(existingReview[0], (updated) => {
            updated.rating = userRating;
            updated.review = review;
          })
        );
        alert('Your review has been updated.');
      } else {
        await DataStore.save(
          new RealtorReview({
            realtorID: realtor.id,
            userID: dbUser.id,
            rating: userRating,
            review: review,
          })
        );
        alert('Your review has been submitted.');
      }

      setUserRating(0);
      setReview('');
    } catch (e) {
      console.error('Error saving review', e);
      alert('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dbUser's review
  const fetchUserReview = async () => {
    try {
      const userReview = await DataStore.query(RealtorReview, (c) =>
        c.and((c) => [c.realtorID.eq(realtor.id), c.userID.eq(dbUser.id)])
      );
      if (userReview.length > 0) {
        setUserRating(userReview[0].rating);
        setReview(userReview[0].review);
      }
    } catch (e) {
      console.error('Error fetching user review', e);
    }
  };

  // useEffect for Dbuser already existing review
  useEffect(() => {
      fetchUserReview();
  }, [realtor.id, dbUser.id]);

    // Fetch all reviews
    const fetchReviews = async () => {
        try {
        const fetchedReviews = await DataStore.query(RealtorReview, (c) =>
            c.realtorID.eq(realtor.id)
        );

        // Sort reviews by createdAt in ascending order (oldest first)
        const sortedReviews = fetchedReviews.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        const enrichedReviews = sortedReviews.map((review) => {
            const user = users.find((u) => u.id === review.userID);
            return {
                ...review,
                userName: user ? user.firstName : "Unknown User",
            };
        });

        setUsersReviews(enrichedReviews);
        } catch (e) {
        console.error("Error fetching reviews", e);
        }
    };

    // Fetch users
    const fetchUsers = async () => {
    try {
      const fetchedUsers = await DataStore.query(User);
      setUsers(fetchedUsers);
    } catch (e) {
      alert('Error fetching users: ' + e.message);
    }
  };

  // Fetch users when component mounts
  useEffect(() => {
      fetchUsers();
  }, []);

  // useEffect for Reviews
  useEffect(() => {
      if (users.length > 0) {
      fetchReviews();
      }
  }, [users, realtor]);

  // useEffect for realtime update
  useEffect(()=>{
      if(!realtor) return;
  
      const subscription = DataStore.observe(RealtorReview).subscribe(({ opType, element }) => {
          if (element.realtorID === realtor.id) { // Ensure it's for the current post
          if (opType === 'INSERT' || opType === 'UPDATE' || opType === 'DELETE') {
              fetchReviews();
              fetchUsers();
              fetchUserReview();
              fetchBookings();
          }
          }
      });
  
      return () => subscription.unsubscribe();
  },[realtor.id]);

  const allowedStatuses = ['VIEWING', 'CHECKED_IN', 'VISITING', 'VIEWED', 'CHECKED_OUT', 'VISITED', 'SOLD', 'REMOVED_CLIENT', 'REMOVED_REALTOR'];
  const canReview = bookings.some((booking) => allowedStatuses.includes(booking.status));

  return (
    <div className='userReviewContainer'>
      <div className='realtorRatingScrollContainer'>
        {usersReviews.length > 0 ? (
          <div className='realtorReviewsContainer'>
            <h3>Ratings and Reviews:</h3>
            {usersReviews.map((item) => (
              <div key={item?.id} className='reviewItem'>
                <h4 className='reviewerName'>{item.userName}</h4>
                <div className='usersStarContainer'>
                  {[1, 2, 3, 4, 5].map((index) => (
                      index <= item?.rating ? (
                          <FaStar key={index} size={20} color="#07021f" />
                      ) : (
                          <FaRegStar key={index} size={20} color="#07021f" />
                      )
                  ))}
                </div>
                <p className='reviewText'>{item.review}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className='noReviews'>No Reviews Yet</p>
        )}
      </div>

      {canReview && (
        <div className='reviewSection'>
          <div className='rateContainer'>
            <div className='starContainer'>
              {[1, 2, 3, 4, 5].map((index) => (
                  <button key={index} onClick={() => handleRating(index)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      {index <= userRating ? (
                      <FaStar size={24} color="#07021f" />
                      ) : (
                      <FaRegStar size={24} color="#07021f" />
                      )}
                  </button>
              ))}
            </div>
            <textarea
              className='realtorReviewInput'
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write Review"
            />
          </div>

          <button
            className='submitReviewBtn'
            onClick={saveReview}
            disabled={loading}
          >
            <p className='realtorSubmitReviewTxt'>
              {loading ? 'Submitting...' : 'Submit Review'}
            </p>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserReviews;