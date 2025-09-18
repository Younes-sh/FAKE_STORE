import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '@/Components/Layout/Layout';
import Style from './Notifications.module.css';

export default function NotificationsPage() {
  const { data: session, status } = useSession({ required: true });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      fetchNotifications();
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // استفاده از API درست - برای کاربران معمولی
      const res = await fetch('/api/notifications');
      
      if (!res.ok) {
        throw new Error(`Failed to fetch notifications: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('📨 User notifications data received:', data);
      
      if (data.success) {
        // API کاربر باید آرایه‌ای از UserNotificationها را برگرداند
        setNotifications(data.notifications || []);
      } else {
        throw new Error(data.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(error.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (userNotificationId) => {
    try {
      const res = await fetch(`/api/notifications/${userNotificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true })
      });
      
      if (res.ok) {
        setNotifications(prev => prev.map(n => 
          n._id === userNotificationId 
            ? { ...n, isRead: true, readAt: new Date() }
            : n
        ));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteNotification = async (userNotificationId) => {
    try {
      const res = await fetch(`/api/notifications/${userNotificationId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n._id !== userNotificationId));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className={Style.container}>
          <div className={Style.loading}>Loading notifications...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={Style.container}>
        <h1>Notifications</h1>
        
        {error && (
          <div className={Style.error}>
            <p>Error: {error}</p>
            <button onClick={fetchNotifications} className={Style.retryButton}>
              Try Again
            </button>
          </div>
        )}
        
        <div className={Style.notificationsList}>
          {notifications.length === 0 ? (
            <p className={Style.empty}>No notifications yet</p>
          ) : (
            notifications.map(userNotification => (
              <div
                key={userNotification._id}
                className={`${Style.notificationItem} ${
                  userNotification.isRead ? Style.read : Style.unread
                }`}
                onClick={() => {
                  setSelectedNotification(userNotification);
                  if (!userNotification.isRead) {
                    markAsRead(userNotification._id);
                  }
                }}
              >
                <div className={Style.notificationHeader}>
                  <h3>{userNotification.notification?.title || 'No title'}</h3>
                  <span className={Style[userNotification.notification?.type || 'info']}>
                    {userNotification.notification?.type || 'info'}
                  </span>
                </div>
                <p>{userNotification.notification?.message || 'No message'}</p>
                <div className={Style.notificationFooter}>
                  <span>{new Date(userNotification.createdAt).toLocaleDateString()}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(userNotification._id);
                    }}
                    className={Style.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal برای نمایش کامل نوتیفیکیشن */}
        {selectedNotification && (
          <div className={Style.modal} onClick={() => setSelectedNotification(null)}>
            <div className={Style.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2>{selectedNotification.notification?.title || 'No title'}</h2>
              <p>{selectedNotification.notification?.message || 'No message'}</p>
              <div className={Style.modalActions}>
                <button onClick={() => setSelectedNotification(null)}>Close</button>
                <button onClick={() => deleteNotification(selectedNotification._id)}>
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