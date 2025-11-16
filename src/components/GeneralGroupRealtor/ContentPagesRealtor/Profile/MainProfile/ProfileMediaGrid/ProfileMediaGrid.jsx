import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultImage from '/defaultImage.png';
import { getUrl } from 'aws-amplify/storage';
import './ProfileMediaGrid.css';

const MediaGrid = ({ posts }) => {
  const [mediaUris, setMediaUris] = useState({});
  const navigate = useNavigate();

  // Fetch first media
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
    <div className="gridRealContainer">
      {posts.map((post) => {
        const media = mediaUris[post.id];

        return (
          <button
            key={post.id}
            onClick={() => navigate(`/realtorcontent/postdetails/${post.id}`)}
            className="gridRealItem"
          >
            <div className="mediaImageRealContainer">
              {media ? (
                media.type === 'video' ? (
                  <div className="proRealPostVideoWrapper">
                    <video
                      className="proRealMedia"
                      controls
                      controlsList="nodownload"
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <source src={media.url} type="video/mp4" />
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
                  <img
                    src={media.url}
                    alt="Post"
                    className="proRealMediaImage"
                    loading="lazy"
                  />
                )
              ) : (
                <img
                  src={DefaultImage}
                  alt="Default"
                  className="proRealMediaImage"
                />
              )}

              {post.isSubscription && <div className='subscribeLabelRealtorProfile'>
                <p>Subscription</p>
              </div>}

              {/* Unavailable Label */}
              {!post.available && <div className='unavailableLabelRealtorProfile'>
                <p>Unavailable</p>
              </div>}

              {/* Interrupted */}
              {post.uploadStatus !== "COMPLETED" && <div className='unavailableLabelRealtorProfile'>
                <p>Continue Upload</p>
              </div>}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default MediaGrid;