import React, {useState} from 'react';
import './Alert.css'
import { Tabs, Tab, Box } from '@mui/material';
import Notification from './Notifications/Notification';
import PendingAlertList from './PendingAlerts/ShortAlertList/ShortAlertList'
import AcceptedAlertList from './AcceptedAlerts/ShortAlertList/ShortAlertList';

function Alert() {
    const [selectedTab, setSelectedTab] = useState(0);
  
    const handleTabChange = (event, newValue) => {
      setSelectedTab(newValue);
    };
  
  return (
    <div>
      <div className="aTabs-container">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="navigation tabs"
        >
          <Tab label="Notification" />
          <Tab label="Pending Alert" />
          <Tab label="Accepted Alert" />
        </Tabs>
      </div>
      <div className="aTab-panel">
        {selectedTab === 0 && <Notification />}
        {selectedTab === 1 && <PendingAlertList />}
        {selectedTab === 2 && <AcceptedAlertList />}
      </div>
    </div>
  )
}

export default Alert
