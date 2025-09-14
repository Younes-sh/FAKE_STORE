// utils/notificationUtils.js
export const validateNotification = (notification) => {
    if (!notification || !notification.notificationDetails) {
      return {
        isValid: false,
        details: {
          title: 'Unknown Notification',
          message: 'Notification details not available',
          type: 'info',
          _id: 'unknown'
        }
      };
    }
  
    const details = notification.notificationDetails;
    
    return {
      isValid: true,
      details: {
        title: details.title || 'No Title',
        message: details.message || 'No message content',
        type: details.type || 'info',
        _id: details._id || 'unknown',
        createdAt: details.createdAt || new Date()
      }
    };
  };