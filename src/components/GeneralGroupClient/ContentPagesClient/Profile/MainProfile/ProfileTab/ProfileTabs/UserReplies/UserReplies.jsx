import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './UserReplies.css';
import { FaRegHeart } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
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
            // Step 1: Get replies by the user
            const userReplies = await DataStore.query(CommunityReply, r =>
            r.commenterID.eq(dbUser.id)
            );

            // Step 2: Get likes by the user
            const userLikes = await DataStore.query(CommunityLike, l =>
            l.likedByID.eq(dbUser.id)
            );

            // Step 3: Extract post IDs
            const replyPostIDs = userReplies.map(r => r.communitydiscussionID);
            const likePostIDs = userLikes.map(l => l.communitydiscussionID);

            // Step 4: Create a Set of all unique post IDs
            const allPostIDs = Array.from(new Set([...replyPostIDs, ...likePostIDs]));

            // Step 5: Fetch the posts
            const posts = await Promise.all(
            allPostIDs.map(id => DataStore.query(CommunityDiscussion, id))
            );

            // Step 6: Attach the user's reply and like to each post
            const postData = posts.map(post => {
            const reply = userReplies.find(r => r.communitydiscussionID === post.id);
            const liked = userLikes.some(l => l.communitydiscussionID === post.id);

            return {
                post,
                reply: reply || null,
                liked,
            };
            });

            setPostsWithUserActivity(postData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user posts:', error);
            setLoading(false);
        }
        };

        fetchData();
    }, [dbUser]);

    if (loading) {
        return <p>Loading Replies...</p>;
    }

    if (postsWithUserActivity.length === 0) {
        return <p>No posts liked or replied to yet.</p>;
    }

  return (
    <div>
        {postsWithUserActivity.map(({ post, reply, liked }) => (
            <div 
                key={post.id}
                onClick={()=>navigate(`/clientcontent/community_post/${post.id}`)}
            >
                <p className='postCategory'>
                    {post.category}
                </p>

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
                    {/* <div className="engagementrow">
                        <FaRegCommentDots className='engagementIcon'/>
                        <p className='engagementNum'>
                            {post.numComments}
                        </p>
                    </div> */}
    
                    <div 
                        className="engagementrow"
                    >
                        {liked ? (
                            <GoHeartFill className='engagementFilledHeart'/>
                        ) : (
                            <FaRegHeart className='engagementIcon'/>
                        )}
                        {/* <p className='engagementNum'>
                            {post.totalLikes}
                        </p> */}
                    </div>
                </div>
                

                {reply && (
                    <div 
                        className='userReplyCon'
                    >
                        {/* <div className='connectionLineCon'>
                            <div className='connectionLine'/>
                        </div> */}

                        <p><strong>Your reply:</strong></p>
                        <p className='userReply'>
                            {/* {reply.comment} */}
                            {readMoreComment || reply.comment.length <= 120
                            ? reply.comment
                            : `${reply.comment.substring(0, 120)}...`}
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

