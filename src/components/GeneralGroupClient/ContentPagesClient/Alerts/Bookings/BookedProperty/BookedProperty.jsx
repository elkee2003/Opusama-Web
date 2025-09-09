import React, {useState} from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import BookedPropertyDetails from './BookedPropertyDetails/BookedPropertyDetails';
import BookedPropertyMap from './BookedPropertyMap/BookedPropertyMap';
import './BookedProperty.css'

function FullBookingDetailsTab() {
  const [selectedTab, setSelectedTab] = useState(0);
    
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  return (
    <div>
      <div className='clientBookedPropertyTabs-container'>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="navigation tabs"
        >
          <Tab label="Detailed Booking" />
          <Tab label="Map" />
        </Tabs>
      </div>

      <div className='clientBookedPropertyTabs-panel'>
        {selectedTab === 0 && <BookedPropertyDetails />}
        {selectedTab === 1 && <BookedPropertyMap/>}
      </div>
      
    </div>
  )
}

export default FullBookingDetailsTab;
