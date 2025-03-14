import React, {useState} from 'react';
import './Community.css'
import { Tabs, Tab, Box } from '@mui/material';
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import Trending from './CommunityTabs/Trending/Trending';
import Latest from './CommunityTabs/Latest/Latest';

function Community() {
    const navigate = useNavigate();

    const [selectedTab, setSelectedTab] = useState(0);
  
    const handleTabChange = (event, newValue) => {
      setSelectedTab(newValue);
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
          <Tab label="Trending" />
          <Tab label="Latest" />
        </Tabs>
      </div>
      <div className="communityTab-panel">
        {selectedTab === 0 && <Trending />}
        {selectedTab === 1 && <Latest />}
      </div>

      <div 
        className='addIconCon'
        onClick={()=>navigate('/clientcontent/create_post')}
      >
        <IoMdAdd className='addIcon'/>
      </div>
    </div>
  )
}

export default Community;