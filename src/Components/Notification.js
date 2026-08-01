import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTimes, faInbox, faCheckCircle, faClock } from "@fortawesome/free-solid-svg-icons";
import apiRequest from "./apiRequest";

// Helper for relative time
const getRelativeTime = (dateString) => {
  if (!dateString) return "";
  // If date doesn't contain timezone info, assume UTC by appending 'Z'
  const safeDateString = dateString.endsWith('Z') || dateString.includes('+') ? dateString : `${dateString}Z`;
  const date = new Date(safeDateString);
  const now = new Date();
  let diffInSeconds = Math.floor((now - date) / 1000);
  
  // Handle slight future mismatches
  if (diffInSeconds < 0) diffInSeconds = 0;
  
  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
};

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
  top: 70px;
  right: 24px;
  width: 100%;
  max-width: 360px;
  max-height: calc(100vh - 90px);
  background-color: var(--bg-secondary);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 2050;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
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
    font-size: 1.1rem;
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

const ClearButton = styled.button`
  background: rgba(239, 68, 68, 0.1);
  border: none;
  color: #ef4444;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: auto;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
  }
`;

const NotificationList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--bg-primary);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-subtle);
    border-radius: 4px;

    &:hover {
      background: #cbd5e1;
    }
  }
`;

const NotificationCard = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 10px 12px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    border-color: var(--text-muted);
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${props => props.$unread ? '#4f46e5' : 'transparent'};
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const TimeText = styled.span`
  font-size: 0.65rem;
  color: var(--text-light);
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
`;

const ClearSingleBtn = styled.button`
  background: transparent;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--bg-primary);
    color: var(--danger);
  }
`;

const ConfirmDialogOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 20px;
`;

const ConfirmDialog = styled(motion.div)`
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-subtle);
  text-align: center;
  width: 100%;
  max-width: 280px;

  h3 {
    margin: 0 0 10px 0;
    font-size: 0.95rem;
    color: var(--text-main);
  }

  p {
    margin: 0 0 20px 0;
    font-size: 0.8rem;
    color: var(--text-muted);
  }
`;

const DialogActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;

  button {
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
  }

  .cancel-btn {
    background: var(--bg-secondary);
    color: var(--text-main);
    border: 1px solid var(--border-subtle);
    &:hover { filter: brightness(0.95); }
  }

  .confirm-btn {
    background: var(--danger);
    color: white;
    &:hover { filter: brightness(0.9); }
  }
`;

const MessageText = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-main);
  line-height: 1.4;
  font-weight: 500;
`;

const CardContext = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.65rem;
  color: var(--primary-accent);
  background: var(--bg-primary);
  padding: 3px 8px;
  border-radius: 6px;
  align-self: flex-start;
  font-weight: 600;
  letter-spacing: 0.3px;
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
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
      }
    };

    // Initial fetch
    fetchNotifications();

    // Auto-fetch every 30 seconds
    const intervalId = setInterval(fetchNotifications, 30000);

    return () => clearInterval(intervalId);
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

  const handleClearAll = () => {
    setShowConfirm(true);
  };

  const confirmClearAll = () => {
    setShowConfirm(false);
    clearNotifications();
  };

  const cancelClearAll = () => {
    setShowConfirm(false);
  };

  const clearNotifications = async () => {
    const response = await apiRequest(
      `${Trackerbaseurl}notifications/clear/`,
      "DELETE"
    );

    if (response.success) {
      setNotifications([]);
      setUnreadCount(0);
    } else {
      console.error("Failed to clear notifications:", response.error);
    }
  };

  const clearSingleNotification = async (notificationId) => {
    const response = await apiRequest(
      `${Trackerbaseurl}notifications/clear/${notificationId}/`,
      "DELETE"
    );

    if (response.success) {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } else {
      console.error("Failed to clear notification:", response.error);
    }
  };

  const toggleModal = () => {
    const willOpen = !showModal;
    setShowModal(willOpen);

    // Only clear the badge locally for now; DB remains unread until explicitly cleared
    if (willOpen) {
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
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Header>
                  <h2>Notifications</h2>
                  {notifications.length > 0 && (
                    <ClearButton onClick={handleClearAll}>
                      Clear All
                    </ClearButton>
                  )}
                  <CloseButton onClick={toggleModal}>
                    <FontAwesomeIcon icon={faTimes} />
                  </CloseButton>
                </Header>
                <NotificationList>
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        $unread={!notification.is_read}
                        style={{ cursor: notification.cardId ? "pointer" : "default" }}
                        onClick={() => {
                          if (notification.cardId) {
                            setShowModal(false);
                            navigate("/Todolist", {
                              state: {
                                boardId: notification.boardId,
                                boardName: notification.boardName,
                                cardId: notification.cardId,
                                autoOpenCardId: notification.cardId,
                              },
                            });
                          }
                        }}
                      >
                        <CardHeader>
                          <TimeText>
                            <FontAwesomeIcon icon={faClock} /> 
                            {getRelativeTime(notification.created_date)}
                          </TimeText>
                          <ClearSingleBtn 
                            onClick={(e) => {
                              e.stopPropagation();
                              clearSingleNotification(notification.id);
                            }}
                            title="Clear"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </ClearSingleBtn>
                        </CardHeader>
                        <MessageText>{notification.message}</MessageText>
                        {notification.cardName && (
                          <CardContext>Card: {notification.cardName}</CardContext>
                        )}
                      </NotificationCard>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0', fontSize: '0.9rem' }}>
                      <FontAwesomeIcon icon={faBell} style={{ fontSize: '2rem', marginBottom: '12px', opacity: 0.5 }} />
                      <br />
                      No notifications yet
                    </div>
                  )}
                </NotificationList>

                {/* Custom Confirmation Popup */}
                <AnimatePresence>
                  {showConfirm && (
                    <ConfirmDialogOverlay
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ConfirmDialog
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <h3>Clear All Notifications?</h3>
                        <p>This action cannot be undone.</p>
                        <DialogActions>
                          <button className="cancel-btn" onClick={cancelClearAll}>Cancel</button>
                          <button className="confirm-btn" onClick={confirmClearAll}>Yes, Clear</button>
                        </DialogActions>
                      </ConfirmDialog>
                    </ConfirmDialogOverlay>
                  )}
                </AnimatePresence>
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
