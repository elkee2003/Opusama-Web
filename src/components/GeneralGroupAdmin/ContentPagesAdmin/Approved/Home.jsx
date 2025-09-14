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
            <Tab label="Events" />
            <Tab label="Venues" />
            <Tab label="Commercial Spaces" />
            <Tab label="Property Sale" />
            <Tab label="Office Spaces" />
            <Tab label="Food & Drinks" />
          </Tabs>
        </div>
      </div>
      
      <div className="client-tab-panel">
        {selectedTab === 0 && <HouseRent />}
        {selectedTab === 1 && <Hotel />}
        {selectedTab === 2 && <Experiences />}
        {selectedTab === 3 && <EventsTab />}
        {selectedTab === 4 && <Venues />}
        {selectedTab === 5 && <CommercialSpaces />}
        {selectedTab === 6 && <PropertySale />}
        {selectedTab === 7 && <OfficeSpace />}
        {selectedTab === 8 && <FoodDrinks />}
      </div>
    </div>
  )
}

export default Home;




















// import React, { useState } from 'react';
// import './Home.css';
// import HouseRent from './HouseRentComponent';
// import Hotel from './HotelComponent';
// import StudentAccommodation from './StudentAccommodationComponent';
// import PropertySale from './PropertySaleComponent';
// import OfficeSpace from './OfficeSpaceComponent';

// function Tabs() {
//   const [activeTab, setActiveTab] = useState('House (Rent)');

//   const tabs = ['House (Rent)', 'Hotel / Shortlet', 'Property Sale', 'Student Accommodation', 'Office Space' ];

//   return (
//     <div>
//       {/* Header with tabs */}
//       <header className="navbar">
//         {tabs.map((tab) => (
//           <div
//             key={tab}
//             className={`tab ${activeTab === tab ? 'active' : ''}`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab}
//           </div>
//         ))}
//       </header>

//       {/* Body */}
//       <main className="content">
//         {activeTab === "House (Rent)" && <HouseRent />}
//         {activeTab === "Hotel / Shortlet" && <Hotel />}
//         {activeTab === "Property Sale" && <PropertySale />}
//         {activeTab === "Student Accommodation" && <StudentAccommodation />}
//         {activeTab === "Office Space" && <OfficeSpace />}
//       </main>
//     </div>
//   );
// }

// export default Tabs;