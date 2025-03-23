import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultImage from '/defaultImage.png'; 
import { getUrl } from 'aws-amplify/storage';
import '../../TabStyles/Search.css'

const SearchResultCom = ({ post }) => {
  const [mediaUris, setMediaUris] = useState([]);
  const formattedPrice = Number(post.price)?.toLocaleString();
  const navigate = useNavigate();

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
    <div
      className='searchPropertyContainer'
      
    >
      <div 
        className='searchImageContainer'
        onClick={() => navigate(`/clientcontent/detailedpost/${post.id}`)}>
        {mediaUris.length > 0 ? (
          mediaUris[0].type === 'video' ? (
            <div className='pVideoWrapper'>
              <video
                className="searchMedia"
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
                  navigate(`/clientcontent/hoteldetailedpost/${post.id}`);
                }}
              />
            </div>
          ) : (
            <img src={mediaUris[0].url} alt="Post" className='searchImage' />
          )
        ) : (
          <img src={'/defaultImage.png'} alt="Default" className='searchImage' />
        )}
      </div>

      {/* Username */}
      <div
        className='searchContact'
        onClick={() =>
          navigate(`/clientcontent/realtorprofile/${post.realtorID}`)}
      >
        <p className='searchName'>{post.realtorFirstName}</p>
      </div>

      {post.type && <p className='searchBedroom'>{post.type}</p>}

      {/* Bed & Bedrooms */}
      {post.bed && <p className='searchBedroom'>Beds: {post.bed}</p>}

      {post.bedrooms && <p className='searchBedroom'>Bedroom(s): {post.bedrooms}</p>}

      {post.generalLocation && <p className='searchLocation'>{post.generalLocation}</p>}

      {/* Type & Description */}
      <p 
        className='searchDescription'
      >
        {post.description.length <= 150 ? post.description : `${post.description.substring(0, 150)}...`}
      </p>

      {/* Old Price & New Price */}
      {/* Rent */}
      <div className='searchPriceRow'>
        <p className='searchPrice'>
          ₦{formattedPrice} {post.timeFrame && `/ ${post.timeFrame}`}
        </p>
      </div>
    </div>
  );
};

export default SearchResultCom;