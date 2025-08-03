import React, {useState} from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Notification from './Notifications/Notification';
import BookingList from './Bookings/BookingList/BookingList';
import './Alerts.css'

function Alerts() {
  const [selectedTab, setSelectedTab] = useState(0);
    
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  return (
    <div>
      <div className='clientAlertTabs-container'>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="navigation tabs"
        >
          <Tab label="Notification" />
          <Tab label="Bookings" />
        </Tabs>
      </div>

      <div className='clientAlertTabs-panel'>
        {selectedTab === 0 && <Notification />}
        {selectedTab === 1 && <BookingList/>}
      </div>
      
    </div>
  )
}

export default Alerts
