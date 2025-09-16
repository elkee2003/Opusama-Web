import React, { useState, useEffect } from 'react';
import { FaRegHeart } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { FaRegCommentDots } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { MdDelete, MdVerified } from "react-icons/md";
import './Content.css'; 
import { useAuthContext } from '../../../../../../../../Providers/ClientProvider/AuthProvider';
import { useNavigate} from "react-router-dom";
import { formatDistanceStrict } from "date-fns";
import UsersComment from './UsersComment';
import { getUrl, remove } from "aws-amplify/storage";
import { DataStore } from "aws-amplify/datastore";
import { CommunityDiscussion, CommunityReply, CommunityLike, Notification} from '../../../../../../../models';

const Content = ({post, onDelete}) => {
    const navigate = useNavigate();
    const [readMore, setReadMore] = useState(false);
    const {authUser, dbRealtor} = useAuthContext();
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post?.totalLikes || 0);
    const [repliesCount, setRepliesCount] = useState(0);
    const [mediaUris, setMediaUris] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    // Fetch Media
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

        setMediaUris(urls.filter(Boolean));
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

    // function to fetch replies
    const fetchRepliesCount = async () => {
      try {
        const replies = await DataStore.query(CommunityReply, (r) =>
          r.communitydiscussionID.eq(post.id)
        );
        setRepliesCount(replies.length);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    // Delete Post Function
    const handleDelete = async (e) => {
        e.stopPropagation(); // Prevent unintended navigation

        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
          // Fetch all replies related to the post
          const replies = await DataStore.query(CommunityReply, (r) => r.communitydiscussionID.eq(post.id));

          // Fetch all likes related to the post
          const likes = await DataStore.query(CommunityLike, (l) => l.communitydiscussionID.eq(post.id));

          // Delete all replies
          await Promise.all(replies.map(reply => DataStore.delete(CommunityReply, reply)));

          // Delete all likes
          await Promise.all(likes.map(like => DataStore.delete(like)));

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

          // Delete the post
          await DataStore.delete(CommunityDiscussion, post.id);

          onDelete(post.id); 
          navigate(-1);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    // Function to toggle like button
    const toggleLike = async () => {

      if (!dbRealtor) {
        alert("You need to be logged in to like a post!");
        return;
      }

      try {
        const existingLikes = await DataStore.query(
          CommunityLike,
          (c) => c.and(c => [
              c.communitydiscussionID.eq(post.id),
              c.likedByID.eq(dbRealtor.id)
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
          // Like the post (create a new like record)
          const savedLike = await DataStore.save(
              new CommunityLike({
                communitydiscussionID: post.id,
                likedByID: dbRealtor.id,
                like: true,
              })
          );

          await DataStore.save(
            new Notification({
                creatorID: dbRealtor?.id,
                recipientID:post.creatorOfPostID,
                recipientType: 'POST_CREATOR_LIKE',
                type: "LIKE",
                entityID: post.id,
                message: `Someone liked your post`,
                read: false,
            })
          );
            
          setIsLiked(true);
          setLikesCount((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    };

    // Navigate function
    const handleNavigate = () => {
      if(authUser){
        navigate('/realtorcontent/create_post');
      }else{
        alert('Sign In to access')
        navigate('/?section=signin');
      }
    };

    const handleNavigateToReply = () => {
      if(authUser){
        navigate(`/realtorcontent/response_post/${post.id}`, {
          state: { creatorOfPostID: post.creatorOfPostID }
        });
      }else{
        alert('Sign In to access');
        navigate('/?section=signin');
      }
    };

    // Fetch updated replies
    useEffect(() => {
      fetchRepliesCount(); // Initial fetch
    
      const subscription = DataStore.observe(CommunityReply).subscribe((msg) => {
        if (msg.element.communitydiscussionID !== post.id) return;
    
        if (["INSERT", "DELETE"].includes(msg.opType)) {
          fetchRepliesCount(); // Refresh the count
        }
      });
    
      return () => subscription.unsubscribe();
    }, [post.id]);

    // Fetch updated likes
    useEffect(() => {
      const fetchLikeStatus = async () => {
        if (!dbRealtor) return; 

        try {
          // Check if user has liked the post
          const existingLikes = await DataStore.query(
            CommunityLike,
            (c) => c.and(c => [
                c.communitydiscussionID.eq(post.id),
                c.likedByID.eq(dbRealtor.id)
            ])
          );

          if (existingLikes.length > 0) {
              setIsLiked(true);
          }
          // Fetch total likes for this post
          const allLikes = await DataStore.query(
            CommunityLike,
            (c) => c.communitydiscussionID.eq(post.id)
          );
          setLikesCount(allLikes.length);
        } catch (error) {
          console.error("Error fetching like status:", error);
        }
      };

      fetchLikeStatus();
    }, [post.id, dbRealtor]);

    // UseEffect for media
    useEffect(() => {
      fetchMediaUrls();
    }, [post.media]);

  return (
    <div className="communityDetailedPostCon">

        {/* Category */}
        <p className='detPostCategory'>
            {post.category}
        </p>

        {/* Post Username and Time */}
        <div className="detPostUserTimeDeltCon">
          <div 
            className="detPostUserTimeCon"
            onClick={(e)=>{
              e.stopPropagation();
              navigate(`/clientcontent/userprofile/${post.creatorOfPostID}`)
            }}
          >
            <div className="detPostUserNameCon">
              <p>{post.instigatorName}</p>
              <span>@{post.instigatorUsername}</span>

              {/* Verified Icon */}
              {post.isVerified && (
                  <MdVerified className='verifiedIcon' />
              )}
            </div>
            <p className='detPostTime'>
              {formattedTime}
            </p>
          </div>

          {/* Delete Button */}
          {dbRealtor?.id === post.instigatorID && (
              <div className='deltContentCon' onClick={handleDelete}>
                  <MdDelete className='deltContentIcon' />
              </div>
          )}
        </div>

        {/* Title */}
        <div className="detPostTitleCon">
          <p className='detPostTitle'>
            {post.title}
          </p> 
        </div>

        {/* Post Content */}
        <p className='detPostContent'>
          {readMore || post.content.length <= 750
            ? post.content
            : `${post.content.substring(0, 750)}...`}
          {post.content.length > 750 && (
            <button
              className={readMore ? 'readLessBtnComment' : 'readMoreBtnComment'}
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
            {mediaUris.map((media, index) =>
              media.type === 'video' ? (
                <video
                  key={index}
                  src={media.url}
                  controls
                  className="pCommunityMedia"
                />
              ) : (
                <img
                  key={index}
                  src={media.url}
                  alt={`Post media ${index}`}
                  className="pCommunityImage"
                  loading="lazy"
                  onClick={() => setSelectedImage(media.url)}
                />
              )
            )}
          </div>
        )}

        {/* Post Engagment */}
        <div className='detPostEngagementCon'>
            <div className="detEngagementrow">
              <FaRegCommentDots className='detEngagementIcon'/>
              <p className='detEngagementNum'>
                {repliesCount}
              </p>
            </div>

            <div 
              className="detEngagementrow"
              onClick={toggleLike}
            >
              {isLiked ? (
                <GoHeartFill className='detEngagementFilledHeart'/>
              ): (
                <FaRegHeart className='detEngagementIcon'/>
              )}
              <p className='detEngagementNum'>
                {likesCount}
              </p>
            </div>
        </div>

        <div className='detCommentBorder'/>

        {/* Users Comments */}
        <UsersComment replies={post.replies}/>

        {/* Place holder to write comment */}
        <div 
            className="writeResCon"
            onClick={handleNavigateToReply}
        >
            <p className='writeRes'>Write comment...</p>
        </div>

        {/* Selected Image */}
        {selectedImage && (
          <div 
            className="fullscreen-overlay" 
            onClick={() => setSelectedImage(null)} // close on click
          >
            <img src={selectedImage} alt="Full screen view" className="fullscreen-image" />
          </div>
        )}


        {/* Floating Create Post Icon Shouldn't be for Realtor*/}
        {/* <div 
            className='addIconCon'
            onClick={handleNavigate}
        >
            <IoMdAdd className='addIcon'/>
        </div> */}
    </div>
  );
};

export default Content;