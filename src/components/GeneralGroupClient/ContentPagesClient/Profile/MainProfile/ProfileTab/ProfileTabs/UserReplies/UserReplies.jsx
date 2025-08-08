import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './UserReplies.css';
import { FaRegCommentDots } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { formatDistanceStrict } from "date-fns";
import { useAuthContext } from '../../../../../../../../../Providers/ClientProvider/AuthProvider';
import { DataStore } from "aws-amplify/datastore";
import { CommunityDiscussion, CommunityReply, CommunityLike, Realtor, User } from '../../../../../../../../models';

function UserReplies() {
    const navigate = useNavigate();
    const { dbUser } = useAuthContext(); 
    const [postsWithUserActivity, setPostsWithUserActivity] = useState([]);
    const [readMore, setReadMore] = useState(false);
    const [readMoreComment, setReadMoreComment] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!dbUser) return;

        const fetchData = async () => {
            try {
                // Step 1: Get replies and likes by the user
                const [userReplies, userLikes, realtors, users] = await Promise.all([
                DataStore.query(CommunityReply, r => r.commenterID.eq(dbUser.id)),
                DataStore.query(CommunityLike, l => l.likedByID.eq(dbUser.id)),
                DataStore.query(Realtor),
                DataStore.query(User),
                ]);

                // Step 2: Extract all unique post IDs
                const replyPostIDs = userReplies.map(r => r.communitydiscussionID);
                const likePostIDs = userLikes.map(l => l.communitydiscussionID);
                const allPostIDs = Array.from(new Set([...replyPostIDs, ...likePostIDs]));

                // Step 3: Fetch all related posts
                const posts = await Promise.all(
                allPostIDs.map(id => DataStore.query(CommunityDiscussion, id))
                );

                // Step 4: Fetch all related replies & likes to those posts
                const [allReplies, allLikes] = await Promise.all([
                DataStore.query(CommunityReply),
                DataStore.query(CommunityLike),
                ]);

                // Step 5: Enhance each post
                const postData = posts.map(post => {
                    const instigator =
                        realtors.find(r => r.id === post.instigatorID) ||
                        users.find(u => u.id === post.instigatorID);

                    const postReplies = allReplies.filter(r => r.communitydiscussionID === post.id);
                    const postLikes = allLikes.filter(l => l.communitydiscussionID === post.id);

                    const numComments = postReplies.filter(
                        r => r.comment && r.comment.trim() !== ""
                    ).length;

                    const totalLikes = postLikes.filter(l => l.like === true).length;

                    const userReply = userReplies.find(r => r.communitydiscussionID === post.id) || null;
                    const userLiked = userLikes.some(l => l.communitydiscussionID === post.id);

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

                    return {
                        ...post,
                        instigatorName: instigator?.firstName || "Unknown",
                        instigatorUsername: instigator?.username || "unknown",
                        numComments,
                        totalLikes,
                        reply: userReply,
                        liked: userLiked,
                        formattedTime,
                    };
                });

                // Step 6: Sort and store
                setPostsWithUserActivity(postData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user posts:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [dbUser]);

    if (loading) {
        return <p>Loading Replies...</p>;
    }

    if (postsWithUserActivity.length === 0) {
        return <p style={{ textAlign: "center", marginTop: "20px" }}>No posts liked or replied to yet.</p>;
    }

  return (
    <div>
        {postsWithUserActivity.map(post => (
            <div key={post.id} onClick={() => navigate(`/clientcontent/community_post/${post.id}`)}>
                <p className='postCategory'>{post.category}</p>

                {/* Instigator info and time */}
                <div className='postUserTimeCon'>
                <div className='postUsernameCon'>
                    <p className='postUsername'>
                    {post.instigatorName.length <= 10
                        ? post.instigatorName
                        : `${post.instigatorName.substring(0, 9)}...`}
                    </p>
                    <p>@{post.instigatorUsername}</p>
                </div>
                <p className='postTime'>{post.formattedTime}</p>
                </div>

                {/* Title */}
                <div className="postTitleCon">
                <p className='postTitle'>{post.title}</p> 
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
                        setReadMore(!readMore);
                    }}
                    >
                    {readMore ? 'Show Less' : 'Read More'}
                    </button>
                )}
                </p>

                {/* Engagement */}
                <div className='postEngagementCon'>
                    <div className="engagementrow">
                        <FaRegCommentDots className='engagementIcon' />
                        <p className='engagementNum'>{post.numComments || 0}</p>
                    </div>
                    
                    <div className="engagementrow">
                        {post.liked ? (
                            <GoHeartFill className='engagementFilledHeart' /> // Filled red heart
                        ) : (
                            <FaRegHeart className='engagementIcon' /> // Outline heart
                        )}
                        <p className='engagementNum'>{post.totalLikes || 0}</p>
                    </div>
                </div>

                {/* User reply if exists */}
                {post.reply && (
                <div className='userReplyCon'>
                    <p><strong>Your reply:</strong></p>
                    <p className='userReply'>
                    {readMoreComment || post.reply.comment.length <= 120
                        ? post.reply.comment
                        : `${post.reply.comment.substring(0, 120)}...`}
                    </p>
                </div>
                )}

                {/* Border */}
                <div className='communBorder'/>
            </div>
        ))}

    </div>
  )
}

export default UserReplies;

