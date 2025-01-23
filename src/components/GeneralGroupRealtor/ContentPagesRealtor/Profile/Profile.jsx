import React from 'react';
import './Profile.css';
import { useAuthContext } from '../../../../../Providers/ClientProvider/AuthProvider';
import EditProfile from './EditProfile/EditProfile';
import MainProfile from './MainProfile/MainProfile';

function Profile() {
  const {dbRealtor} = useAuthContext();

  return (
    <div >
      {dbRealtor ?
        <MainProfile/>
      :
        <EditProfile/>
      }
    </div>
  )
}

export default Profile;
