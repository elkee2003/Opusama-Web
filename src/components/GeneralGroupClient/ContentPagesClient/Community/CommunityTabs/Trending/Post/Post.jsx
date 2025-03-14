import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CommunityTabs.css';
import { MdDelete } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { FaRegCommentDots } from "react-icons/fa6";
import { formatDistanceStrict } from "date-fns";
import Select from 'react-select';
import { useAuthContext } from '../../../../../../../../Providers/ClientProvider/AuthProvider';
import { DataStore } from "aws-amplify/datastore";
import { CommunityDiscussion, CommunityReply, Realtor, User } from '../../../../../../../models';

function Post({post, onDelete}) {

    const [isFocus, setIsFocus] = useState(false);
    const navigate = useNavigate();
    const { dbUser } = useAuthContext();
    const [category, setCategory] = useState('');
    const [readMore, setReadMore] = useState(false);
    const [moreName, setMoreName] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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
        e.stopPropagation(); // Prevent navigating when clicking delete

        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
            await DataStore.delete(CommunityDiscussion, post.id);
            onDelete(post.id); // Update UI after deletion
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    // const categoryData = [
    //     { label: 'Neigbourhood Insights', value: 'Neigbourhood Insights' },
    //     { label: 'House Hunting Tips', value: 'House Hunting Tips' },
    //     { label: 'Scam Alerts', value: 'Scam Alerts' },
    //     { label: 'Moving & Relocation Advice', value: 'Moving & Relocation Advice' },
    //     { label: 'General Real Estate Discussion', value: 'General Real Estate Discussion' },
    // ];

  return (
    <div>

        {/* Drop Down */}
        {/* <Select
            className={'communityCategorySelect'}
            options={categoryData}
            placeholder="Select Category"
            value={categoryData.find((option) => option.value === category)}
            onChange={(selectedOption) => setCategory(selectedOption.value)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
        /> */}

        {/* Search Input */}
        {/* <input
            className="communitySearchInput"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        /> */}

        <div 
            key={post.id}
            onClick={()=>navigate(`/clientcontent/community_post/${post.id}`)}
        >

            {/* Category */}
            <p className='postCategory'>
                {post.category}
            </p>

            {/* Post Username and Time */}
            <div className='postUserTimeDeltCon'>
                {/* Username & Time */}
                <div className='postUserTimeCon'>
                    <p className='postUsername'>
                        {moreName || post.instigatorName.length <= 10
                        ? post.instigatorName
                        : `${post.instigatorName.substring(0, 12)}...`}
                    </p>
                    <p className='postTime'>
                        {formattedTime}
                    </p>
                </div>

                {/* Delete Button */}
                {dbUser?.id === post.instigatorID && (
                    <div 
                    className='deletePostBtnCon'
                    onClick={handleDelete}
                    >
                        <MdDelete className='deletePostIcon' />
                    </div>
                )}
            </div>

            {/* Title */}
            <div className="postTitleCon">
                <p className='postTitle'>
                    {post.title}
                </p> 
            </div>

            {/* Content */}
            <p className='postContent'>
                {readMore || post.content.length <= 150
                    ? post.content
                    : `${post.content.substring(0, 150)}...`}
                {post.content.length > 150 && (
                    <button
                    className={readMore ? 'readLessBtnCommun' : 'readMoreBtnCommun'}
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
            <div className='postEngagementCon'>
            <div className="engagementrow">
                <FaRegCommentDots className='engagementIcon'/>
                <p className='engagementNum'>
                    {post.numComments}
                </p>
            </div>

            <div className="engagementrow">
                <FaRegHeart className='engagementIcon'/>

                {/* This one is a filled heart it will be used to show that the dbuser like the particular post */}
                {/* <GoHeartFill className='engagementFilledHeart'/> */}
                <p className='engagementNum'>
                    {post.totalLikes}
                </p>
            </div>
            </div>

            {/* Border */}
            <div className='communBorder'/>
        </div>
    </div>
  )
}

export default Post;
