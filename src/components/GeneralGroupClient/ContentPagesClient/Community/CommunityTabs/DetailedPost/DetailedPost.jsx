import React, { useState, useEffect } from 'react';
import {useParams} from "react-router-dom";
import './DetailedPost.css'; 
import Content from './Content/Content';
import { DataStore } from "aws-amplify/datastore";
import { CommunityDiscussion } from '../../../../../../models';

const DetailedPost = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);


    // Fetch the post data based on the id
    const fetchPost = async () => {
        try {
        if (postId) {
            // Query DataStore for the specific post with the given ID
            const foundPost = await DataStore.query(CommunityDiscussion, postId);

            if (foundPost) {
            setPost(foundPost);

            // Fetch the related realtor using the realtorID
            // const foundRealtor = await DataStore.query(Realtor, foundPost.realtorID);
            // setRealtor(foundRealtor); 
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

    // useEffect(()=>{
    //     setRealtorContext(realtor)
    //     setPropertyDetails(post)
    // }, [realtor, post])
  
  return (
    <div>
      <Content  post={post}/>
    </div>
  );
};

export default DetailedPost;