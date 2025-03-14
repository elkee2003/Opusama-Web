import React, { useState, useEffect } from 'react';
import { FaRegHeart } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { FaRegCommentDots } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import './Content.css'; 
import { useAuthContext } from '../../../../../../../../Providers/ClientProvider/AuthProvider';
import { useNavigate} from "react-router-dom";
import { formatDistanceStrict } from "date-fns";
import UsersComment from './UsersComment';
import { DataStore } from "aws-amplify/datastore";
import { CommunityDiscussion } from '../../../../../../../models';

const Content = ({post, onDelete}) => {
    const navigate = useNavigate();
    const [readMore, setReadMore] = useState(false);
    const {authUser, dbUser} = useAuthContext();

    // Time format
    const formattedTime = post.createdAt
    ? formatDistanceStrict(new Date(post.createdAt), new Date(), { addSuffix: true })
        .replace(" seconds", "s")
        .replace(" second", "s")
        .replace(" minutes", "m")
        .replace(" minute", "m")
        .replace(" hours", "h")
        .replace(" hour", "h")
        .replace(" days", "d")
        .replace(" day", "d")
        .replace(" weeks", "w")
        .replace(" week", "w")
        .replace(" months", "mo")
        .replace(" month", "mo")
        .replace(" years", "y")
        .replace(" year", "y")
    : "Just now";

    // Delete Post Function
    const handleDelete = async (e) => {
        e.stopPropagation(); // Prevent unintended navigation

        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
            await DataStore.delete(CommunityDiscussion, post.id);
            onDelete(post.id); 
            navigate(-1);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    // Navigate function
    const handleNavigate = () => {
      if(authUser){
        navigate('/clientcontent/create_post');
      }else{
        alert('Sign In to access')
        navigate('/')
      }
    };

    const handleNavigateToReply = () => {
      if(authUser){
        navigate(`/clientcontent/response_post/${post.id}`);
      }else{
        alert('Sign In to access')
        navigate('/')
      }
    };

  return (
    <div className="communityDetailedPostCon">

        {/* Category */}
        <p className='detPostCategory'>
            {post.category}
        </p>

        {/* Post Username and Time */}
        <div className="detPostUserTimeDeltCon">
          <div className="detPostUserTimeCon">
            <p>{post.instigatorName}</p>
            <p className='detPostTime'>
              {formattedTime}
            </p>
          </div>

          {/* Delete Button */}
          {dbUser?.id === post.instigatorID && (
              <div className='deltContentCon' onClick={handleDelete}>
                  <MdDelete className='deltContentIcon' />
              </div>
          )}
        </div>

        {/* Title */}
        <div className="detPostTitleCon">
          <p className='detPostTitle'>
            {post.title}
          </p> 
        </div>

        {/* Post Content */}
        <p className='detPostContent'>
          {readMore || post.content.length <= 750
            ? post.content
            : `${post.content.substring(0, 750)}...`}
          {post.content.length > 750 && (
            <button
              className={readMore ? 'readLessBtnComment' : 'readMoreBtnComment'}
              onClick={(e) => {
                e.stopPropagation();
                setReadMore(!readMore)
              }}
            >
              {readMore ? 'Show Less' : 'Read More'}
            </button>
          )}
        </p>

        {/* Post Engagment */}
        <div className='detPostEngagementCon'>
            <div className="detEngagementrow">
              <FaRegCommentDots className='detEngagementIcon'/>
              <p className='detEngagementNum'>
                {post.numComments}
              </p>
            </div>

            <div className="detEngagementrow">
              <FaRegHeart className='detEngagementIcon'/>

              {/* This one is a filled heart it will be used to show that the dbuser like the particular post */}
              {/* <GoHeartFill className='detEngagementFilledHeart'/> */}
              <p className='detEngagementNum'>
                {post.totalLikes}
              </p>
            </div>
        </div>

        <div className='detCommentBorder'/>

        {/* Users Comments */}
        <UsersComment replies={post.replies}/>

        {/* Place holder to write comment */}
        <div 
            className="writeResCon"
            onClick={handleNavigateToReply}
        >
            <p className='writeRes'>Write comment...</p>
        </div>


        {/* Floating Create Post Icon */}
        <div 
            className='addIconCon'
            onClick={handleNavigate}
        >
            <IoMdAdd className='addIcon'/>
        </div>
    </div>
  );
};

export default Content;