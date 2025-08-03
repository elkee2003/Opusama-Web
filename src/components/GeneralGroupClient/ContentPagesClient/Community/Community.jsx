import React, {useState} from 'react';
import './Community.css'
import { Tabs, Tab, Box } from '@mui/material';
import { IoMdAdd } from "react-icons/io";
import { useAuthContext } from '../../../../../Providers/ClientProvider/AuthProvider';
import { useNavigate } from 'react-router-dom';
import Latest from './CommunityTabs/Latest/Latest';
import Popular from './CommunityTabs/Popular/Popular';

function Community() {
    const navigate = useNavigate();
    const {authUser} = useAuthContext();

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
      <div className="communityTabs-container">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="navigation tabs"
        >
          <Tab label="Latest" />
          <Tab label="Popular" />
        </Tabs>
      </div>
      
      <div className="communityTab-panel">
        {selectedTab === 0 && <Latest />}
        {selectedTab === 1 && <Popular />}
      </div>

      <div 
        className='addIconCon'
        onClick={handleNavigate}
      >
        <IoMdAdd className='addIcon'/>
      </div>
    </div>
  )
}

export default Community;