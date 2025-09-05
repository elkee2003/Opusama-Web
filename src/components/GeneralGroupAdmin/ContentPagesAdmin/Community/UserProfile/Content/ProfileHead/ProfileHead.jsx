import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Placeholder from '/placeholder.png';
import './ProfileHead.css';
import { getUrl } from 'aws-amplify/storage';
import { use } from 'react';

const ProfileHead = ({post}) => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch signed URL for profile picture
  const fetchImageUrl = async () => {
    setLoading(true);
    if (!post?.instigatorProfilePic) {
      setProfilePic(null);
      setLoading(false);
      return;
    }
    try {
      const result = await getUrl({
        path: post.instigatorProfilePic,
        options: { validateObjectExistence: true, expiresIn: null },
      });
      setProfilePic(result?.url || null);
    } catch (error) {
      console.error('Error fetching profile pic URL:', error);
      setProfilePic(null);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchImageUrl();
}, [post?.instigatorProfilePic]);


  return (
    <div className='clientProfileHeadCon'>

      <div className='mainProfilePicContainer'>
        {loading || !profilePic ? (
          <img src={Placeholder} alt="Placeholder" className='img' />
        ) : (
          <img src={profilePic} alt="Profile" className='img' />
        )}
      </div>
      <div className='pRow'>
        {/* <IoPerson size={24} /> */}
        <p className='pName'>{post.instigatorName}</p>
      </div>

      <div className='userProUsernameCon'>
        <p className='userProUsername'>@{post?.instigatorUsername}</p>
      </div>

      {/* Profile Content Title */}
      <div>
        <p className='profileContentTitle'>POSTS</p>
      </div>
    </div>
  );
};

export default ProfileHead;