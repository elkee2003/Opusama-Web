import React, {useState} from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Notification from './Notifications/Notification';
import AdminBookingList from './Bookings/BookingList/BookingList';
import PlatformBookings from './PlatformBookings/PlatformBookings';
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
          <Tab label="Admin Bookings" />
          <Tab label="Opusama Bookings" />
        </Tabs>
      </div>

      <div className='clientAlertTabs-panel'>
        {selectedTab === 0 && <Notification />}
        {selectedTab === 1 && <AdminBookingList/>}
        {selectedTab === 2 && <PlatformBookings/>}
      </div>
      
    </div>
  )
}

export default Alerts
