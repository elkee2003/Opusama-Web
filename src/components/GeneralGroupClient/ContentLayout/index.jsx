// components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom"; 
import ContentTabsClient from "../ContentTabsClient";
import './ContentLayout.css';

const Layout = () => {
  return (
    <div className="client-layoutCon">
      {/* Sidebar */}
      <ContentTabsClient />
      
      {/* Main Content */}
      <div className="client-main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;