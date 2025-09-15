import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CommunityTabs.css';
import { MdDelete, MdVerified } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { FaRegCommentDots } from "react-icons/fa6";
import { formatDistanceStrict } from "date-fns";
import { useAuthContext } from '../../../../../../../../Providers/ClientProvider/AuthProvider';
import { getUrl, remove } from "aws-amplify/storage";
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
    const [mediaUris, setMediaUris] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);

    // Fetch all media URLs
    const fetchMediaUrls = async () => {
        if (!post.media?.length) return;

        try {
            const urls = await Promise.all(
            post.media.map(async (path) => {
                const result = await getUrl({
                path,
                options: {
                    validateObjectExistence: true,
                    expiresIn: null,
                },
                });

                return {
                url: result.url.toString(),
                type: path.endsWith('.mp4') ? 'video' : 'image',
                };
            })
            );

            setMediaUris(urls);
        } catch (error) {
            console.error("Error fetching media URLs:", error);
        }
    };


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

            // Delete associated notifications
            const relatedNotifications = await DataStore.query(Notification, (n) =>
            n.entityID.eq(post.id)
            );
            await Promise.all(relatedNotifications.map(n => DataStore.delete(n)));

            // ✅ Delete media from S3
            if (post.media && post.media.length > 0) {
                await Promise.all(
                    post.media.map(async (path) => {
                    try {
                        await remove({ path });
                    } catch (err) {
                        console.error(`Failed to delete ${path} from S3:`, err);
                    }
                    })
                );
            }

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
            navigate('/admin/editprofile');
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
                        n.entityID.eq(post.id),
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
                        recipientType: 'POST_CREATOR_LIKE',
                        type: "LIKE",
                        entityID: post.id,
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

    // useEffect for Images
    useEffect(() => {
        fetchMediaUrls();
    }, [post.media]);

  return (
    <div>
        <div 
            key={post.id}
            onClick={()=>navigate(`/admin/community_post/${post.id}`)}
        >

            {/* Category */}
            <p className='postCategory'>
                {post.category}
            </p>

            {/* Post Username and Time */}
            <div className='postUserTimeDeltCon'>
                {/* Username & Time */}
                <div    
                    className='postUserTimeCon'
                    onClick={(e)=>{
                        e.stopPropagation();
                        navigate(`/admin/userprofile/${post.creatorOfPostID}`)
                    }}
                >
                    <div 
                        className='postUsernameCon'
                    >
                        <p className='postUsername'>
                            {moreName || post.instigatorName.length <= 10
                            ? post.instigatorName
                            : `${post.instigatorName.substring(0, 9)}...`}
                        </p>
                        <p>@{post.instigatorUsername}</p>

                        {/* Verified Icon */}
                        {post.isVerified && (
                            <MdVerified className='verifiedIcon' />
                        )}
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

            {/* Display media */}
            {mediaUris.length > 0 && (
                <div className="display-media-community">
                    {mediaUris.map((media, index) => (
                    media.type === 'video' ? (
                        <video 
                            key={index} 
                            src={media.url} 
                            controls 
                            className="pCommunityMedia"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMedia(media);
                            }}
                        />
                    ) : (
                        <img
                            key={index}
                            src={media.url}
                            alt={`Post media ${index}`}
                            className="pCommunityImage"
                            loading="lazy"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMedia(media);
                            }}
                        />
                    )
                    ))}
                </div>
            )}
        

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

            {/* ✅ Fullscreen Media Viewer */}
            {selectedMedia && (
                <div
                    className="fullscreen-overlay"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMedia(null);
                    }}
                >
                {selectedMedia.type === "video" ? (
                    <video 
                        src={selectedMedia.url} 
                        controls 
                        autoPlay 
                        className="fullscreen-image"
                    />
                ) : (
                    <img 
                        src={selectedMedia.url}     alt="fullscreen"    className="fullscreen-image"
                    />
                )}
                </div>
            )}
        </div>
    </div>
  )
}

export default Post;
