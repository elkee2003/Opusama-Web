import React, {useState, useEffect} from 'react';
import { FaRegHeart } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { FaRegCommentDots } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { getUrl } from "aws-amplify/storage";

function UserProfile({post}) {
    const navigate = useNavigate();
    const [readMore, setReadMore] = useState(false);
    const [moreName, setMoreName] = useState(false);
    const [mediaUris, setMediaUris] = useState([]);
    const [fullscreenMedia, setFullscreenMedia] = useState(null);

     // ✅ Fetch media URLs from S3
    const fetchMediaUrls = async () => {
        if (!post.media?.length) return;

        try {
            const urls = await Promise.all(
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
                    type: path.endsWith('.mp4') ? 'video' : 'image',
                };
                })
            );
            setMediaUris(urls);
        } catch (error) {
            console.error("Error fetching media URLs:", error);
        }
    };

    useEffect(() => {
        fetchMediaUrls();
    }, [post.media]);


  return (
    <div
        className='userProfileContentCon'
        onClick={()=>navigate(`/realtorcontent/community_post/${post.id}`)}
    >

        {/* Category */}
        <p className='postCategory'>
            {post.category}
        </p>

        {/* Title */}
        <div className="postTitleCon">
            <p className='postTitle'>
                {post.title}
            </p> 
        </div>
        <p>{post.content}</p>
        <p>{post.formattedTime}</p>

        {/* ✅ Display media */}
        {mediaUris.length > 0 && (
            <div className="display-media-community">
            {mediaUris.map((media, index) =>
                media.type === 'video' ? (
                <video
                    key={index}
                    src={media.url}
                    controls
                    className="pCommunityMedia"
                    onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenMedia(media.url);
                    }}
                />
                ) : (
                <img
                    key={index}
                    src={media.url}
                    alt={`Post media ${index}`}
                    className="pCommunityImage"
                    loading="lazy"
                    onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenMedia(media.url);
                    }}
                />
                )
            )}
            </div>
        )}

        {/* Engagement */}
        <div className='postEngagementCon'>
            <div className="engagementrow">
                <FaRegCommentDots className='engagementIcon' />
                <p className='engagementNum'>{post.numComments}</p>
            </div>

            <div className="engagementrow">
                <FaRegHeart className='engagementIcon' />
                <p className='engagementNum'>{post.totalLikes}</p>
            </div>
        </div>

        {/* Border */}
        <div className='communBorder'/>

        {/* ✅ Fullscreen Overlay for media */}
        {fullscreenMedia && (
            <div
                className="fullscreen-overlay"
                onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenMedia(null);
                }}
            >
            {fullscreenMedia.endsWith('.mp4') ? (
                <video 
                    src={fullscreenMedia}   controls    className="fullscreen-image" 
                />
            ) : (
                <img
                    src={fullscreenMedia}
                    alt="Full media view"
                    className="fullscreen-image"
                />
            )}
            </div>
        )}
        
    </div>
  )
}

export default UserProfile;
