import React, { useEffect, useState } from "react";
import { FiLogOut, FiX } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import styled from "styled-components";

const SignOut = ({ isCollapsed, isHeader }) => {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [role, setRole] = useState("");
  const [showSignOut, setShowSignOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const storedUserName = localStorage.getItem("employeeName");
    const storedEmployeeId = localStorage.getItem("employeeId");
    const storedRole = localStorage.getItem("role");
    setEmployeeName(storedUserName || "User");
    setEmployeeId(storedEmployeeId || "");
    setRole(storedRole || "Member");
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSignOut && !event.target.closest(".profile-menu-container")) {
        setShowSignOut(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSignOut]);

  const handleSignOut = () => {
    window.location.href = "/secure";
  };

  const handleIconClick = () => {
    setShowSignOut(!showSignOut);
  };

  return (
    <SignOutWrapper className="profile-menu-container" isCollapsed={isCollapsed} isHeader={isHeader}>
      <ProfileContainer onClick={handleIconClick} isCollapsed={isCollapsed} isHeader={isHeader} data-tooltip-id="accountTooltip">
        <ProfileCircle>
          {employeeName.charAt(0).toUpperCase()}
        </ProfileCircle>
        {!isCollapsed && !isHeader && (
          <UserMeta>
            <div className="name">{employeeName}</div>
            <div className="role">{role}</div>
          </UserMeta>
        )}
        {isHeader && (
          <HeaderUserMeta>
            <div className="name-row">
              <span className="label">Name : </span>
              <span className="val">{employeeName}</span>
            </div>
            <div className="id-row">
              <span className="label">ID : </span>
              <span className="val">{employeeId}</span>
              <span style={{ marginRight: "10px" }}> </span>
              <UserRole>{role}</UserRole>
            </div>
          </HeaderUserMeta>
        )}
      </ProfileContainer>

      {(isCollapsed || isHeader) && (
        <Tooltip
          id="accountTooltip"
          place={isHeader ? "bottom" : "right"}
          className="custom-tooltip"
        >
          <TooltipContent>
            <div>{employeeName}</div>
            <div>{employeeId}</div>
          </TooltipContent>
        </Tooltip>
      )}

      {showSignOut && (
        <SignOutContainer isCollapsed={isCollapsed} isHeader={isHeader}>
          <UserInfo>
            <UserAvatar>{employeeName.charAt(0).toUpperCase()}</UserAvatar>
            <UserDetails>
              <UserName>{employeeName}</UserName>
              <UserID>{employeeId}</UserID>
              <UserRole>{role}</UserRole>
            </UserDetails>
          </UserInfo>

          <MenuButton onClick={() => setShowLogoutConfirm(true)}>
            <FiLogOut />
            <span>Sign Out</span>
          </MenuButton>
        </SignOutContainer>
      )}

      {showLogoutConfirm && (
        <ModalOverlay onClick={() => setShowLogoutConfirm(false)}>
          <ModalWrapper onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>Confirm Log Out</h3>
              <CloseButton onClick={() => setShowLogoutConfirm(false)}>
                <FiX />
              </CloseButton>
            </ModalHeader>
            <div style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: "8px 0 20px 0", lineHeight: 1.5 }}>
              Are you sure you want to log out of Shinova Tracker?
            </div>
            <ButtonGroup>
              <CancelButton onClick={() => setShowLogoutConfirm(false)}>Cancel</CancelButton>
              <UpdateButton style={{ background: "#ef4444" }} onClick={handleSignOut}>
                Log Out
              </UpdateButton>
            </ButtonGroup>
          </ModalWrapper>
        </ModalOverlay>
      )}
    </SignOutWrapper>
  );
};

// Styled components
const SignOutWrapper = styled.div`
  position: relative;
  width: ${(props) => (props.isHeader ? "auto" : "100%")};
  margin-top: ${(props) => (props.isHeader ? "0" : "8px")};
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: ${(props) => (props.isHeader ? "2px 8px" : "8px")};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  justify-content: ${(props) => (props.isCollapsed ? "center" : "flex-start")};

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const ProfileCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  flex-shrink: 0;
`;

const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;

  .name {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-main);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .role {
    font-size: 0.75rem;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const HeaderUserMeta = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  font-family: 'Inter', sans-serif;
  text-align: left;

  .name-row, .id-row {
    font-size: 0.8rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
  }

  .label {
    color: var(--text-muted);
    font-weight: 500;
  }

  .val {
    font-weight: 600;
    color: var(--text-main);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const TooltipContent = styled.div`
  padding: 4px 8px;
  font-size: 12px;
  line-height: 1.4;

  & > div:first-child {
    font-weight: 600;
  }

  & > div:last-child {
    opacity: 0.7;
  }
`;

const SignOutContainer = styled.div`
  position: absolute;
  top: ${(props) => (props.isHeader ? "52px" : "auto")};
  bottom: ${(props) => (props.isHeader ? "auto" : "60px")};
  right: ${(props) => (props.isHeader ? "0" : "auto")};
  left: ${(props) => (props.isHeader ? "auto" : props.isCollapsed ? "10px" : "0")};
  background-color: var(--bg-secondary, #ffffff);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 16px;
  width: 240px;
  z-index: 2200;
  animation: fadeIn 0.2s ease-in-out;
  border: 1px solid var(--border-subtle, #f1f5f9);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: white;
  margin-right: 12px;
`;

const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-main, #0f172a);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserID = styled.div`
  font-size: 0.75rem;
  color: var(--text-muted, #64748b);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.div`
  display: inline-block;
  margin-top: 3px;
  padding: 1px 8px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
  color: var(--primary-accent, #6366f1);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background-color: transparent;
  color: var(--text-main, #334155);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  text-align: left;
  margin-bottom: 4px;
  gap: 12px;

  &:hover {
    background-color: var(--bg-primary, #f1f5f9);
    color: #ef4444;
  }

  svg {
    font-size: 1.1rem;
    color: var(--text-muted, #64748b);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  animation: fadeIn 0.2s ease-in-out;
`;

const ModalWrapper = styled.div`
  background-color: var(--bg-secondary, #ffffff);
  border: 1px solid var(--border-subtle, #f1f5f9);
  border-radius: 16px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 24px;
  animation: slideIn 0.3s ease-out;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-main, #1f2937);
  }
`;

const CloseButton = styled.button`
  background: var(--bg-primary, #f3f4f6);
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted, #4b5563);
  transition: all 0.2s;

  &:hover {
    background: var(--border-subtle, #e5e7eb);
    color: var(--text-main, #111827);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  border: 1px solid var(--border-subtle, #d1d5db);
  color: var(--text-muted, #4b5563);

  &:hover {
    background-color: var(--bg-primary, #f3f4f6);
  }
`;

const UpdateButton = styled(Button)`
  background: #6366f1;
  border: none;
  color: white;

  &:hover {
    background: #4f46e5;
  }
`;

export default SignOut;
