import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../../../../../../../../../Providers/ClientProvider/AuthProvider';
import { DataStore } from 'aws-amplify/datastore';
import { PostComment, User, Realtor  } from '../../../../../../../../../models';
import { useParams, useNavigate} from "react-router-dom";
import { FaStar, FaRegStar } from 'react-icons/fa';
import '../../../../../TabStyles/ReviewsComments.css';

const UsersComment = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const {authUser, dbUser} = useAuthContext();
  const [usersReviews, setUsersReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [realtors, setRealtors] = useState([]);

  // Fetch all reviews
  const fetchReviews = async () => {
    try {
      const fetchedReviews = await DataStore.query(PostComment, (c) => c.postID.eq(postId));

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

    const subscription = DataStore.observe(PostComment).subscribe(({ opType, element }) => {
      if (element.postID === postId) {
        if (opType === 'INSERT' || opType === 'UPDATE' || opType === 'DELETE') {
          fetchReviews();
          fetchUsers();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [postId]);

  const handleNavigateToReply = () => {
    if(authUser){
      navigate(`/clientcontent/detail_response_post/${postId}`);
    }else{
      alert('Sign In to access')
      navigate('/')
    }
  };

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
        <p className="noReviewsComments">No Comments Yet</p>
      )}

      <div 
            className="writeCommentCon"
            onClick={handleNavigateToReply}
        >
            <p className='writeComment'>Write comment...</p>
        </div>
    </div>
  );
};

export default UsersComment;