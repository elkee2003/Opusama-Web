import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataStore } from 'aws-amplify';
import { Realtor, Post } from '@/src/models';
import PostFeed from '../PostFeed';
import './PostList.css'; // Import the corresponding CSS file for styles

const PostList = () => {
  const [realtorPosts, setRealtorPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRealtorsAndPosts = async () => {
    try {
      setLoading(true);

      const realtors = await DataStore.query(Realtor);

      const allPosts = await Promise.all(
        realtors.map(async (realtor) => {
          const posts = await DataStore.query(Post, (p) =>
            p.and((p) => [
              p.realtorID.eq(realtor.id),
              p.available.eq(true),
            ])
          );
          const filteredPosts = posts.filter((post) => post.propertyType === 'House Rent');

          return filteredPosts.map((post) => ({
            ...post,
            realtorId: realtor.id,
            firstName: realtor.firstName,
            lastName: realtor.lastName,
            email: realtor.email,
            profilepic: realtor.profilePic,
            phoneNumber: realtor.phoneNumber,
          }));
        })
      );

      const flatPosts = allPosts.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRealtorPosts(flatPosts);
    } catch (error) {
      console.error('Error fetching realtors and posts', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRealtorsAndPosts();

    const subscription = DataStore.observe(Post).subscribe(({ opType }) => {
      if (opType === 'UPDATE') {
        fetchRealtorsAndPosts();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRealtorsAndPosts();
  };

  return (
    <div className="post-list-container">
        <button 
            className="search-bar"
            onClick={()=> navigate("/search/housesearch")}
        >
            <i className="fa fa-search" aria-hidden="true"></i>
            <span className="search-btn-text">Search for Houses</span>
        </button>

        {realtorPosts && realtorPosts.length > 0 ? (
            <div className="post-list">
            {realtorPosts.map((post) => (
                <PostFeed key={post.id} post={post} />
            ))}
            </div>
        ) : (
            <p className="no-listings">No House listings</p>
        )}

        <button
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing || loading}
        >
            {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
    </div>
  );
};

export default PostList;