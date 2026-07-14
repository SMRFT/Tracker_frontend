import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTimes, faInbox } from "@fortawesome/free-solid-svg-icons";
import apiRequest from "./apiRequest";

// Styled Components
const NotificationIcon = styled.div`
  position: relative;
  cursor: pointer;
  color: #64748b;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: transparent;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    color: #4f46e5;
    background: #f1f5f9;
  }

  @media (max-width: 768px) {
    width: 34px;
    height: 34px;
    font-size: 1.2rem;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: #ef4444;
  color: white;
  border-radius: 9999px;
  font-size: 10px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  padding: 0 4px;
  border: 2px solid #ffffff;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 2000;
`;

const NotificationModal = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 400px;
  height: 100vh;
  background-color: var(--bg-secondary);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.15);
  z-index: 2050;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border-subtle);
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-secondary);

  h2 {
    font-size: 1.25rem;
    color: var(--text-main);
    font-weight: 700;
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: var(--bg-primary);
  border: none;
  color: var(--text-muted);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: var(--border-subtle);
    color: var(--text-main);
    transform: rotate(90deg);
  }
`;

const NotificationList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--bg-primary);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--bg-primary);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-subtle);
    border-radius: 3px;

    &:hover {
      background: var(--text-light);
    }
  }
`;

const NotificationCard = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 16px;
  position: relative;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    border-color: var(--primary-accent);
  }
`;

const UnreadIndicator = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 8px;
  height: 8px;
  background-color: #4f46e5;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(79, 70, 229, 0.6);
`;

const MessageText = styled.p`
  margin: 0;
  font-size: 0.925rem;
  color: var(--text-main);
  line-height: 1.5;
  font-weight: 500;
  padding-right: 16px;
`;

const CardContext = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.15);
  padding: 4px 8px;
  border-radius: 6px;
  align-self: flex-start;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  gap: 16px;
  text-align: center;
  padding: 40px;

  .icon {
    font-size: 3rem;
    color: #cbd5e1;
  }

  p {
    font-size: 0.95rem;
    margin: 0;
    font-weight: 500;
  }
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
        const unreadNotifications = response.data.filter(
          (notification) => !notification.is_read
        );
        setUnreadCount(unreadNotifications.length);
      } else {
        console.error("Failed to fetch notifications:", response.error);
      }
    };

    fetchNotifications();
  }, [Trackerbaseurl]);

  const markNotificationsAsRead = async () => {
    const response = await apiRequest(
      `${Trackerbaseurl}notifications/mark-read/`,
      "PATCH"
    );

    if (response.success) {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    } else {
      console.error("Failed to mark notifications as read:", response.error);
    }
  };

  const toggleModal = () => {
    const willOpen = !showModal;
    setShowModal(willOpen);

    if (willOpen) {
      markNotificationsAsRead();
      setUnreadCount(0);
    }
  };

  return (
    <>
      <NotificationIcon onClick={toggleModal}>
        <FontAwesomeIcon icon={faBell} />
        {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
      </NotificationIcon>

      {createPortal(
        <AnimatePresence>
          {showModal && (
            <>
              <Overlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleModal}
              />
              <NotificationModal
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
              >
                <Header>
                  <h2>Notifications</h2>
                  <CloseButton onClick={toggleModal}>
                    <FontAwesomeIcon icon={faTimes} />
                  </CloseButton>
                </Header>
                <NotificationList>
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <NotificationCard key={notification.cardId}>
                        {!notification.is_read && <UnreadIndicator />}
                        <MessageText>{notification.message}</MessageText>
                        {notification.cardName && (
                          <CardContext>Card: {notification.cardName}</CardContext>
                        )}
                      </NotificationCard>
                    ))
                  ) : (
                    <EmptyState>
                      <FontAwesomeIcon icon={faInbox} className="icon" />
                      <p>You have no notifications yet</p>
                    </EmptyState>
                  )}
                </NotificationList>
              </NotificationModal>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Notification;
