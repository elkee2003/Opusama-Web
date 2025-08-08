import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { FaRegCommentDots } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { formatDistanceStrict } from "date-fns";
import { useAuthContext } from '../../../../../../../../../Providers/ClientProvider/AuthProvider';
import { DataStore } from "aws-amplify/datastore";
import { CommunityDiscussion, CommunityReply, CommunityLike, Realtor, User } from '../../../../../../../../models';

function UserPost() {
  const navigate = useNavigate();
  const { dbUser } = useAuthContext();
  const [posts, setPosts] = useState([]);
  const [readMore, setReadMore] = useState(false);
  const [moreName, setMoreName] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Delete Post Function
  const handleDelete = async (e, post) => {
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
          
          // Update UI here
          setPosts(prev => prev.filter(p => p.id !== post.id));
      } catch (error) {
          console.error("Error deleting post:", error);
      }
  };
  

  const fetchUserDiscussions = async () => {
    if (!dbUser) return;

    try {
      setLoading(true);
      // Step 1: Fetch only discussions by the current dbUser
      const discussions = await DataStore.query(
        CommunityDiscussion,
        d => d.instigatorID.eq(dbUser.id) 
      );

      if (discussions.length === 0) {
        setPosts([]);
        return;
      }

      // Step 2: Get all realtors and users for mapping
      const [realtors, users] = await Promise.all([
        DataStore.query(Realtor),
        DataStore.query(User)
      ]);

      // Step 3: Enhance each discussion
      const enhancedPosts = await Promise.all(
        discussions.map(async (post) => {
          const instigator = realtors.find(r => r.id === post.instigatorID) ||
                             users.find(u => u.id === post.instigatorID);

          // Fetch replies & likes for this discussion
          const [replies, likes] = await Promise.all([
            DataStore.query(CommunityReply, r => r.communitydiscussionID.eq(post.id)),
            DataStore.query(CommunityLike, l => l.communitydiscussionID.eq(post.id))
          ]);
          

          // Count valid comments
          const numComments = replies.filter(
            reply => reply.comment && reply.comment.trim() !== ""
          ).length;

          // Count likes
          const totalLikes = likes.filter(like => like.like === true).length;

          // Calculate formatted time here
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

          // Attach commenter info to replies
          const repliesWithCommenters = replies.map(reply => {
            const commenter = realtors.find(r => r.id === reply.commenterID) ||
                              users.find(u => u.id === reply.commenterID);
                              return {
              ...reply,
              commenterName: commenter?.firstName || "Unknown",
              commenterUsername: commenter?.username || "unknown",
              commenterProfilePic: commenter?.profilePic || null
            };
          });

          // Attach liker info to likes
          const likesWithUsers = likes.map(like => {
            const liker = realtors.find(r => r.id === like.likedByID) ||
                          users.find(u => u.id === like.likedByID);

            return {
              ...like,
              likerName: liker?.firstName || "Unknown",
              likerUsername: liker?.username || "unknown",
              likerProfilePic: liker?.profilePic || null
            };
          });

           return {
            ...post,
            instigatorName: instigator?.firstName || "Unknown",
            instigatorUsername: instigator?.username || "unknown",
            numComments,
            totalLikes,
            likes: likesWithUsers,
            replies: repliesWithCommenters,
            formattedTime
          };
        }) 
      );
      // Step 4: Sort newest first
      setPosts(enhancedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

    } catch (error) {
        console.error("Error fetching user's discussions", error);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserDiscussions();

    // Observers: Update when this user’s posts, replies, or likes change
    const discussionSub = DataStore.observe(CommunityDiscussion).subscribe(({ opType, element }) => {
      if (element.instigatorID === dbUser?.id) {
        fetchUserDiscussions();
      }
    });

    const replySub = DataStore.observe(CommunityReply).subscribe(({ element }) => {
      if (posts.some(post => post.id === element.communitydiscussionID)) {
        fetchUserDiscussions();
      }
    });

    const likeSub = DataStore.observe(CommunityLike).subscribe(({ element }) => {
      if (posts.some(post => post.id === element.communitydiscussionID)) {
        fetchUserDiscussions();
      }
    });

    return () => {
      discussionSub.unsubscribe();
      replySub.unsubscribe();
      likeSub.unsubscribe();
    };
  }, [dbUser?.id]);

  return (
    <div>
      {loading ? <p>Loading...</p> : posts.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>No posts yet</p>
      ) : (
        posts.map(post => (
          <div 
            key={post.id}
            onClick={()=>navigate(`/clientcontent/community_post/${post.id}`)}
          >
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
                            : `${post.instigatorName.substring(0, 9)}...`}
                        </p>
                        <p>@{post.instigatorUsername}</p>
                    </div>
                    <p className='postTime'>
                        {post.formattedTime}
                    </p>
                </div>

                {/* Delete Button */}
                {dbUser?.id === post.instigatorID && (
                    <div 
                    className='deletePostBtnCon'
                    onClick={(e) => handleDelete(e, post)}
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
                    // onClick={handleToggleLike}
                >
                    {isLiked ? (
                        <GoHeartFill className='engagementFilledHeart'/>
                    ) : (
                        <FaRegHeart className='engagementIcon'/>
                    )}
                    <p className='engagementNum'>
                        {post.totalLikes}
                    </p>
                </div>
            </div>

            {/* Border */}
            <div className='communBorder'/>
          </div>
        ))
      )}

      {/* Add Post Icon */}
      <div 
        className='addIconCon'
        onClick={()=>navigate('/clientcontent/create_post')}
      >
        <IoMdAdd className='addIcon'/>
      </div>

    </div>
  )
}

export default UserPost
