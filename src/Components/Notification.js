import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
// Keyframe for sliding animation
const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;
const slideOut = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
`;
// Styled Modal Component
const NotificationModal = styled.div`
  position: fixed;
  top: 60px;
  right: 0;
  width: 100%;
  max-width: 400px;
  height: 90%;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  animation: ${({ show }) => (show ? slideIn : slideOut)} 0.5s forwards;
  transition: transform 0.5s ease-in-out;
  z-index: 1000;
  padding: 15px;
  overflow-y: auto;
  h2 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 10px;
  }
`;
// Divider component
const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: #ddd;
  margin: 10px 0;
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ show }) => (show ? 'block' : 'none')};
  z-index: 900;
`;
const NotificationIcon = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 1.8rem;
  cursor: pointer;
  color: white;
`;
const CloseIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
`;
const Notification = ({ employeeId }) => {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    if (showModal) {
      // Fetch dynamic notifications (without saving to the DB)
      axios.get(`http://127.0.0.1:8000/notifications/?employeeId=${employeeId}`)
        .then(response => {
          setNotifications(response.data);
          setUnreadCount(response.data.length);
        })
        .catch(error => console.error(error));
    }
  }, [showModal, employeeId]);
  const toggleModal = () => {
    setShowModal(!showModal);
    if (showModal) {
      setUnreadCount(0); // Reset unread count when modal is closed
    }
  };
  return (
    <>
      <NotificationIcon onClick={toggleModal}>
        <FontAwesomeIcon icon={faBell} />
        {unreadCount > 0 && <span style={styles.notificationBadge}>{unreadCount}</span>}
      </NotificationIcon>
      <Overlay show={showModal} onClick={toggleModal} />
      <NotificationModal show={showModal}>
        <CloseIcon icon={faTimes} onClick={toggleModal} />
        <h2>Notifications</h2>
        <Divider />
        {notifications.length > 0 ? (
          <ul>
            {notifications.map(notification => (
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
const styles = {
  notificationBadge: {
    backgroundColor: "red",
    color: "white",
    borderRadius: "50%",
    padding: "3px 6px",
    marginLeft: "8px",
    fontSize: "12px",
  },
};
export default Notification;






