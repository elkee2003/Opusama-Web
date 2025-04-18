import React, {useState} from 'react'
import { Tabs, Tab, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HouseRent from './HouseRentComponent';
import Hotel from './HotelComponent';
import Recreation from './RecreationComponent';
import NightLife from './NightlifeComponent';
import StudentAccommodation from './StudentAccommodationComponent';
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
          <Tab label="Recreation" />
          <Tab label="Nightlife" />
          <Tab label="Student Accommodation" />
          <Tab label="Property Sale" />
          <Tab label="Office Space" />
          {/* <Tab label="Food & Drinks" /> */}
          {/* <Tab label="Events & Halls" /> */}
        </Tabs>
      </div>
      
      <div className="client-tab-panel">
        {selectedTab === 0 && <HouseRent />}
        {selectedTab === 1 && <Hotel />}
        {selectedTab === 2 && <Recreation />}
        {selectedTab === 3 && <NightLife />}
        {selectedTab === 4 && <StudentAccommodation />}
        {selectedTab === 5 && <PropertySale />}
        {selectedTab === 6 && <OfficeSpace />}
        {/* {selectedTab === 7 && <FoodDrinks />} */}
        {/* {selectedTab === 8 && <EventHalls />} */}
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