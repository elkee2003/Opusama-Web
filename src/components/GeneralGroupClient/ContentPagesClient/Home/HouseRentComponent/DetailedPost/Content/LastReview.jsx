import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { DataStore } from 'aws-amplify/datastore';
import { PostReview, User } from '../../../../../../../models';
import './Content.css'; 

const LastReview = ({ post, dbUser }) => {
  const [usersReviews, setUsersReviews] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch all reviews
  const fetchReviews = async () => {
    try {
      const fetchedReviews = await DataStore.query(PostReview, (c) =>
        c.postID.eq(post?.id)
      );

      // Sort reviews by createdAt in ascending order (oldest first)
      const sortedReviews = fetchedReviews.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      // Get the latest review
      const latestReview = sortedReviews[sortedReviews.length - 1];

      // Enrich the latest review with user data
      if (latestReview) {
        const user = users.find((u) => u.id === latestReview.userID);
        const enrichedReview = {
          ...latestReview,
          userName: user ? user?.firstName : 'Unknown User',
        };

        setUsersReviews([enrichedReview]); // Only set the latest review
      }
    } catch (e) {
      console.error('Error fetching last review', e);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const fetchedUsers = await DataStore.query(User);
      setUsers(fetchedUsers);
    } catch (e) {
      alert('Error fetching users', e.message);
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

    const subscription = DataStore.observe(PostReview).subscribe(
      ({ opType, element }) => {
        if (element.postID === post.id) {
          // Ensure it's for the current post
          if (['INSERT', 'UPDATE', 'DELETE'].includes(opType)) {
            fetchReviews();
            fetchUsers();
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [post?.id]);

  return (
    <div>
      {/* User Reviews */}
      {usersReviews.length > 0 && (
        <div className="lastReviewsContainer">
          {usersReviews.map((item) => (
            <div key={item?.id}>
              <span className="reviewerName">{item?.userName}</span>
              <div className="usersStarContainer">
                {[1, 2, 3, 4, 5].map((index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={index <= item?.rating ? faStar : faStarHalfAlt}
                    size="lg"
                    color="#07021f"
                  />
                ))}
              </div>
              <p className="reviewText">{item?.review}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LastReview;