import React, { useState, useEffect } from 'react';
import './Notification.css';
import { useNavigate } from 'react-router-dom';
import { DataStore } from 'aws-amplify/datastore';
import {Notification, Booking} from '../../../../../models'
import { useAuthContext } from '../../../../../../Providers/ClientProvider/AuthProvider';

const NotificationCom = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dbUser, dbRealtor } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
  if (!dbUser?.id) return;

  const fetchNotifications = async () => {
    try {
      const all = await DataStore.query(Notification, n =>
        n.recipientID.eq(dbUser.id)
      );
      setNotifications(
        all.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      );
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchNotifications();

  const subscription = DataStore.observe(Notification).subscribe(async ({ element, opType }) => {
    if (element.recipientID !== dbUser.id) return;
    // Just re-fetch everything to stay in sync
    await fetchNotifications();
  });

  return () => subscription.unsubscribe();
}, [dbUser]);

  // Navigation map for User
  const navigationMap = {
    BOOKING_CLIENT: async (bookingID) => {
      if (!bookingID) return null;

      const booking = await DataStore.query(Booking, bookingID);
      if (!booking) {
        console.warn('Booking not found');
        return null;
      }

      // Navigate user based on booking status
      const statusMap = {
        PENDING: `/clientcontent/bookingdetails/${bookingID}`,
        ACCEPTED: `/clientcontent/bookingdetails/${bookingID}`,
        DENIED: `/clientcontent/bookingdetails/${bookingID}`,
        PAID: `/clientcontent/bookingdetails/${bookingID}`,
        CHECKED_IN: `/clientcontent/bookingdetails/${bookingID}`,
        CHECKED_OUT: `/clientcontent/bookingdetails/${bookingID}`,
        // Add more statuses if needed
      };

      return statusMap[booking.status] || `/clientcontent/bookingdetails/${bookingID}`;
    },
    REVIEW_CLIENT: () => '/clientcontent/userrating',
    COMMENT_CLIENT_POST: id => `/clientcontent/reviews_comments/${id}`,
    POST_CREATOR_LIKE: id => `/clientcontent/community_post/${id}`,
    POST_CREATOR_COMMENT: id => `/clientcontent/community_post/${id}`,
    MENTION: id => `/clientcontent/community_post/${id}`,
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read in DataStore directly
      await DataStore.save(
        Notification.copyOf(notification, updated => {
          updated.read = true;
        })
      );

      // Re-fetch models so state has real instances
      const all = await DataStore.query(Notification, n =>
        n.recipientID.eq(dbUser.id)
      );

      setNotifications(
        all.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }

    const { recipientType, entityID } = notification;

    let path = null;

    if (navigationMap[recipientType]) {
      path = await navigationMap[recipientType](entityID);
    }

    if (path) {
      navigate(path);
    } else {
      console.warn('Unhandled or invalid notification:', notification);
    }
  };
    
  return (
    <div className="notificationCon ">
      <div className='clientNotificationHeaderCon'>
        <p className='clientNotificationHeaderTxt'>Notification</p>
      </div>
        
      {loading ? (
        <div className="clientNoNotificationCon">
          <p className="clientNoNotificationTxt">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="clientNoNotificationCon">
          <p className="clientNoNotificationTxt">No notifications yet.</p>
        </div>
      ) : (
        <ul className="notificationList">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="notificationItem"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notificationContent">
                {!notification.read && <div className="redDot" />}
                <span className={notification.read ? 'readText' : 'unreadText'}>
                  {notification.message}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationCom;