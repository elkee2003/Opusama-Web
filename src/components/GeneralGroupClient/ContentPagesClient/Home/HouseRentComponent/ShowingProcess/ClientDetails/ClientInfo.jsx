import React, { useState, useEffect } from 'react';
import ClientDetails from './Details/ClientDetails';
import { useParams } from 'react-router-dom';
import { DataStore } from "aws-amplify/datastore";
import { Post, BookingPostOptions } from '../../../../../../../models';

const ClientInfo = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPost = async () => {
    setIsLoading(true);
    try {
      if (!postId) return;

      // Fetch the post itself
      const foundPost = await DataStore.query(Post, postId);
      if (!foundPost) {
        console.error("Post not found");
        return;
      }

      // Fetch booking options for this post
      const bookingOptions = await DataStore.query(
        BookingPostOptions,
        (o) => o.postID.eq(postId)
      );

      // Merge into a single object
      setPost({
        ...foundPost,
        bookingOptions,
      });
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
    <div style={{ flex: 1 }}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ClientDetails post={post} />
      )}
    </div>
  );
};

export default ClientInfo;