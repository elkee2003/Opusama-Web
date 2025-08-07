import React, {useState} from 'react';
import './ProfileTab.css'
import { Tabs, Tab, Box } from '@mui/material';
import UserPost from './ProfileTabs/UserPost/UserPost';
import UserReplies from './ProfileTabs/UserReplies/UserReplies';
import Favourite from './ProfileTabs/Favourite/Favourite';

function ProfileTab() {
    const [selectedTab, setSelectedTab] = useState(0);
  
    const handleTabChange = (event, newValue) => {
      setSelectedTab(newValue);
    };

    // Navigate function
    const handleNavigate = () => {
      if(authUser){
        navigate('/clientcontent/create_post');
      }else{
        alert('Sign In to access')
        navigate('/?section=signin');
      }
    };
  
  return (
    <div>
      <div className="clientProfTabs-container">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="navigation tabs"
        >
          <Tab label="Posts" />
          <Tab label="Replies" />
          <Tab label="Favourite" />
        </Tabs>
      </div>
      
      <div className="clientProfTab-panel">
        {selectedTab === 0 && <UserPost />}
        {selectedTab === 1 && <UserReplies/>}
        {selectedTab === 2 && <Favourite />}
      </div>
    </div>
  )
}

export default ProfileTab;