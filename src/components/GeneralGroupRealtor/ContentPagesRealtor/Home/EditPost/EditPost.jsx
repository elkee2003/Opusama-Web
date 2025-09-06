import React, { useState, useEffect} from 'react'
import { useParams} from "react-router-dom";
import { DataStore } from "aws-amplify/datastore";
import { Post } from '../../../../../models';
import EditPostContent from './Content/Content';

function EditPost() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postData = await DataStore.query(Post, postId);
                setPost(postData);
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    if (loading) return <p>Loading...</p>;
    if (!post) return <p>Post not found.</p>;
    
  return (
    <div>
      <EditPostContent post={post}/>
    </div>
  )
}

export default EditPost;
