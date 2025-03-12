import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultImage from '/defaultImage.png'; 
import { getUrl } from 'aws-amplify/storage';
import '../../TabStyles/Search.css'

const SearchResultCom = ({ post }) => {
  const [imageUris, setImageUris] = useState([]);
  const formattedPrice = Number(post.price)?.toLocaleString();
  const navigate = useNavigate();

  const fetchImageUrls = async () => {
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

          // Use `result.url` 
          return result.url.toString();
        })
      );

      const validUrls = urls.filter((url) => url !== null);
      setImageUris(validUrls);
    } catch (error) {
      console.error('Error fetching image URLs:', error);
    }
  };

  useEffect(() => {
    if (post.media?.length > 0) {
      fetchImageUrls();
    }
  }, [post.media]);

  return (
    <div
      className='searchPropertyContainer'
      
    >
      <div 
        className='searchImageContainer'
        onClick={() => navigate(`/clientcontent/detailedpost/${post.id}`)}>
        {/* Image */}
        {imageUris[0] ? (
          <img src={imageUris[0]} alt="property" className='searchImage' />
        ) : (
          <img src={DefaultImage} alt="default" className='image' />
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

      {post.address && <p className='searchLocation'>{post.address}</p>}

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