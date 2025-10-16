import React, {useState} from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import TotalBookings from './TotalBookings/ShortAlertList/ShortAlertList';
import PaidBookings from './PaidBookings/ShortAlertList/ShortAlertList';
import './PlatformBookings.css'

function PlatformBookings() {
  const [selectedTab, setSelectedTab] = useState(0);
    
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  return (
    <div>
      <div className='platformBookingsTabs-container'>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="navigation tabs"
        >
          <Tab label="Total Bookings" />
          <Tab label="Paid Bookings" />
        </Tabs>
      </div>

      <div className='platformBookingsTabs-panel'>
        {selectedTab === 0 && <TotalBookings />}
        {selectedTab === 1 && <PaidBookings/>}
      </div>
      
    </div>
  )
}

export default PlatformBookings;
