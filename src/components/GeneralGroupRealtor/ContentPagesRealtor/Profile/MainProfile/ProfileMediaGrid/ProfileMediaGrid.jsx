import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultImage from '/defaultImage.png';
import { getUrl } from 'aws-amplify/storage';
import './ProfileMediaGrid.css';

const MediaGrid = ({ posts }) => {
  const [imageUris, setImageUris] = useState({});
  const navigate = useNavigate(); 

  // Fetch signed URLs for each post's media using Promise.all
  const fetchImageUrls = async () => {
    try {
      const urlsByPost = await Promise.all(
        posts.map(async (post) => {
          const mediaUrls = await Promise.all(
            post.media.map(async (path) => {
              const result = await getUrl({
                path,
                options: {
                  validateObjectExistence: true,
                  expiresIn: null,
                },
              });
              return result.url.toString();
            })
          );
          return { [post.id]: mediaUrls };
        })
      );

      const urlsObject = Object.assign({}, ...urlsByPost);
      setImageUris(urlsObject);
    } catch (error) {
      console.error('Error fetching image URLs:', error);
    }
  };

  useEffect(() => {
    if (posts.length > 0) {
      fetchImageUrls();
    }
  }, [posts]);

  return (
    <div className="gridContainer">
      {posts.map((post) => (
        <button
          key={post.id}
          onClick={() => navigate(`/clientcontent/detailedpost/${post.id}`)} // Navigation with React Router
          className="gridItem"
        >
          <div className="mediaImageContainer">
            {/* Display the first image or a default image */}
            {imageUris[post.id]?.[0] ? (
              <img src={imageUris[post.id][0]} alt="Post" className="mediaImage" />
            ) : (
              <img src={DefaultImage} alt="Default" className="mediaImage" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default MediaGrid;