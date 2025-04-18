import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CommunityTabs.css';
import { MdDelete } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { FaRegCommentDots } from "react-icons/fa6";
import { formatDistanceStrict } from "date-fns";
import { useAuthContext } from '../../../../../../../../Providers/ClientProvider/AuthProvider';
import { DataStore } from "aws-amplify/datastore";
import { CommunityDiscussion, CommunityReply, CommunityLike, Notification, Realtor, User } from '../../../../../../../models';

function Post({post, onDelete}) {

    const [isFocus, setIsFocus] = useState(false);
    const navigate = useNavigate();
    const { dbUser } = useAuthContext();
    const [readMore, setReadMore] = useState(false);
    const [moreName, setMoreName] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.totalLikes || 0);

    // Time format
    const formattedTime = post.createdAt
    ? formatDistanceStrict(new Date(post.createdAt), new Date(), { addSuffix: true })
        .replace(" seconds", "s")
        .replace(" second", "s")
        .replace(" minutes", "m")
        .replace(" minute", "m")
        .replace(" hours", "h")
        .replace(" hour", "h")
        .replace(" days", "d")
        .replace(" day", "d")
        .replace(" weeks", "w")
        .replace(" week", "w")
        .replace(" months", "mo")
        .replace(" month", "mo")
        .replace(" years", "y")
        .replace(" year", "y")
    : "Just now";

    // Delete Post Function
    const handleDelete = async (e) => {
        e.stopPropagation(); // Prevent navigating when clicking delete

        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
            // Delete associated replies
            const replies = await DataStore.query(CommunityReply, (r) => r.communitydiscussionID.eq(post.id));
            await Promise.all(replies.map(reply => DataStore.delete(reply)));

            // Delete associated likes
            const likes = await DataStore.query(CommunityLike, (l) => l.communitydiscussionID.eq(post.id));
            await Promise.all(likes.map(like => DataStore.delete(like)));

            // Delete the post itself
            await DataStore.delete(CommunityDiscussion, post.id);

            // Update UI after deletion
            onDelete(post.id); 
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    // Function to toggle like button
    const handleToggleLike = async (e) => {
        e.stopPropagation();

        if (!dbUser) {
            alert("You need to be logged in to like a post!");
            return;
        }else if (!dbUser.username) {
            alert('Please fill in your username to proceed.');
            navigate('/clientcontent/editprofile');
        }
    
        try {
            // Check if the user already liked the post
            const existingLikes = await DataStore.query(
                CommunityLike,
                (c) => c.and(c => [
                    c.communitydiscussionID.eq(post.id),
                    c.likedByID.eq(dbUser.id)
                ])
            );
    
            if (existingLikes.length > 0) {
                // Unlike: delete the like entry
                await Promise.all(existingLikes.map(async (like) => {
                    await DataStore.delete(like);

                    // Delete the associated notification
                    const relatedNotifications = await DataStore.query(Notification, (n) =>
                        n.and(n => [
                            n.type.eq("LIKE"),
                            n.entityID.eq(like.id),
                            n.recipientID.eq(post.creatorOfPostID)
                        ])
                    );

                    await Promise.all(relatedNotifications.map(n => DataStore.delete(n)));
                }));

                setLikesCount(prev => prev - 1);
                setIsLiked(false);
            } else {
                // Like: create a new like entry
                const savedLike = await DataStore.save(
                    new CommunityLike({
                        communitydiscussionID: post.id,
                        likedByID: dbUser.id,
                        like: true,
                    })
                );
                
                await DataStore.save(
                    new Notification({
                        creatorID: dbUser?.id,
                        recipientID:post.creatorOfPostID,
                        recipientType: 'POST_CREATOR',
                        type: "LIKE",
                        entityID: savedLike.id,
                        message: `Someone liked your post`,
                        read: false,
                    })
                );

                setLikesCount(prev => prev + 1);
                setIsLiked(true);  // <-- Update the state
            }
    
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    // useEffect to check if User liked Post
    useEffect(() => {
        const fetchUserLike = async () => {
            if (!dbUser) return;
    
            const existingLikes = await DataStore.query(
                CommunityLike,
                (c) => c.and(c => [
                    c.communitydiscussionID.eq(post.id),
                    c.likedByID.eq(dbUser.id)
                ])
            );
    
            setIsLiked(existingLikes.length > 0); // <-- Corrected variable name
        };
    
        fetchUserLike();
    }, [dbUser, post.id]);

  return (
    <div>
        <div 
            key={post.id}
            onClick={()=>navigate(`/clientcontent/community_post/${post.id}`)}
        >

            {/* Category */}
            <p className='postCategory'>
                {post.category}
            </p>

            {/* Post Username and Time */}
            <div className='postUserTimeDeltCon'>
                {/* Username & Time */}
                <div className='postUserTimeCon'>
                    <div className='postUsernameCon'>
                        <p className='postUsername'>
                            {moreName || post.instigatorName.length <= 10
                            ? post.instigatorName
                            : `${post.instigatorName.substring(0, 12)}...`}
                        </p>
                        <p>@{post.instigatorUsername}</p>
                    </div>
                    
                    <p className='postTime'>
                        {formattedTime}
                    </p>
                </div>

                {/* Delete Button */}
                {dbUser?.id === post.instigatorID && (
                    <div 
                    className='deletePostBtnCon'
                    onClick={handleDelete}
                    >
                        <MdDelete className='deletePostIcon' />
                    </div>
                )}
            </div>

            {/* Title */}
            <div className="postTitleCon">
                <p className='postTitle'>
                    {post.title}
                </p> 
            </div>

            {/* Content */}
            <p className='postContent'>
                {readMore || post.content.length <= 150
                    ? post.content
                    : `${post.content.substring(0, 150)}...`}
                {post.content.length > 150 && (
                    <button
                    className={readMore ? 'readLessBtnCommun' : 'readMoreBtnCommun'}
                    onClick={(e) => {
                        e.stopPropagation();
                        setReadMore(!readMore)
                    }}
                    >
                    {readMore ? 'Show Less' : 'Read More'}
                    </button>
                )}
            </p>

            {/* Post Engagment */}
            <div className='postEngagementCon'>
            <div className="engagementrow">
                <FaRegCommentDots className='engagementIcon'/>
                <p className='engagementNum'>
                    {post.numComments}
                </p>
            </div>

            <div 
                className="engagementrow"
                onClick={handleToggleLike}
            >
                {isLiked ? (
                    <GoHeartFill className='engagementFilledHeart'/>
                ) : (
                    <FaRegHeart className='engagementIcon'/>
                )}
                <p className='engagementNum'>
                    {likesCount}
                </p>
            </div>
            </div>

            {/* Border */}
            <div className='communBorder'/>
        </div>
    </div>
  )
}

export default Post;
