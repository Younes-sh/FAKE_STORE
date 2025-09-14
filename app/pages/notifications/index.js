import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '@/Components/Layout/Layout';
import Style from './Notifications.module.css';

export default function NotificationsPage() {
  const { data: session, status } = useSession({ required: true });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    if (session) {
      fetchNotifications();
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        console.log('📨 Notifications data received:', data);
        
        // فیلتر کردن نوتیفیکیشن‌هایی که notification دارند
        const validNotifications = data.notifications.filter(
          n => n.notification && n.notification.title
        );
        
        console.log(`✅ ${validNotifications.length} valid notifications`);
        setNotifications(validNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT'
      });
      
      if (res.ok) {
        setNotifications(prev => prev.map(n => 
          n.notification._id === notificationId 
            ? { ...n, isRead: true, readAt: new Date() }
            : n
        ));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.notification._id !== notificationId));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // تابع helper برای دسترسی ایمن به notification
  const getNotification = (userNotification) => {
    return userNotification.notification || {
      title: 'Unknown Notification',
      message: 'Notification details not available',
      type: 'info',
      _id: 'unknown'
    };
  };

  if (status === 'loading' || loading) {
    return <div className={Style.loading}>Loading...</div>;
  }

  return (
    <Layout>
      <div className={Style.container}>
        <h1>Notifications</h1>
        
        <div className={Style.notificationsList}>
          {notifications.length === 0 ? (
            <p className={Style.empty}>No notifications yet</p>
          ) : (
            notifications.map(userNotification => {
              const notification = getNotification(userNotification);
              
              return (
                <div
                  key={userNotification._id}
                  className={`${Style.notificationItem} ${
                    userNotification.isRead ? Style.read : Style.unread
                  }`}
                  onClick={() => {
                    setSelectedNotification(userNotification);
                    if (!userNotification.isRead) {
                      markAsRead(notification._id);
                    }
                  }}
                >
                  <div className={Style.notificationHeader}>
                    <h3>{notification.title}</h3>
                    <span className={Style[notification.type]}>
                      {notification.type}
                    </span>
                  </div>
                  <p>{notification.message}</p>
                  <div className={Style.notificationFooter}>
                    <span>{new Date(userNotification.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification._id);
                      }}
                      className={Style.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal برای نمایش کامل نوتیفیکیشن */}
        {selectedNotification && (
          <div className={Style.modal} onClick={() => setSelectedNotification(null)}>
            <div className={Style.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2>{getNotification(selectedNotification).title}</h2>
              <p>{getNotification(selectedNotification).message}</p>
              <div className={Style.modalActions}>
                <button onClick={() => setSelectedNotification(null)}>Close</button>
                <button onClick={() => deleteNotification(getNotification(selectedNotification)._id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}