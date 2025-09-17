import React, { useState, useEffect } from 'react';
import './Notification.css';
import { useNavigate } from 'react-router-dom';
import { DataStore } from 'aws-amplify/datastore';
import {Notification, Booking} from '../../../../../models';
import { useAuthContext } from '../../../../../../Providers/ClientProvider/AuthProvider';

const NotificationCom = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dbUser, dbRealtor } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!dbRealtor?.id) return;

    const fetchNotifications = async () => {
      try {
        const all = await DataStore.query(Notification, n =>
          n.recipientID.eq(dbRealtor.id)
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
      // only react to notifications meant for this realtor
      if (element.recipientID !== dbRealtor.id) return;

      if (["INSERT", "UPDATE", "DELETE"].includes(opType)) {
        // ✅ safest: just refetch full list to stay consistent
        await fetchNotifications();
      }
    });

    return () => subscription.unsubscribe();
  }, [dbRealtor]);

  // Navigation map for Realtor only
  const navigationMap = {
    BOOKING_REALTOR: async (id) => {
      if (!id) return null;

      const booking = await DataStore.query(Booking, id);
      if (!booking) {
        console.warn('Booking not found');
        return null;
      }
      if (booking.status === 'DENIED') {
        alert('This booking request has already been denied.');
        return null;
      }

      // ✅ Realtor still sees notification if DENIED or TRY_ANOTHER
      const bookingRouteMap = {
        PENDING: `/realtorcontent/pending_details/${id}`,
        ACCEPTED: `/realtorcontent/accepted_details/${id}`,
        PAID: `/realtorcontent/accepted_details/${id}`,
        CHECKED_IN: `/realtorcontent/accepted_details/${id}`,
        VIEWING: `/realtorcontent/accepted_details/${id}`,
        VISITING: `/realtorcontent/accepted_details/${id}`,
        CHECKED_OUT: `/realtorcontent/accepted_details/${id}`,
        VIEWED: `/realtorcontent/accepted_details/${id}`,
        VISITED: `/realtorcontent/accepted_details/${id}`,
        SOLD: `/realtorcontent/accepted_details/${id}`,
      };

      return bookingRouteMap[booking.status] || null;
    },
    REVIEW_REALTOR_POST: id => id ? `/realtorcontent/reviews_comments/${id}` : null,
    COMMENT_REALTOR_POST: id => id ? `/realtorcontent/reviews_comments/${id}` : null,
    REVIEW_REALTOR: () => '/realtorcontent/realtorrating',
    POST_CREATOR_LIKE: id => id ? `/realtorcontent/community_post/${id}` : null,
    POST_CREATOR_COMMENT: id => id ? `/realtorcontent/community_post/${id}` : null,
  };

  const handleNotificationClick = async (notification) => {
    // Optimistic mark as read
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? { ...n, read: true } : n))
    );

    try {
      await DataStore.save(
        Notification.copyOf(notification, updated => {
          updated.read = true;
        })
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
      setNotifications(prev =>
        prev.map(n => (n.id === notification.id ? { ...n, read: false } : n))
      );
    }

    const { recipientType, entityID } = notification;
    let path = null;

    if (navigationMap[recipientType]) {
      const handler = navigationMap[recipientType];
      path = typeof handler === "function" ? await handler(entityID) : handler;
    }

    if (path) {
      navigate(path);
    } else {
      console.warn('Unhandled notification:', notification);
    }
  };
    
  return (
    <div className="notificationCon ">
      <div className='realtorNotificationHeaderCon'>
        <p className='realtorNotificationHeaderTxt'>Notification</p>
      </div>

      {loading ? (
        <div className="realtorNoNotificationCon">
          <p className="realtorNoNotificationTxt">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="realtorNoNotificationCon">
          <p className="realtorNoNotificationTxt">No notifications yet.</p>
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