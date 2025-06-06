import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTimes } from "@fortawesome/free-solid-svg-icons";
import apiRequest from "./apiRequest";

// Keyframe for sliding animation
const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;
const slideOut = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`;

// Styled Modal Component
const NotificationModal = styled.div`
  position: fixed;
  top: 60px;
  right: 0;
  width: 90%;
  max-width: 400px;
  height: 80vh;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  animation: ${({ show }) => (show ? slideIn : slideOut)} 0.5s forwards;
  z-index: 1000;
  padding: 15px;
  overflow-y: auto;

  h2 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 10px;
  }

  @media (max-width: 600px) {
    top: 50px;
    width: 100%;
    height: 70vh;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ show }) => (show ? "block" : "none")};
  z-index: 900;
`;

const NotificationIcon = styled.div`
  position: relative;
  cursor: pointer;
  color: white;
  font-size: 1.8rem;

  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 0;
  right: -5px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 3px 6px;
  font-size: 12px;
  min-width: 18px;
  text-align: center;
  font-weight: bold;
  line-height: 1;
`;

const CloseIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
`;

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const Trackerbaseurl = process.env.REACT_APP_BACKEND_TRACKER_BASE_URL;

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await apiRequest(
        `${Trackerbaseurl}notifications/`,
        "GET"
      );

      if (response.success) {
        setNotifications(response.data);
        setUnreadCount(response.data.length);
      } else {
        console.error("Failed to fetch notifications:", response.error);
      }
    };

    fetchNotifications();
  }, []); // Removed employeeId dependency since it's handled by the token

  const markNotificationsAsRead = async () => {
    const response = await apiRequest(
      `${Trackerbaseurl}notifications/mark-read/`,
      "PATCH"
    );

    if (response.success) {
      console.log("Notifications marked as read:", response.data);
    } else {
      console.error("Failed to mark notifications as read:", response.error);
    }
  };

  const toggleModal = () => {
    const willOpen = !showModal;

    setShowModal(willOpen);

    if (willOpen) {
      markNotificationsAsRead(); // ✅ mark as read when opening
      setUnreadCount(0);
    }
  };

  return (
    <>
      <NotificationIcon onClick={toggleModal}>
        <FontAwesomeIcon icon={faBell} />
        {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
      </NotificationIcon>

      <Overlay show={showModal} onClick={toggleModal} />
      <NotificationModal show={showModal}>
        <CloseIcon icon={faTimes} onClick={toggleModal} />
        <h2>Notifications</h2>
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.cardId}>
                {notification.message}
                <br />
                <small>Card: {notification.cardName}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notifications</p>
        )}
      </NotificationModal>
    </>
  );
};

export default Notification;
