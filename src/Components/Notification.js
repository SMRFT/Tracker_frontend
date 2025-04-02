import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FaUserCircle, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';

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
  display: ${({ show }) => (show ? 'block' : 'none')};
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

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 10px 15px;
  border-radius: 10px;
  margin-right: 20px;

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
    margin-right: 0;
  }
`;

const MemberList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const MemberCircle = styled.div`
  width: 35px;
  height: 35px;
  background-color: ${(props) => props.bgColor || "#4a90e2"};
  color: white;
  font-weight: bold;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  text-transform: uppercase;

  @media (max-width: 600px) {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
`;

const CalendarIcon = styled(FaCalendarAlt)`
  color: white;
  font-size: 1.6rem;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 600px) {
    font-size: 1.4rem;
  }
`;

const Notification = ({ employeeId }) => {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    axios
      .get(`https://tracker.shinovadatabase.in/notifications/?employeeId=${employeeId}`)
      .then((response) => {
        setNotifications(response.data);
        setUnreadCount(response.data.length);
      })
      .catch((error) => console.error(error));
  }, [employeeId]); // Runs once when the component mounts
  
  const markNotificationsAsRead = async () => {
    try {
      const response = await axios.patch('http://127.0.0.1:8000/notifications/mark-read/', {
        employeeId,
      });
      console.log("Response:", response.data);
    } catch (err) {
      console.error("Failed to mark notifications as read:", err.response?.data || err.message);
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
