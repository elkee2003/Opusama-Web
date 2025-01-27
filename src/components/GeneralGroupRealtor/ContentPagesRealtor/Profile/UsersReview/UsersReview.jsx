import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useAuthContext } from '../../../../../../Providers/ClientProvider/AuthProvider';
import { DataStore } from 'aws-amplify/datastore';
import { RealtorReview, User, } from '../../../../../models';
import './UsersReview.css';

const UserReviews = () => {
  const [loading, setLoading] = useState(false);
  const {dbRealtor} = useAuthContext();
  const [usersReviews, setUsersReviews] = useState([]);
  const [users, setUsers] = useState([]);

    // Fetch all reviews
    const fetchReviews = async () => {
        try {
        const fetchedReviews = await DataStore.query(RealtorReview, (c) =>
            c.realtorID.eq(dbRealtor.id)
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
  }, [users, dbRealtor]);

  // useEffect for realtime update
  useEffect(()=>{
      if(!dbRealtor) return;
  
      const subscription = DataStore.observe(RealtorReview).subscribe(({ opType, element }) => {
          if (element.realtorID === dbRealtor.id) { // Ensure it's for the current post
          if (opType === 'INSERT' || opType === 'UPDATE' || opType === 'DELETE') {
              fetchReviews();
              fetchUsers();
          }
          }
      });
      return () => subscription.unsubscribe();
  },[dbRealtor?.id]);

  return (
    <div className='userReviewContainer'>
      <div className='realtorRatingScrollContainer'>
        {usersReviews.length > 0 ? (
          <div className='reviewsContainer'>
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

    </div>
  );
};

export default UserReviews;