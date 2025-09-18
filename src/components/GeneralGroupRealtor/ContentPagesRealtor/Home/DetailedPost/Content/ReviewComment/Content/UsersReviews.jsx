import React, { useState, useEffect } from 'react';
import './UserReview.css';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { DataStore } from 'aws-amplify/datastore';
import { PostReview, User } from '../../../../../../../../models';
import { useParams} from "react-router-dom";
import { FaStar, FaRegStar } from 'react-icons/fa';
// import '../../../../../TabStyles/ReviewsComments.css';

const UserReviews = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [usersReviews, setUsersReviews] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch all reviews
  const fetchReviews = async () => {
    try {
      const fetchedReviews = await DataStore.query(PostReview, (c) => c.postID.eq(postId));

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
    if (!postId) return;

    const subscription = DataStore.observe(PostReview).subscribe(({ opType, element }) => {
      if (element.postID === postId) {
        if (opType === 'INSERT' || opType === 'UPDATE' || opType === 'DELETE') {
          fetchReviews();
          fetchUsers();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [postId]);

  return (
    <div className="reviewsContainer">
      {/* Back button */}
      <button 
        className='backRealtorPostDetailBtnCon'
        onClick={() => navigate(`/realtorcontent/postdetails/${postId}`)}
    >
      <IoMdArrowRoundBack 
        className='realtorPostDetailBtnIcon'
      />
    </button>
      {/* User Reviews */}
      {usersReviews.length > 0 ? (
        <>
          {usersReviews.map((item) => (
            <div key={item?.id} className="reviewItem">
              <h4 className="reviewerName">{item?.userName}</h4>
              <div className="usersStarContainer">
                {[1, 2, 3, 4, 5].map((index) => (
                  // Use FaStar for filled stars and FaRegStar for empty stars
                  index <= item?.rating ? (
                    <FaStar key={index} size={20} color="#07021f" />
                  ) : (
                    <FaRegStar key={index} size={20} color="#07021f" />
                  )
                ))}
              </div>
              <p className="reviewText">{item?.review}</p>
            </div>
          ))}
        </>
      ) : (
        <p className="noReviewsComments">No Reviews Yet</p>
      )}
    </div>
  );
};

export default UserReviews;