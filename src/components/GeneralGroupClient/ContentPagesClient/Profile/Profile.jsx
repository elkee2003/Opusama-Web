import React from 'react';
import './Profile.css';
import EditProfile from './EditProfile/index';
import { useNavigate } from 'react-router-dom';


function Profile() {
  const navigate = useNavigate();
  return (
    <div >
      <EditProfile/>
    </div>
  )
}

export default Profile
