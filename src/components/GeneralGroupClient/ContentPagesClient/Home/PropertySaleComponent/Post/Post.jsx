import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { getUrl } from 'aws-amplify/storage';

function Post({post}) {
    const navigate = useNavigate();
    const [mediaUris, setMediaUris] = useState([]);
    const formattedPrice = Number(post.price)?.toLocaleString();

    // Fetch signed URLs for each media item (image/video) in post.media
    const fetchMediaUrls = async () => {
      try {
        const urls = await Promise.all(
          post.media.map(async (path) => {
            const result = await getUrl({
              path,
              options: {
                validateObjectExistence: true,
                expiresIn: null, // No expiration limit
              },
            });
            return {
              url: result.url.toString(),
              type: path.endsWith('.mp4') ? 'video' : 'image',
            };
          })
        );

        // Store valid URLs (either video or image)
        setMediaUris(urls.filter(media => media.url !== null));
      } catch (error) {
          console.error('Error fetching media URLs:', error);
      }
    };

    useEffect(() => {
      if (post.media?.length > 0) {
        fetchMediaUrls();
      }
    }, [post.media]);

  return (
    <div className='singlePostContainer'>
        {/* Image Container */}
        <div 
            className={'imageContainer'}
            onClick={()=>navigate(`/clientcontent/detailedpost/${post.id}`)}
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
                    navigate(`/clientcontent/detailedpost/${post.id}`);
                  }}
                />
              </div>
            ) : (
              <img src={mediaUris[0].url} alt="Post" className='pImage' />
            )
          ) : (
            <img src={'/defaultImage.png'} alt="Default" className='pImage' />
          )}
        </div>

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
        {post.address && (
          <p className={'location'}>
            {post.address}
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
            ₦{formattedPrice} {post.timeFrame && `/ ${post.timeFrame}`}
          </p>
        </div>
    </div>
  )
}

export default Post;
