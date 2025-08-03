import React, { useState, useEffect } from 'react';
import Placeholder from '/placeholder.png';
import './MainProfile.css'; 
import { useAuthContext } from '../../../../../../Providers/ClientProvider/AuthProvider';
import ProfileHead from './ProfileHead/ProfileHead';
import ProfileMediaList from './ProfileMediaList/ProfileMediaList';

const ProfilePage = () => {

  const { authUser } = useAuthContext();

  if (!authUser) {
    return (
      <div className='mainContainer'>
        <div className='profilePicContainer'>
          <img src={Placeholder} alt="Placeholder" className='img' />
        </div>
        <p className='emptyText'>Sign In</p>
        <div className='emptyBtnCon'>
          <button className='emptyBtnTxt' onClick={() => navigate('/?section=signin')}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='profileMainContainer'>
      <ProfileHead/>
      <ProfileMediaList/>
    </div>
  );
};

export default ProfilePage;