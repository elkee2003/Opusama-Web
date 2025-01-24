import React, {useState} from 'react';
import './Alert.css'
import { Tabs, Tab, Box } from '@mui/material';
import PendingAlertList from './PendingAlerts/ShortAlertList/ShortAlertList'
import AcceptedAlertList from './AccceptedAlerts/ShortAlertList/ShortAlertList';

function Alert() {
    const [selectedTab, setSelectedTab] = useState(0);
  
    const handleTabChange = (event, newValue) => {
      setSelectedTab(newValue);
    };
  
  return (
    <div>
      <div className="tabs-container">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="navigation tabs"
        >
          <Tab label="Pending Alert" />
          <Tab label="Accepted Alert" />
        </Tabs>
      </div>
      <div className="tab-panel">
        {selectedTab === 0 && <PendingAlertList />}
        {selectedTab === 1 && <AcceptedAlertList />}
      </div>
    </div>
  )
}

export default Alert
