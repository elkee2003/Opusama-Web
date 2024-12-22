// components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom"; 
import ContentTabsRealtor from "../ContentTabsRealtor";
import './ContentLayout.css';

const Layout = () => {
  return (
    <div className="layout">
      {/* Sidebar */}
      <ContentTabsRealtor />
      
      {/* Main Content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;