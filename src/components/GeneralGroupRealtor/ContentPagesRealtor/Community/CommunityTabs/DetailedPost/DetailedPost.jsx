import React, { useState, useEffect } from 'react';
import {useParams} from "react-router-dom";
import './DetailedPost.css'; 
import Content from './Content/Content';
import { DataStore } from "aws-amplify/datastore";
import { CommunityDiscussion, CommunityReply, CommunityLike, Realtor, User } from '../../../../../../models';

const DetailedPost = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch the post data based on the id
    const fetchPost = async () => {
      try {
        setLoading(true);

        if (!postId) return;

        // Query DataStore for the specific post with the given ID

        const foundPost = await DataStore.query(CommunityDiscussion, postId);

        if (!foundPost) {
            console.error("Post not found");
            return;
        }

        // Fetch Realtors and Users
        const realtors = await DataStore.query(Realtor); 

        const users = await DataStore.query(User);

        // Fetch instigator details
        const instigator = realtors.find((r) => r.id === foundPost.instigatorID) || 
        users.find((u) => u.id === foundPost.instigatorID);

        // Fetch replies related to this post
        const replies = (await DataStore.query(CommunityReply, (r) => r.communitydiscussionID.eq(foundPost.id))) || [];

        // Sort replies from oldest to newest
        const sortedReplies = replies.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );


        // Count comments and likes
        const numComments = replies.filter(reply => reply.comment && reply.comment.trim() !== "").length;

        const totalLikes = replies.reduce((sum, reply) => sum + (reply.like || 0), 0);

        // Fetch commenter details for each reply
        const repliesWithCommenters = await Promise.all(
          sortedReplies.map(async (reply) => {
            const commenter = realtors.find((r) => r.id === reply.commenterID) || users.find((u) => u.id === reply.commenterID);

            return {
              ...reply,
              commenterName: commenter ? commenter.firstName : "Unknown",
              commenterUsername: commenter?.username || "unknown",
              commenterProfilePic: commenter ? commenter.profilePic : null,
            };
          })
        );
        setPost({
          ...foundPost,
          creatorOfPostID: instigator?.id,
          instigatorName: instigator ? instigator.firstName : 'Unknown',
          instigatorUsername: instigator?.username || "unknown",
          isVerified: instigator?.isVerified || false, 
          numComments,
          totalLikes,
          replies: repliesWithCommenters || []
        }); 

      } catch (error) {
        console.error('Error fetching post', error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        fetchPost();
    }, [postId]);

    // function to deletepost by dbUser
    const handlePostDelete = async (postId) => {
      try {
        await DataStore.delete(CommunityDiscussion, postId);
        setPost(null); // Set post to null after deletion
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    };
  
  return (
    <div>
      {loading ? (
        <div className="communLoading-container">
          <div className="communSpinner" />
          <h2>Loading...</h2>
        </div>
      ) : (
        <Content post={post} onDelete={handlePostDelete}/>
      )}
    </div>
  );
};

export default DetailedPost;