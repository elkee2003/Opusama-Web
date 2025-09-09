import React, {useState} from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import DetailedPost from './ExploreDetailedPost/DetailedPost'
import PropertyDetailsMap from './PropertyDetailsMap/PropertyDetialsMap';
import '../../Home/TabStyles/PropertyDetails.css'

function PropertyDetails() {
  const [selectedTab, setSelectedTab] = useState(0);
    
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  return (
    <div>
      <div className='clientPropertyDetailsTabs-container'>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="navigation tabs"
        >
          <Tab label="Detailed Post" />
          <Tab label="Map" />
        </Tabs>
      </div>

      <div className='clientPropertyDetailsTabs-panel'>
        {selectedTab === 0 && <DetailedPost />}
        {selectedTab === 1 && <PropertyDetailsMap/>}
      </div>
      
    </div>
  )
}

export default PropertyDetails;
