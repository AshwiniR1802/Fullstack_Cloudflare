import React, { useState } from "react";

const NotificationForm = () => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("alert");
  const [notificationFeedColor, setNotificationFeedColor] = useState("#D8BFD8"); // Thistle color

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/create-notification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, type }),
        }
      );

      if (response.ok) {
        setMessage("");
        setType("alert");
        // Optionally refresh the notification feed here
      } else {
        const errorData = await response.json();
        console.error("Failed to create notification:", errorData.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form
      id="notification-form"
      data-notification-generation-node
      onSubmit={handleSubmit}
    >
      <div
        style={{
          border: `1px solid ${notificationFeedColor}`,
          padding: "10px",
        }}
      >
        <textarea
          id="notification-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          placeholder="Enter your notification message"
        />
        <select
          id="notification-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="alert">Alert</option>
          <option value="info">Info</option>
          <option value="success">Success</option>
        </select>
        <button
          id="send-notification-btn"
          type="submit"
          aria-label="Button to send notifications"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default NotificationForm;
