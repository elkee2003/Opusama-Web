import React from 'react';
import './Profile.css';
import EditProfile from './EditProfile';
import { signOut } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';


function Profile() {
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await signOut({ global: true });
      navigate('/');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }
  return (
    <div >
      <h1 className='title'>Edit Profile</h1>
      <p onClick={handleSignOut}>Sign Out</p>
      <EditProfile/>
    </div>
  )
}

export default Profile
