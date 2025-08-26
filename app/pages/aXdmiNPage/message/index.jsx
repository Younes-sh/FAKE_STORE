import React, { useState, useEffect } from 'react';
import MessageCard from '@/Components/Admin/Cards/MessageCard/MessageCard';
import AdminLayout from '@/Components/Admin/AdminLayout/Layout';
import styles from './messages.module.css';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    status: 'all',
    page: 1,
    limit: 10
  });

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`/api/contact?${queryParams}`);
      const result = await response.json();

      if (result.success) {
        setMessages(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.container}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Contact Messages</h1>

          <div className={styles.filters}>
            <select 
              value={filters.status}
              onChange={(e) => handleFilterChange({ status: e.target.value })}
              className={styles.filterSelect}
            >
              <option value="all">All</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className={styles.messagesList}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              No messages found
            </div>
          ) : (
            messages.map(message => (
              <MessageCard 
                key={message._id} 
                message={message}
                onUpdate={fetchMessages}
                onDelete={fetchMessages}
              />
            ))
          )}
        </div>

        {pagination.pages > 1 && (
          <div className={styles.pagination}>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`${styles.pageButton} ${filters.page === page ? styles.active : ''}`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default Messages;