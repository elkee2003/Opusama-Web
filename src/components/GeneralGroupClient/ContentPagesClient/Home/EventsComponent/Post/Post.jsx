import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegHeart } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { useAuthContext } from '../../../../../../../Providers/ClientProvider/AuthProvider';
import { getUrl } from 'aws-amplify/storage';
import { DataStore } from "aws-amplify/datastore";
import { Post as PostModel, PostLike, User } from '../../../../../../models';

function Post({post}) {
    const navigate = useNavigate();
    const { dbUser } = useAuthContext();
    const [mediaUris, setMediaUris] = useState([]);
    const [liked, setLiked] = useState(false);
    const formattedPrice = Number(post.price)?.toLocaleString();

    // Fetch ONLY the first media item
    const fetchFirstMediaUrl = async () => {
      if (!post.media?.length) return;

      const path = post.media[0];

      try {
        const result = await getUrl({
          path,
          options: {
            validateObjectExistence: true,
            expiresIn: null,
          },
        });

        setMediaUris([
          {
            url: result.url.toString(),
            type: path.endsWith('.mp4') ? 'video' : 'image',
          },
        ]);
      } catch (error) {
        console.error('Error fetching media URL:', error);
      }
    };

    // Check if post is already liked on mount
    useEffect(() => {
      if (!dbUser) return;
      const checkLikeStatus = async () => {
        const existingLikes = await DataStore.query(
          PostLike,
          (p) => p.and(p => [
            p.postID.eq(post.id),
            p.likedByID.eq(dbUser.id)
          ])
        );
        setLiked(existingLikes.length > 0);
      };
      checkLikeStatus();
    }, [dbUser, post.id]);

    // Toggle like
    const toggleLike = async (e) => {
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
              PostLike,
              (p) => p.and(p => [
                  p.postID.eq(post.id),
                  p.likedByID.eq(dbUser.id)
              ])
          );
  
          if (existingLikes.length > 0) {
          // Unlike: delete the like entry
          await Promise.all(existingLikes.map(async (like) => {
              await DataStore.delete(like);
          }));

          setLiked(false);
          } else {
              // Like: create a new like entry
              const savedLike = await DataStore.save(
                  new PostLike({
                      postID: post.id,
                      likedByID: dbUser.id,
                      like: true,
                  })
              );
              
              setLiked(true);  // <-- Update the state
          }
  
      } catch (error) {
          console.error("Error toggling like:", error);
      }
    };

    useEffect(() => {
      fetchFirstMediaUrl();
    }, [post.media]);

    // function to navigate
    const handleNavigate = (postId) => {
      // sessionStorage.setItem("scrollPosition", window.scrollY);
      navigate(`/clientcontent/events_detailedpost/${postId}`);
    };

  return (
    <div className='singlePostContainer'>
        {/* Image Container */}
        <div 
            className={'imageContainer'}
            onClick={() => handleNavigate(post.id)}
        >
          {mediaUris.length > 0 ? (
            mediaUris[0].type === 'video' ? (
              <div className='pVideoWrapper'>
                <video
                  className="pMedia"
                  controls
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <source src={mediaUris[0].url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div 
                  className="pVideoOverlay" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/clientcontent/events_detailedpost/${post.id}`);
                  }}
                />
              </div>
            ) : (
              <img 
                src={mediaUris[0].url} 
                alt="Post"  className='pImage' 
                loading="lazy"
              />
            )
          ) : (
            <div className="pImageLoading">
              {/* Default Image */}
              <img src={'/defaultImage.png'} alt="Default" className='pImage' />

              {/* Spinner */}
              <div className="spinnerOverlay" />
            </div>
          )}

          {/* Subcription label */}
          {post.isSubscription && <div className='subscribeLabel'>
            <p>Subscribe</p>
          </div>}

          {/* Like Button */}
          <div
            onClick={toggleLike}
            className='postLike'
          >
            {liked ? (
              <GoHeartFill className='heartIcon' color="red" />
            ) : (
              <FaRegHeart className='heartIcon' color="white" />
            )}
          </div>
        </div>
        
        <div className='clientSummaryContainer'>
          {/* Username */}
          <div 
              className={'contact'}
              onClick={()=>navigate(`/clientcontent/realtorprofile/${post.realtorID}`)}
          >
              <p className={'name'}>{post.firstName}</p>
          </div>

          {post.type && (
              <p className={'bedroom'}>{post.type}</p>
          )}

          {/* Bed & Bedrooms */}
          {post.bed && (
              <p className={'bedroom'}>Beds: {post.bed} </p>
          )}

          {post.bedrooms && (
            <p className={'bedroom'}>Bedroom(s):{post.bedrooms} </p>
          )}

          {/* Location */}
          {post.generalLocation && (
            <p className={'location'}>
              {post.generalLocation}
            </p>
          )}

          {/* Type & Description */}
          <p 
              className={'description'}
          >
              {post.description.length <= 150 ? post.description : `${post.description.substring(0, 150)}...`}
          </p>

          {/* Old Price & New Price */}
          {/* Rent */}
          <div className={'priceRow'}>
            <p className={'price'}> 
              {Number(post.price) === 0
              ? 'Free'
              : `₦${formattedPrice} ${post.timeFrame ? `/ ${post.timeFrame}` : ''}`}
            </p>
          </div>
        </div>
    </div>
  )
}

export default Post;
