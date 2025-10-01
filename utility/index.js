import { validateNotification } from '@/utils/notificationUtils';

// در داخل map:
{notifications.map(notification => {
  const { isValid, details } = validateNotification(notification);
  
  if (!isValid) {
    // می‌توانید نوتیفیکیشن‌های نامعتبر را نادیده بگیرید یا نمایش دهید
    return null;
  }
  
  return (
    <div
      key={notification._id}
      className={`${Style.notificationItem} ${
        notification.isRead ? Style.read : Style.unread
      }`}
      onClick={() => {
        setSelectedNotification(notification);
        if (!notification.isRead) {
          markAsRead(details._id);
        }
      }}
    >
      <div className={Style.notificationHeader}>
        <h3>{details.title}</h3>
        <span className={Style[details.type]}>
          {details.type}
        </span>
      </div>
      <p>{details.message}</p>
      <div className={Style.notificationFooter}>
        <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteNotification(details._id);
          }}
          className={Style.deleteBtn}
        >
          Delete
        </button>
      </div>
    </div>
  );
})}