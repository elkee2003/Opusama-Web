// components/Layout.jsx
import React, {useState, useEffect} from "react";
import { Outlet } from "react-router-dom"; 
import ContentTabsClient from "../ContentTabsClient";
import './ContentLayout.css';
import {FaBell} from 'react-icons/fa';
import { useAuthContext } from "../../../../Providers/ClientProvider/AuthProvider";
import { ToastContainer, toast } from 'react-toastify';
import { DataStore } from 'aws-amplify/datastore';
import { Notification } from "../../../models";

const Layout = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { dbUser } = useAuthContext();

  useEffect(() => {
    if (!dbUser?.id) return;

    const fetchNotifications = async () => {
      const all = await DataStore.query(Notification, n =>
        n.recipientID.eq(dbUser.id)
      );
      const unread = all.filter(n => !n.read);
      setUnreadCount(unread.length);
    };

    fetchNotifications();

    const subscription = DataStore.observe(Notification).subscribe(msg => {
      if (msg.opType === 'INSERT' && msg.element.recipientID === dbUser.id) {
        toast.info(
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaBell />  {msg.element.message}
          </div>
        );
        setUnreadCount(prev => prev + 1);
      }
    });

    return () => subscription.unsubscribe();
  }, [dbUser]);

  return (
    <div className="client-layoutCon">
      {/* Sidebar */}
      <ContentTabsClient unreadCount={unreadCount}/>
      
      {/* Main Content */}
      <div className="client-main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;