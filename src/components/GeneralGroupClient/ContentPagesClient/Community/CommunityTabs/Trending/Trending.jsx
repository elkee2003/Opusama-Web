import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CommunityTabs.css';
import { useAuthContext } from '../../../../../../../Providers/ClientProvider/AuthProvider'; 
import { FaRegHeart } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { FaRegCommentDots } from "react-icons/fa6";
import Select from 'react-select';
import { DataStore } from "aws-amplify/datastore";
import { CommunityDiscussion, CommunityReply, Realtor, User } from '../../../../../../models';

const Trending = () => {

  const [isFocus, setIsFocus] = useState(false);
  const {dbUser, authUser} = useAuthContext()
  const navigate = useNavigate();
  const [posts, setPosts] = useState([])
  const [category, setCategory] = useState('');
  const [readMore, setReadMore] = useState(false);
  const [moreName, setMoreName] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const categoryData = [
      { label: 'Neigbourhood Insights', value: 'Neigbourhood Insights' },
      { label: 'House Hunting Tips', value: 'House Hunting Tips' },
      { label: 'Scam Alerts', value: 'Scam Alerts' },
      { label: 'Moving & Relocation Advice', value: 'Moving & Relocation Advice' },
      { label: 'General Real Estate Discussion', value: 'General Real Estate Discussion' },
  ];

  const fetchInstigatorAndPost = async () => {

    try {
      setLoading(true);

      // Step 1: Query all instigators
      const realtors = await DataStore.query(Realtor);

      const users = await DataStore.query(User);

      const discussions = await DataStore.query(CommunityDiscussion);

      // Step 2: Use map and Promise.all to fetch posts for each instigator
      const enhancedPosts = await Promise.all(
        discussions.map(async (post) => {
          const instigator = realtors.find((r) => r.id === post.instigatorID) || users.find((u) => u.id === post.instigatorID);

          // Fetch all replies related to this post
          const replies = await DataStore.query(CommunityReply, (r) => r.communitydiscussionID.eq(post.id));

          // Count only replies where `comment` is not empty or null
          const numComments = replies.filter(reply => reply.comment && reply.comment.trim() !== "").length;

          // Calculate total likes across all replies
          const totalLikes = replies.reduce((sum, reply) => sum + (reply.like || 0), 0);

          // Fetch commenter details for each reply
          const repliesWithCommenters = await Promise.all(
            replies.map(async (reply) => {
              const commenter = realtors.find((r) => r.id === reply.commenterID) ||
                                users.find((u) => u.id === reply.commenterID);
              return {
                ...reply,
                commenterName: commenter ? commenter.firstName : "Unknown",
                commenterProfilePic: commenter ? commenter.profilePic : null,
              };
            })
          );

          return {
            ...post,
            instigatorName: instigator ? instigator.firstName : 'Unknown',
            numComments,
            totalLikes,
            replies: repliesWithCommenters
          };
        })
      );

      setPosts(enhancedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      
    } catch (error) {
      console.error('Error fetching posts', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(()=>{
    fetchInstigatorAndPost();

    const subscription = DataStore.observe(CommunityDiscussion).subscribe(({opType})=>{
    if(opType === "UPDATE"){
        fetchInstigatorAndPost();
    }
    });

    return () => subscription.unsubscribe();
  },[])

  return (
    <div className="communityCon">

      <Select
        className={'communityCategorySelect'}
        options={categoryData}
        placeholder="Select Category"
        value={categoryData.find((option) => option.value === category)}
        onChange={(selectedOption) => setCategory(selectedOption.value)}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />

      {/* Search Input */}
      <input
        className="communitySearchInput"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {loading ? (
        <div className="communLoading-container">
            <div className="communSpinner" />
            <h2>Loading...</h2>
        </div>
      ) : (posts.map((post)=>(
        <div 
          key={post.id}
          onClick={()=>navigate(`/clientcontent/community_post/${post.id}`)}
        >

          {/* Category */}
          <p className='postCategory'>
            {post.category}
          </p>

          {/* Post Username and Time */}
          <div className='postUserTimeCon '>
            <p className='postUsername'>
              {moreName || post.instigatorName.length <= 10
              ? post.instigatorName
              : `${post.instigatorName.substring(0, 12)}...`}
            </p>
            <p className='postTime'>
              {new Date(post.createdAt).toDateString()}
            </p>
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
      ))
      )}

      {/* Refresh Btn */}
      <div className='refreshCommunCon'>
          {/* <button onClick={handleRefresh} className='refreshButton'>
              {refreshing ? "Refreshing..." : "Refresh"}
          </button> */}
      </div>
    </div>
  );
};

export default Trending;