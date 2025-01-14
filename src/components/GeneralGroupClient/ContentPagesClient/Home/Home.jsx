import React, { useState } from 'react';
import './Home.css';
import HouseRent from './HouseRentComponent';
import Hotel from './HotelComponent';
import StudentAccommodation from './StudentAccommodationComponent';
import PropertySale from './PropertySaleComponent';
import OfficeSpace from './OfficeSpaceComponent';

function Tabs() {
  const [activeTab, setActiveTab] = useState('Home');

  const tabs = ['House (Rent)', 'Hotel / Shortlet', 'Property Sale', 'Student Accommodation', 'Office Space' ];

  return (
    <div>
      {/* Header with tabs */}
      <header className="navbar">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </header>

      {/* Body */}
      <main className="content">
        {activeTab === "House (Rent)" && <HouseRent />}
        {activeTab === "Hotel / Shortlet" && <Hotel />}
        {activeTab === "Property Sale" && <PropertySale />}
        {activeTab === "Student Accommodation" && <StudentAccommodation />}
        {activeTab === "Office Space" && <OfficeSpace />}
      </main>
    </div>
  );
}

export default Tabs;