import React, {useState, useEffect} from 'react';
import './Post.css';
import { useNavigate } from 'react-router-dom';
import { useProfileContext } from '../../../../../../Providers/RealtorProvider/ProfileProvider';
import { getUrl } from 'aws-amplify/storage';

function Post({post}) {
    const navigate = useNavigate();

    const [mediaUris, setMediaUris] = useState([]);
    const {firstName} = useProfileContext()
    const formattedPrice = Number(post.price)?.toLocaleString();

    // Fetch only first image
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

      setMediaUris({
        url: result.url.toString(),
        type: path.endsWith('.mp4') ? 'video' : 'image',
      });
    } catch (error) {
      console.error('Error fetching media URL:', error);
    }
  };

  useEffect(() => {
    fetchFirstMediaUrl();
  }, [post.media]);

    // Function to navigate
    const handleNavigate = (postId) => {
      // sessionStorage.setItem("scrollPosition", window.scrollY);
      navigate(`/realtorcontent/postdetails/${postId}`);
    };

  return (
    <div className='realtorPostContainer'>
        <div 
          className={'imageContainer'}
          onClick={() => handleNavigate(post.id)}
        >
          {mediaUris ? (
            mediaUris.type === 'video' ? (
              <div className='postVideoWrapper'>
                <video 
                  className="media" 
                  controls
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <source src={mediaUris.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <div 
                  className="postVideoOverlay" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/realtorcontent/postdetails/${post.id}`);
                  }}
                />
              </div>
            ) : (
              <img 
                src={mediaUris.url} 
                alt="Post" 
                className="image" 
                loading='lazy'
              />
            )
          ) : (
            <img 
              src={'/defaultImage.png'} 
              alt="Default" 
              className="image" 
            />
          )}

          {/* Subcription Label */}
          {post.isSubscription && <div className='subscribeLabel'>
            <p>Subscription</p>
          </div>}

          {/* Unavailable Label */}
          {!post.available && <div className='unavailableLabel'>
            <p>Unavailable</p>
          </div>}
        </div>

        {/* Username */}
        {/* <div 
            className={'contact'}
        >
            <p className={'name'}>{post.firstName}</p>
        </div> */}

        <div className='realtorSummaryContainer'>

          {post.type && (
              <p className='propertType'>{post.propertyType}</p>
          )}

          {/* Type */}
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
          {post.fullAddress && (
            <p className={'location'}>
              {post.fullAddress}
            </p>
          )}

          {/* Type & Description */}
          <p 
              className={'description'}
          >
              {post.description.length <= 150 ? post.description : `${post.description.substring(0, 150)}...`}
          </p>

          {/* Old Price & New Price */}
          {!post?.bookingOptions?.length && (
            <div className={'priceRow'}>
              <p className={'price'}> 
                {Number(post.price) === 0
                  ? 'Free'
                  : `₦${formattedPrice} ${post.timeFrame ? `/ ${post.timeFrame}` : ''}`}
              </p>
            </div>
          )}
        </div>
    </div>
  )
}

export default Post;
