import React, { useState } from 'react';
import styles from './messageCard.module.css';
import { AlertModal } from '@/Components/AlertModal/AlertModal';


const MessageCard = ({ message, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return '#ff4757';
      case 'in-progress': return '#ffa502';
      case 'resolved': return '#2ed573';
      case 'archived': return '#57606f';
      default: return '#747d8c';
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(`/api/contact/${message._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, isRead: true }),
      });

      if (response.ok) {
        onUpdate && onUpdate();
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/contact/${message._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete && onDelete();
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  return (
    <div className={`${styles.card} ${!message.isRead ? styles.unread : ''}`}>
      <div className={styles.header}>
        <div className={styles.senderInfo}>
          <h3 className={styles.name}>{message.name}</h3>
          <span className={styles.email}>{message.email}</span>
        </div>
        <div className={styles.meta}>
          <span 
            className={styles.status}
            style={{ backgroundColor: getStatusColor(message.status) }}
          >
            {message.status}
          </span>
          <span className={styles.date}>{formatDate(message.createdAt)}</span>
        </div>
      </div>

      <div className={styles.messagePreview}>
        <p>{isExpanded ? message.message : `${message.message.substring(0, 100)}...`}</p>
        {message.message.length > 100 && (
          <button 
            className={styles.toggleButton}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>

      <div className={styles.actions}>
        <select 
          value={message.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={styles.statusSelect}
        >
          <option value="new">New</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="archived">Archived</option>
        </select>

        <a 
          href={`mailto:${message.email}`}
          className={styles.replyButton}
        >
          Response
        </a>

        {/* <button 
          onClick={handleDelete}
          className={styles.deleteButton}
        >
          Delete
        </button> */}
        <button 
          onClick={openDeleteModal} // فقط modal را باز می‌کند
          className={styles.deleteButton}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

        

      {/* Delete Modal */}

      <AlertModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        type="warning"
        icon={
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        }
      />
    </div>
  );
};

export default MessageCard;