import React, {useState} from 'react';
import '../../../../TabStyles/TopTab.css'
import { Tabs, Tab, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserReviews from './Content/UsersReviews';
import UsersComment from './Content/UsersComment';

function ReviewCommentTab() {
    const navigate = useNavigate();

    const [selectedTab, setSelectedTab] = useState(0);
  
    const handleTabChange = (event, newValue) => {
      setSelectedTab(newValue);
    };

  
  return (
    <div>
      <div className="topTabs-container">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="navigation tabs"
        >
          <Tab label="Ratings & Review" />
          <Tab label="Comments" />
        </Tabs>
      </div>
      <div className="topTab-panel">
        {selectedTab === 0 && <UserReviews />}
        {selectedTab === 1 && <UsersComment />}
      </div>
    </div>
  )
}

export default ReviewCommentTab;