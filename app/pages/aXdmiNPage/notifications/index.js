import { useState, useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import AdminLayout from '@/Components/Admin/AdminLayout/Layout';
import Style from './Notifications.module.css';

export default function AdminNotificationsPage() {
  const { data: session } = useSession({ required: true });
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
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
      const res = await fetch('/api/notifications/admin');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
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

      if (res.ok) {
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
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  if (!session || !['admin', 'editor'].includes(session.user.role)) {
    return <div>Access denied</div>;
  }

  return (
    <AdminLayout>
      <div className={Style.container}>
        <div className={Style.header}>
          <h1>Manage Notifications</h1>
          <hr />
          <button onClick={() => setShowForm(true)} className={Style.createBtn}>
            Create Notification
          </button>
        </div>

        {showForm && (
          <div className={Style.formModal}>
            <div className={Style.formContent}>
              <h2>Create New Notification</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="error">Error</option>
                  <option value="promotion">Promotion</option>
                </select>
                <button type="submit">Send Notification</button>
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        <div className={Style.notificationsList}>
          {notifications.map(notification => (
            <div 
            key={notification._id} 
            className={Style.notificationItem}
            data-type={notification.type}
          >
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
            <div className={Style.notificationMeta}>
              <span>Type: {notification.type}</span>
              <span>Sent: {new Date(notification.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          ))}
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