// components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom"; 
import ContentTabsClient from "../ContentTabsClient";
import './ContentLayout.css';

const Layout = () => {
  return (
    <div className="layoutCon">
      {/* Sidebar */}
      <ContentTabsClient />
      
      {/* Main Content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;