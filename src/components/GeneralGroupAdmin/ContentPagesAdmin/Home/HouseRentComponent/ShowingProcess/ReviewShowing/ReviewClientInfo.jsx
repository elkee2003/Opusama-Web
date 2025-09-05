import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import ReviewClientShowing from './ReviewClientDetails/ReviewShowing';
import { DataStore } from "aws-amplify/datastore";
import { Post } from '../../../../../../../models';

const ReviewClientInfo = () => {
  const { postId } = useParams(); 
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPost = async () => {
    setIsLoading(true);
    try {
      if (postId) {
        const foundPost = await DataStore.query(Post, postId);
        setPost(foundPost);
      }
    } catch (error) {
      console.error('Error fetching post', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  return (
    <div className="review-client-info-container">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ReviewClientShowing post={post} />
      )}
    </div>
  );
};

export default ReviewClientInfo;