import React, { useEffect, useState } from 'react';

// Helper function to format the timestamp
const formatDate = (date) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  return new Date(date).toLocaleString('en-US', options);
};

const NotificationFeed = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch unread notifications on page load
    const fetchNotifications = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/get-notifications`);
      const data = await response.json();
      // Sort notifications by most recent
      const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setNotifications(sortedData);
    };

    fetchNotifications();
  }, []);

  return (
    <div
      id="notification-feed"
      style={{
        height: '400px',
        overflowY: 'auto',
        padding: '10px',
        accessKey: 'F',
      }}
    >
      {notifications.map((notification, index) => (
        <div
          key={index}
          className="notification-card"
          style={{
            height: '70px',
            marginBottom: '10px',
            padding: '10px',
            backgroundColor:
              notification.type === 'alert'
                ? '#ffcccb'
                : notification.type === 'success'
                ? '#90ee90'
                : '#add8e6',
          }}
        >
          <p className="notification-message">{notification.message}</p>
          <div className="notification-timestamp">{formatDate(notification.timestamp)}</div>
        </div>
      ))}
    </div>
  );
};

export default NotificationFeed;
