import React, { useState, useEffect } from 'react';
import './Notification.css';
import { useNavigate } from 'react-router-dom';
import { DataStore } from 'aws-amplify/datastore';
import {Notification} from '../../../../../models'
import { useAuthContext } from '../../../../../../Providers/ClientProvider/AuthProvider';

const NotificationCom = () => {
  const [notifications, setNotifications] = useState([]);
  const { dbUser, dbRealtor } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!dbUser?.id) return;

    const fetchNotifications = async () => {
      const all = await DataStore.query(Notification, n =>
        n.recipientID.eq(dbUser.id)
      );
      setNotifications(all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    };

    fetchNotifications();

    const subscription = DataStore.observe(Notification).subscribe(async (msg) => {
      const { element, opType } = msg;

      // Only react to notifications meant for this user
      if (element.recipientID !== dbUser.id) return;

      // Refetch the full notification list on any change
      await fetchNotifications();
    });

    return () => subscription.unsubscribe();
  }, [dbUser]);

  const handleNotificationClick = async (notification) => {
    // Optional: Mark as read
    await DataStore.save(
      Notification.copyOf(notification, updated => {
        updated.read = true;
      })
    );

    const recipientID = notification.recipientID;
    const entityID = notification.entityID;
    const recipientType = notification.recipientType;

    const isUser = dbUser && dbUser.id === recipientID;
    const isRealtor = dbRealtor && dbRealtor.id === recipientID;

    if (!recipientType || (!isUser && !isRealtor)) {
        console.warn('No matching recipient or unknown recipient type');
        return;
    }

    if (recipientType === 'BOOKING_REALTOR' && isRealtor && entityID) {
        navigate(`/realtorcontent/pending_details/${entityID}`);
    } else if (
        (recipientType === 'REVIEW_REALTOR_POST' || recipientType === 'COMMENT_REALTOR_POST') &&
        isRealtor &&
        entityID
    ) {
        navigate(`/realtorcontent/reviews_comments/${entityID}`);
    } else if (recipientType === 'REVIEW_REALTOR' && isRealtor) {
        navigate('/realtorcontent/realtorrating');
    } else if (
        (recipientType === 'POST_CREATOR_LIKE' || recipientType === 'POST_CREATOR_COMMENT') &&
        entityID
    ) {
        if (isUser) {
        navigate(`/clientcontent/community_post/${entityID}`);
        } else if (isRealtor) {
        navigate(`/realtorcontent/community_post/${entityID}`);
        }
    } else if (recipientType === 'REVIEW_CLIENT' && isUser) {
        navigate('/clientcontent/userrating');
    } else if (recipientType === 'COMMENT_CLIENT_POST' && isUser && entityID) {
        navigate(`/clientcontent/reviews_comments/${entityID}`);
    } else {
        console.warn('Unhandled recipientType:', recipientType);
    }

    // // Navigate based on notification (example assumes you have a postID stored)
    // if (notification.postID) {
    //   navigate(`/clientcontent/post/${notification.postID}`);
    // } else {
    //   // fallback or update-type navigation
    //   console.log('No post ID found for this notification');
    // }
  };
    
  return (
    <div className="notificationCon ">
      <div className='clientNotificationHeaderCon'>
        <p className='clientNotificationHeaderTxt'>Notification</p>
      </div>
        
        {notifications.length === 0 ? (
          <div className='clientNoNotificationCon'>
            <p className='clientNoNotificationTxt'>No notifications yet.</p>
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