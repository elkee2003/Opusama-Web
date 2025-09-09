import React, {useState} from 'react'
import { Tabs, Tab, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HouseRent from './HouseRentComponent';
import Hotel from './HotelComponent';
import Experiences from './ExperiencesComponent';
import EventsTab from './EventsComponent'
import Venues from './VenuesComponent';
import FoodDrinks from './FoodDrinksComponent'
import CommercialSpaces from './CommercialSpacesComponent';
import PropertySale from './PropertySaleComponent';
import OfficeSpace from './OfficeSpaceComponent';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div className='client-HomeMain-Con'>
      <div className='logoTabCon'>
        {/* logo */}
        <div 
            className='client-logoForSmallScreen'
        >
            <img 
                src={'/opusama.png'}
                alt="logo" 
                onClick={() => navigate('/')}
            />
        </div>

        {/* Toptab */}
        <div className="client-tabs-container">
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="navigation tabs"
          >
            <Tab label="House" />
            <Tab label="Hotel / Shortlet" />
            <Tab label="Experiences" />
            <Tab label="Food & Drinks" />
            <Tab label="Property Sale" />
            <Tab label="Venues" />
            <Tab label="Events" />
            <Tab label="Commercial Spaces" />
            <Tab label="Office Spaces" />
          </Tabs>
        </div>
      </div>
      
      <div className="client-tab-panel">
        {selectedTab === 0 && <HouseRent />}
        {selectedTab === 1 && <Hotel />}
        {selectedTab === 2 && <Experiences />}
        {selectedTab === 3 && <FoodDrinks />}
        {selectedTab === 4 && <PropertySale />}
        {selectedTab === 5 && <Venues />}
        {selectedTab === 6 && <EventsTab />}
        {selectedTab === 7 && <CommercialSpaces />}
        {selectedTab === 8 && <OfficeSpace />}
      </div>
    </div>
  )
}

export default Home;

