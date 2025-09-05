import React, {useState, useEffect} from 'react';
import './Content.css';
import { FaRegHeart } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { FaRegCommentDots } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

function UserProfile({post}) {
    const navigate = useNavigate();
    const [readMore, setReadMore] = useState(false);
    const [moreName, setMoreName] = useState(false);
  return (
    <div
        className='userProfileContentCon'
        onClick={()=>navigate(`/clientcontent/community_post/${post.id}`)}
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
        
    </div>
  )
}

export default UserProfile;
