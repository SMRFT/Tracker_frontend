import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VscAccount } from "react-icons/vsc";
import { FiLogOut, FiKey, FiX } from "react-icons/fi";
import { Tooltip } from 'react-tooltip';
import styled from 'styled-components';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignOut = () => {
  const navigate = useNavigate();
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [showSignOut, setShowSignOut] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUserName = localStorage.getItem('employeeName');
    const storedUserEmail = localStorage.getItem('email');
    const storedEmployeeId = localStorage.getItem('employeeId');
    setEmployeeName(storedUserName || 'User');
    setEmail(storedUserEmail || 'user@example.com');
    setEmployeeId(storedEmployeeId || '');
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSignOut && !event.target.closest('.profile-menu-container')) {
        setShowSignOut(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSignOut]);

  const handleSignOut = () => {
    localStorage.removeItem('employeeId');
    localStorage.removeItem('employeeName');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    navigate('/');
  };

  const openChangePasswordModal = () => {
    setShowModal(true);
    setShowSignOut(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('https://tracker.shinovadatabase.in/change-password/', {
        email,
        employeeId,
        currentPassword,
        newPassword,
      });

      if (response.status === 200) {
        toast.success('Password updated successfully!', {
          onClose: () => {
            setTimeout(() => {
              navigate('/');
            }, 1000);
          }
        });
        closeModal();
      } else {
        setError(response.data.error || 'Something went wrong!');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  const handleIconClick = () => {
    setShowSignOut(!showSignOut);
  };

  return (
    <SignOutWrapper className="profile-menu-container">
      <ProfileCircle onClick={handleIconClick} data-tooltip-id="accountTooltip">
        {employeeName.charAt(0).toUpperCase()}
      </ProfileCircle>
      
      <Tooltip id="accountTooltip" place="top" effect="solid" className="custom-tooltip">
        <TooltipContent>
          <div>{employeeName}</div>
          <div>{email}</div>
        </TooltipContent>
      </Tooltip>
      
      {showSignOut && (
        <SignOutContainer>
          <UserInfo>
            <UserAvatar>{employeeName.charAt(0).toUpperCase()}</UserAvatar>
            <UserDetails>
              <UserName>{employeeName}</UserName>
              <UserEmail>{email}</UserEmail>
            </UserDetails>
          </UserInfo>
          
          <Divider />
          
          <MenuButton onClick={openChangePasswordModal}>
            <FiKey />
            <span>Change Password</span>
          </MenuButton>
          
          <MenuButton onClick={handleSignOut}>
            <FiLogOut />
            <span>Sign Out</span>
          </MenuButton>
        </SignOutContainer>
      )}
      
      {showModal && (
        <ModalOverlay>
          <ModalWrapper>
            <ModalHeader>
              <h3>Change Password</h3>
              <CloseButton onClick={closeModal}><FiX /></CloseButton>
            </ModalHeader>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <FormGroup>
              <Label>Current Password</Label>
              <Input
                type="password"
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormGroup>
            
            <ButtonGroup>
              <CancelButton onClick={closeModal}>Cancel</CancelButton>
              <UpdateButton onClick={handleChangePassword}>Update Password</UpdateButton>
            </ButtonGroup>
          </ModalWrapper>
        </ModalOverlay>
      )}
      
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </SignOutWrapper>
  );
};

// Styled components with modern UI
const SignOutWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
`;

const ProfileCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 0.3);
  }
`;

const TooltipContent = styled.div`
  padding: 8px 12px;
  font-size: 14px;
  
  & > div:first-child {
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  & > div:last-child {
    opacity: 0.8;
    font-size: 12px;
  }
`;

const SignOutContainer = styled.div`
  position: absolute;
  bottom: 50px;
  left: 0;
  background-color: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  padding: 16px;
  width: 240px;
  z-index: 1001;
  animation: fadeIn 0.2s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-right: 12px;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
`;

const UserEmail = styled.div`
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #eee;
  margin: 12px 0;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background-color: transparent;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
  text-align: left;
  margin-bottom: 4px;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  svg {
    margin-right: 12px;
    font-size: 18px;
    color: #666;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
  animation: fadeIn 0.2s ease-in-out;
`;

const ModalWrapper = styled.div`
  background-color: white;
  border-radius: 12px;
  width: 380px;
  max-width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 24px;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from { transform: translateY(-30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  
  &:hover {
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    outline: none;
    border-color: #2575fc;
    box-shadow: 0 0 0 2px rgba(37, 117, 252, 0.2);
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  border: 1px solid #ddd;
  color: #666;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const UpdateButton = styled(Button)`
  background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%);
  border: none;
  color: white;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(71, 118, 230, 0.3);
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 14px;
  padding: 12px;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  
  &::before {
    content: "⚠️";
    margin-right: 8px;
  }
`;

export default SignOut;