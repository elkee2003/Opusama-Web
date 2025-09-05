import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultImage from '/defaultImage.png';
import { getUrl } from 'aws-amplify/storage';
import './MediaGrid.css';

const MediaGrid = ({ posts }) => {
  const [mediaUris, setMediaUris] = useState({});
  const navigate = useNavigate();

  // Fetch first media only
  const fetchFirstMediaUrls = async () => {
    try {
      const urlsByPost = await Promise.all(
        posts.map(async (post) => {
          if (!post.media || post.media.length === 0) {
            return { [post.id]: null };
          }

          const firstPath = post.media[0];

          try {
            const result = await getUrl({
              path: firstPath,
              options: {
                validateObjectExistence: true,
                expiresIn: null,
              },
            });

            return {
              [post.id]: {
                url: result.url.toString(),
                type: firstPath.endsWith('.mp4') ? 'video' : 'image',
              },
            };
          } catch (err) {
            console.error(`Error fetching media for post ${post.id}:`, err);
            return { [post.id]: null };
          }
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
      fetchFirstMediaUrls();
    }
  }, [posts]);

  return (
    <div className="gridContainer">
      {posts.map((post) => {
        const media = mediaUris[post.id];

        return (
          <button
            key={post.id}
            onClick={() => navigate(`/clientcontent/detailedpost/${post.id}`)}
            className="gridItem"
          >
            <div className="mediaImageContainer">
              {media ? (
                media.type === 'video' ? (
                  <div className="realPostVideoWrapper">
                    <video
                      className="realMedia"
                      controls
                      controlsList="nodownload"
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <source src={media.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>

                    <div
                      className="realPostVideoOverlay"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/clientcontent/detailedpost/${post.id}`);
                      }}
                    />
                  </div>
                ) : (
                  <img
                    src={media.url}
                    alt="Post"
                    className="realMediaImage"
                    loading="lazy"
                  />
                )
              ) : (
                <img
                  src={DefaultImage}
                  alt="Default"
                  className="realMediaImage"
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default MediaGrid;