import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Styles.css'; 
import { getUrl } from 'aws-amplify/storage';

const Post = ({ post }) => {
  const [imageUris, setImageUris] = useState([]);
  const formattedPrice = Number(post.price)?.toLocaleString();

  // Fetch signed URLs for each image in post.media
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
    <div className={styles.container}>
      <Link to={`/search/housesearch/houseinfo/${post.id}`}>
        <div className={styles.imageContainer}>
          {/* Image */}
          {imageUris[0] ? (
            <img src={imageUris[0]} alt="Post" className={styles.image} />
          ) : (
            <img src={'/defaultImage.png'} alt="Default" className={styles.image} />
          )}
        </div>
      </Link>

      {/* Username */}
      <Link to={`/realtor/houserealtor/houserealtorprofilepage/${post.realtorId}`}>
        <div className={styles.contact}>
          <p className={styles.name}>{post.firstName}</p>
        </div>
      </Link>

      {post.type && <p className={styles.bedroom}>{post.type}</p>}

      {/* Bed & Bedrooms */}
      {post.bed && <p className={styles.bedroom}>Beds: {post.bed}</p>}
      {post.bedrooms && <p className={styles.bedroom}>Bedroom(s): {post.bedrooms}</p>}

      {/* Location */}
      {post.address && <p className={styles.location}>{`...${post.address.substring(5)}`}</p>}

      {/* Type & Description */}
      <p className={styles.description} title={post.description}>
        {post.description}
      </p>

      {/* Rent */}
      <div className={styles.priceRow}>
        <p className={styles.price}>₦{formattedPrice} / year</p>
      </div>
    </div>
  );
};

export default Post;