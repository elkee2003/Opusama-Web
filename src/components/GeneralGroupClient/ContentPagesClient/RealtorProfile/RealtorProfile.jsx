import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RealtorProfileComplete from './ProfileComplete/ProfileComplete';
import { DataStore } from 'aws-amplify/datastore';
import { Realtor, Post } from '../../../../models';

const RealtorProfilePageScreen = () => {
  const { realtorId } = useParams();
  const [realtor, setRealtor] = useState(null);
  const [posts, setPosts] = useState([]);

  const fetchRealtor = async () => {
    try {
      if (realtorId) {
        // Fetch the realtor from DataStore
        const foundRealtor = await DataStore.query(Realtor, realtorId);
        setRealtor(foundRealtor);

        // Fetch posts related to the realtor by filtering on realtorId
        const realtorPosts = await DataStore.query(Post, (post) => post.realtorID.eq(realtorId));

        const sortedPosts = realtorPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      }
    } catch (error) {
      console.error('Fetching Realtor error:', error);
    }
  };

  useEffect(() => {
    fetchRealtor();
  }, [realtorId]); 

  if (!realtor) {
    return <div>Loading...</div>; // Show a loading state or an appropriate message
  }

  return (
    <div>
      {realtor && posts.length > 0 ? (
        <RealtorProfileComplete realtor={realtor} posts={posts} />
      ) : (
        <p>Loading realtor profile...</p>
      )}
    </div>
  );
};


export default RealtorProfilePageScreen;