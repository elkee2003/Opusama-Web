import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Placeholder from '/placeholder.png';
import './MainProfile.css'; 
import { FaPhone } from 'react-icons/fa';
import { IoPerson } from 'react-icons/io5';
import { MdLocationOn, MdNavigateNext } from 'react-icons/md'; 
import { useProfileContext } from '../../../../../../Providers/ClientProvider/ProfileProvider';
import { useAuthContext } from '../../../../../../Providers/ClientProvider/AuthProvider';
import { signOut } from "aws-amplify/auth";
import { DataStore } from "aws-amplify/datastore";
import { User } from '../../../../../models';
import { getUrl } from 'aws-amplify/storage';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { firstName, lastName, username, profilePic, setProfilePic, address, phoneNumber } = useProfileContext();
  const { dbUser, authUser } = useAuthContext();
  const [loading, setLoading] = useState(true);

  // Fetch signed URL for profile picture
  const fetchImageUrl = async () => {
    setLoading(true);
    if (!dbUser?.profilePic) {
      setProfilePic(null);
      setLoading(false);
      return;
    }
    try {
      const result = await getUrl({
        path: dbUser.profilePic,
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
    if (!dbUser?.profilePic) return;

    fetchImageUrl();
    const subscription = DataStore.observe(User).subscribe(({ opType }) => {
      if (['INSERT', 'UPDATE', 'DELETE'].includes(opType)) fetchImageUrl();
    });

    return () => subscription.unsubscribe();
  }, [dbUser?.profilePic]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const onSignout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      handleSignOut();
    }
  };

  if (!authUser) {
    return (
      <div className='mainContainer'>
        <div className='profilePicContainer'>
          <img src={Placeholder} alt="Placeholder" className='img' />
        </div>
        <p className='emptyText'>Sign In</p>
        <div className='emptyBtnCon'>
          <button className='emptyBtnTxt' onClick={() => navigate('/')}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='mainContainer'>
      <div className='mainProfilePicContainer' onClick={() => navigate('/clientcontent/editprofile')}>
        {loading || !profilePic ? (
          <img src={Placeholder} alt="Placeholder" className='img' />
        ) : (
          <img src={profilePic} alt="Profile" className='img' />
        )}
      </div>
      <div className='pRow'>
        <IoPerson size={24} />
        <p className='pName'>{firstName}</p>
      </div>

      <div className='userProUsernameCon'>
        <p className='userProUsername'>@{username ? username : 'unknown'}</p>
      </div>
      
      <div className='pRow'>
        <FaPhone size={24} />
        <p className='pTxt'>{phoneNumber}</p>
      </div>
      <div className='pRow'>
        <MdLocationOn size={24} />
        <p className='pTxt'>{address}</p>
      </div>
      <div className='profileSubrow'>
        <button onClick={() => navigate('/clientcontent/editprofile')} className='mainSubHeader'>
          Edit Profile
        </button>
        <button onClick={() => navigate('/clientcontent/reviewprofile')} className='mainSubHeader'>
          View Info
        </button>
      </div>

      {/* Other Btns */}
      <div className='scrollable'>
        <button onClick={() => window.open('https://sites.google.com/view/opusama-termsofservice/home', '_blank')} className='btnCard'>
          <p className='proBtnTxt'>
            Terms and Conditions
          </p>
          <MdNavigateNext size={24} />
        </button>
        <button onClick={() => window.open('https://sites.google.com/view/opusama/home', '_blank')} className='btnCard'>
          <p className='proBtnTxt'>
            Privacy Policy
          </p>
          <MdNavigateNext size={24} />
        </button>
        <button onClick={() => navigate('/clientcontent/support')} className='btnCard'>
          <p className='proBtnTxt'>
            Support
          </p>
          <MdNavigateNext size={24} />
        </button>
        <button onClick={onSignout} className='btnCard'>
          <p className='proBtnTxt'>
            Sign Out
          </p>
          <MdNavigateNext size={24} />
        </button>
        <button onClick={() => navigate('/clientcontent/deleteaccount')} className='btnCard'>
          <p className='proBtnTxt'>
            Delete Account
          </p>
          <MdNavigateNext size={24} />
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;