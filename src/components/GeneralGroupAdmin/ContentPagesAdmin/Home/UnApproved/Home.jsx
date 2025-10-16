import React, {useState, useEffect} from 'react'
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
import { DataStore } from 'aws-amplify/datastore';
import {Post} from '../../../../../models';
import './Home.css';

function Approved() {
    const navigate = useNavigate();

    const [selectedTab, setSelectedTab] = useState(0);
    const [unapprovedCount, setUnApprovedCount] = useState(0);
  
    const handleTabChange = (event, newValue) => {
      setSelectedTab(newValue);
    };

    // 🟢 Fetch only unapproved posts
    const fetchUnApprovedPosts = async () => {
      try {
        const unapprovedPosts = await DataStore.query(Post, (p) => p.isApproved.eq(false));
        setUnApprovedCount(unapprovedPosts.length);
      } catch (error) {
        console.log('Error fetching unapproved posts:', error);
      }
    };

    // 🟡 Fetch once on mount + subscribe to real-time updates
    useEffect(() => {
      fetchUnApprovedPosts();

      const subscription = DataStore.observe(Post).subscribe(({ opType, element }) => {
        if (opType === 'INSERT' || opType === 'UPDATE' || opType === 'DELETE') {
          fetchUnApprovedPosts();
        }
      });

      return () => subscription.unsubscribe();
    }, []);
  
  return (
    <div>
      <div className="homeApproved-Tabs-container">
        {/* listing number */}
        <p className='listingNumberTxt'>{unapprovedCount}</p>
        
        <div >
          {/* Top Tabs */}
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
            <Tab label="Events" />
            <Tab label="Venues" />
            <Tab label="Commercial Spaces" />
            <Tab label="Office Spaces" />
          </Tabs>
        </div>
      </div>
      
      <div className="homeApproved-Tab-panel">
        {selectedTab === 0 && <HouseRent />}
        {selectedTab === 1 && <Hotel />}
        {selectedTab === 2 && <Experiences />}
        {selectedTab === 3 && <FoodDrinks />}
        {selectedTab === 4 && <PropertySale />}
        {selectedTab === 5 && <EventsTab />}
        {selectedTab === 6 && <Venues />}
        {selectedTab === 7 && <CommercialSpaces />}
        {selectedTab === 8 && <OfficeSpace />}
      </div>

    </div>
  )
}

export default Approved;

// function Approved() {
//   const navigate = useNavigate();
//   const [selectedTab, setSelectedTab] = useState(0);

//   const handleTabChange = (event, newValue) => {
//     setSelectedTab(newValue);
//   };

//   return (
//     <div className='admin-HomeMain-Con'>

//       {/* Toptab */}
//       <div className="admin-tabs-container">
//         <Tabs
//           value={selectedTab}
//           onChange={handleTabChange}
//           variant="scrollable"
//           scrollButtons="auto"
//           aria-label="navigation tabs"
//         >
//           <Tab label="House" />
//           <Tab label="Hotel / Shortlet" />
//           <Tab label="Experiences" />
//           <Tab label="Events" />
//           <Tab label="Venues" />
//           <Tab label="Commercial Spaces" />
//           <Tab label="Property Sale" />
//           <Tab label="Office Spaces" />
//           <Tab label="Food & Drinks" />
//         </Tabs>
//       </div>
      
//       <div className="admin-tab-panel">
//         {selectedTab === 0 && <HouseRent />}
//         {selectedTab === 1 && <Hotel />}
//         {selectedTab === 2 && <Experiences />}
//         {selectedTab === 3 && <EventsTab />}
//         {selectedTab === 4 && <Venues />}
//         {selectedTab === 5 && <CommercialSpaces />}
//         {selectedTab === 6 && <PropertySale />}
//         {selectedTab === 7 && <OfficeSpace />}
//         {selectedTab === 8 && <FoodDrinks />}
//       </div>
//     </div>
//   )
// }

// export default Approved;