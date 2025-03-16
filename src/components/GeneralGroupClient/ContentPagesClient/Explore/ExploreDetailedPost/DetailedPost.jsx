import React, { useState, useEffect} from 'react';
import { useParams} from "react-router-dom";
import { DataStore } from "aws-amplify/datastore";
import {Post, Realtor} from '../../../../../models';
import Content from './Content/Content';
import {useProfileContext} from '../../../../../../Providers/ClientProvider/ProfileProvider';
import {useBookingShowingContext} from '../../../../../../Providers/ClientProvider/BookingShowingProvider';

function DetailedPost() {
    const { postId } = useParams();
    const {setPostData} = useProfileContext();
    const {setRealtorContext, setPropertyDetails} = useBookingShowingContext();
    const [post, setPost] = useState(null);
    const [realtor, setRealtor] = useState(null);  
    const [loading, setLoading] = useState(true);

    // Fetch the post data based on the id
    const fetchPost = async () => {
        try {
        if (postId) {
            // Query DataStore for the specific post with the given ID
            const foundPost = await DataStore.query(Post, postId);

            setPostData(foundPost);
            
            if (foundPost) {
            setPost(foundPost);

            // Fetch the related realtor using the realtorID
            const foundRealtor = await DataStore.query(Realtor, foundPost.realtorID);
            setRealtor(foundRealtor); 
            }
        }
        } catch (error) {
        console.error('Error fetching post', error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [postId]);

    useEffect(()=>{
        setRealtorContext(realtor)
        setPropertyDetails(post)
    }, [realtor, post])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!postId) {
    return (
      <div className="no-post-container">
        <h2 className="no-post-text"> No Post Found</h2>
      </div>
    );
  }
    
  return (
    <div>
        <Content  post={post} realtor={realtor}/>
    </div>
  )
}

export default DetailedPost
