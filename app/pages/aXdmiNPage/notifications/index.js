// pages/aXdmiNPage/notifications/index.js
import { useState, useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import AdminLayout from '@/Components/Admin/AdminLayout/Layout';
import Style from './Notifications.module.css';

export default function AdminNotificationsPage() {
  const { data: session } = useSession({ required: true });
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [cleanupResult, setCleanupResult] = useState(null);
  const [isCleaning, setIsCleaning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    isForAllUsers: true,
    targetUsers: [],
    expiresAt: ''
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch('/api/notifications/admin');
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch notifications: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch notifications');
      }
      
      setNotifications(data.notifications || []);
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(error.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    if (!confirm('Are you sure you want to run cleanup? This will remove invalid notifications.')) {
      return;
    }
    
    setIsCleaning(true);
    setCleanupResult(null);
    
    try {
      const response = await fetch('/api/notifications/cleanup', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`Cleanup failed: ${response.status}`);
      }
      
      const result = await response.json();
      
      setCleanupResult({
        success: true,
        message: result.message,
        details: result.details
      });
      
      fetchNotifications();
    } catch (error) {
      console.error('Cleanup failed:', error);
      setCleanupResult({
        success: false,
        message: error.message
      });
    } finally {
      setIsCleaning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/notifications/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error(`Failed to create notification: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.success) {
        setShowForm(false);
        setFormData({
          title: '',
          message: '',
          type: 'info',
          isForAllUsers: true,
          targetUsers: [],
          expiresAt: ''
        });
        fetchNotifications();
        alert('Notification created successfully!');
      } else {
        throw new Error(data.message || 'Failed to create notification');
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      alert(error.message || 'Error creating notification. Please try again.');
    }
  };

  const handleEdit = (notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isForAllUsers: notification.isForAllUsers,
      targetUsers: notification.targetUsers,
      expiresAt: notification.expiresAt ? new Date(notification.expiresAt).toISOString().split('T')[0] : ''
    });
  };

  const handleFixMissing = async () => {
    if (!confirm('Are you sure you want to fix missing user notifications?')) {
      return;
    }
    
    try {
      const response = await fetch('/api/notifications/fix-missing', {
        method: 'POST'
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(`Success: ${result.message}`);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Fix failed:', error);
      alert('Fix failed. Please check console for details.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/notifications/admin/${editingNotification._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error(`Failed to update notification: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.success) {
        setEditingNotification(null);
        setFormData({
          title: '',
          message: '',
          type: 'info',
          isForAllUsers: true,
          targetUsers: [],
          expiresAt: ''
        });
        fetchNotifications();
        alert('Notification updated successfully!');
      } else {
        throw new Error(data.message || 'Failed to update notification');
      }
    } catch (error) {
      console.error('Error updating notification:', error);
      alert(error.message || 'Error updating notification. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this notification?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/notifications/admin/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error(`Failed to delete notification: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.success) {
        fetchNotifications();
        alert('Notification deleted successfully!');
      } else {
        throw new Error(data.message || 'Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert(error.message || 'Error deleting notification. Please try again.');
    }
  };

  if (!session || !['admin', 'editor'].includes(session.user.role)) {
    return (
      <AdminLayout>
        <div className={Style.container}>
          <div className={Style.errorMessage}>
            <h2>Access Denied</h2>
            <p>You do not have permission to access this page.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={Style.container}>
        <div className={Style.header}>
          <h1>Manage Notifications</h1>
          <div className={Style.headerActions}>
            <button onClick={() => setShowForm(true)} className={Style.createBtn}>
              Create Notification
            </button>
            <button 
              onClick={handleCleanup} 
              className={Style.cleanupBtn}
              disabled={isCleaning}
            >
              {isCleaning ? 'Cleaning...' : 'Cleanup Notifications'}
            </button>
            <button 
              onClick={fetchNotifications} 
              className={Style.refreshBtn}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>

            <button onClick={handleFixMissing} className={Style.fixBtn}>
              Fix Missing Notifications
            </button>
          </div>
          <hr />
        </div>

        {error && (
          <div className={Style.errorMessage}>
            <h4>Error Loading Notifications</h4>
            <p>{error}</p>
            <button onClick={fetchNotifications} className={Style.retryBtn}>
              Try Again
            </button>
          </div>
        )}

        {cleanupResult && (
          <div className={cleanupResult.success ? Style.cleanupSuccess : Style.cleanupError}>
            <p>{cleanupResult.message}</p>
            {cleanupResult.details && (
              <div className={Style.cleanupDetails}>
                <p>Total removed: {cleanupResult.details.totalRemoved}</p>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className={Style.loading}>
            <p>Loading notifications...</p>
          </div>
        )}

        {showForm && (
          <div className={Style.formModal}>
            <div className={Style.formContent}>
              <h2>Create New Notification</h2>
              <form onSubmit={handleSubmit}>
                <div className={Style.formGroup}>
                  <label htmlFor="title">Title</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Notification title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className={Style.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    placeholder="Notification message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <div className={Style.formGroup}>
                  <label htmlFor="type">Type</label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                    <option value="promotion">Promotion</option>
                  </select>
                </div>

                <div className={Style.formActions}>
                  <button type="submit" className={Style.submitBtn}>
                    Send Notification
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className={Style.cancelBtn}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editingNotification && (
          <div className={Style.formModal}>
            <div className={Style.formContent}>
              <h2>Edit Notification</h2>
              <form onSubmit={handleUpdate}>
                <div className={Style.formGroup}>
                  <label htmlFor="edit-title">Title</label>
                  <input
                    id="edit-title"
                    type="text"
                    placeholder="Notification title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className={Style.formGroup}>
                  <label htmlFor="edit-message">Message</label>
                  <textarea
                    id="edit-message"
                    placeholder="Notification message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <div className={Style.formGroup}>
                  <label htmlFor="edit-type">Type</label>
                  <select
                    id="edit-type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                    <option value="promotion">Promotion</option>
                  </select>
                </div>

                <div className={Style.formActions}>
                  <button type="submit" className={Style.submitBtn}>
                    Update Notification
                  </button>
                  <button type="button" onClick={() => setEditingNotification(null)} className={Style.cancelBtn}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className={Style.notificationsList}>
          {notifications.length === 0 && !loading ? (
            <p className={Style.empty}>No notifications available</p>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification._id} 
                className={Style.notificationItem}
                data-type={notification.type}
              >
                <div className={Style.notificationActions}>
                  <button 
                    className={Style.editBtn}
                    onClick={() => handleEdit(notification)}
                    title="Edit"
                  >
                    Edit
                  </button>
                  <button 
                    className={Style.deleteBtn}
                    onClick={() => handleDelete(notification._id)}
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <div className={Style.notificationMeta}>
                  <span className={Style.notificationType}>{notification.type}</span>
                  <span className={Style.notificationDate}>
                    Sent: {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {notification.expiresAt && (
                  <div className={Style.notificationMeta}>
                    <span className={Style.notificationExpiry}>
                      Expires: {new Date(notification.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {notification.createdBy && (
                  <div className={Style.notificationMeta}>
                    <span className={Style.notificationAuthor}>
                      By: {notification.createdBy.username || 'Unknown'}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session || !['admin', 'editor'].includes(session.user.role)) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  return {
    props: { session }
  };
}