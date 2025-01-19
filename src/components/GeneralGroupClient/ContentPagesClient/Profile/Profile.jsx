import React from 'react';
import './Profile.css';
import { useAuthContext } from '../../../../../Providers/ClientProvider/AuthProvider';
import EditProfile from './EditProfile/index';
import MainProfile from './MainProfile/MainProfile';

function Profile() {
  const {dbUser} = useAuthContext();

  return (
    <div >
      {dbUser ?
        <MainProfile/>
      :
        <EditProfile/>
      }
    </div>
  )
}

export default Profile
