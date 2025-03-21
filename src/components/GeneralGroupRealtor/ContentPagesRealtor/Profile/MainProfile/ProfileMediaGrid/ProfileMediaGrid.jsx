import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultImage from '/defaultImage.png';
import { getUrl } from 'aws-amplify/storage';
import './ProfileMediaGrid.css';

const MediaGrid = ({ posts }) => {
  const [mediaUris, setMediaUris] = useState([]);
  const navigate = useNavigate(); 

  // Fetch signed URLs for each post's media using Promise.all
  const fetchMediaUrls = async () => {
    try {
      const urlsByPost = await Promise.all(
        posts.map(async (post) => {
          if (!post.media || post.media.length === 0) return { [post.id]: [] };

          const mediaUrls = await Promise.all(
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
                type: path.endsWith('.mp4') ? 'video' : 'image' 
              };
            })
          );

          return { [post.id]: mediaUrls };
        })
      );

      const urlsObject = Object.assign({}, ...urlsByPost);
      setMediaUris(urlsObject);
    } catch (error) {
      console.error('Error fetching media URLs:', error);
    }
  };

  useEffect(() => {
    if (posts.length > 0) {
      fetchMediaUrls();
    }
  }, [posts]);

  return (
    <div className="gridRealContainer">
      {posts.map((post) => (
        <button
          key={post.id}
          onClick={() => navigate(`/realtorcontent/postdetails/${post.id}`)} // Navigation with React Router
          className="gridRealItem"
        >
          <div className="mediaImageRealContainer">
            {mediaUris[post.id]?.length > 0 ? (
              mediaUris[post.id][0].type === 'video' ? (
                <div className='proRealPostVideoWrapper'>
                  <video 
                    className="proRealMedia"
                    controls
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <source src={mediaUris[post.id][0].url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  <div
                    className="proRealPostVideoOverlay" 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/realtorcontent/postdetails/${post.id}`);
                    }}
                  />
                </div>
              ) : (
                <img src={mediaUris[post.id][0].url} alt="Post" className="proRealMediaImage" />
              )
            ) : (
              <img src={DefaultImage} alt="Default" className="proRealMediaImage" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default MediaGrid;