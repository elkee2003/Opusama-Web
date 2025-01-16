import React, { useState, useEffect } from 'react';
import { DataStore } from 'aws-amplify/datastore';
import { PostReview, User } from '../../../../../../../models';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; 
import './Content.css'; 

const UserReviews = ({ post, dbUser }) => {
  const [usersReviews, setUsersReviews] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch all reviews
  const fetchReviews = async () => {
    try {
      const fetchedReviews = await DataStore.query(PostReview, (c) => c.postID.eq(post?.id));

      // Sort reviews by createdAt in ascending order (oldest first)
      const sortedReviews = fetchedReviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      const enrichedReviews = sortedReviews.map((review) => {
        const user = users.find((u) => u.id === review.userID);
        return {
          ...review,
          userName: user ? user.firstName : 'Unknown User',
        };
      });

      setUsersReviews(enrichedReviews);
    } catch (e) {
      console.error('Error fetching reviews', e);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const fetchedUsers = await DataStore.query(User);
      setUsers(fetchedUsers);
    } catch (e) {
      console.error('Error fetching users', e);
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
  }, [users]);

  // useEffect for realtime update
  useEffect(() => {
    if (!post) return;

    const subscription = DataStore.observe(PostReview).subscribe(({ opType, element }) => {
      if (element.postID === post?.id) {
        if (opType === 'INSERT' || opType === 'UPDATE' || opType === 'DELETE') {
          fetchReviews();
          fetchUsers();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [post?.id]);

  return (
    <div className="reviewsContainer">
      {/* User Reviews */}
      {usersReviews.length > 0 ? (
        <>
          <h3 className="rateTxt">Ratings and Reviews:</h3>
          {usersReviews.map((item) => (
            <div key={item?.id} className="reviewItem">
              <h4 className="reviewerName">{item?.userName}</h4>
              <div className="usersStarContainer">
                {[1, 2, 3, 4, 5].map((index) => (
                  <span key={index}>
                    {index <= item.rating ? (
                      <FaStar size={18} color="#07021f" />
                    ) : index - 0.5 <= item.rating ? (
                      <FaStarHalfAlt size={18} color="#07021f" />
                    ) : (
                      <FaRegStar size={18} color="#07021f" />
                    )}
                  </span>
                ))}
              </div>
              <p className="reviewText">{item?.review}</p>
            </div>
          ))}
        </>
      ) : (
        <p className="noReviews">No Reviews Yet</p>
      )}
    </div>
  );
};

export default UserReviews;