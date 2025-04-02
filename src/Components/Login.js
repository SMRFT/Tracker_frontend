import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaUser, FaIdCard, FaLock } from 'react-icons/fa';
import Vector1 from './Images/Login-vector1.jpg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(107, 114, 142, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(107, 114, 142, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(107, 114, 142, 0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
`;

// Styled Components
const LoginWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${Vector1});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
    opacity: 0.8;
  }
`;

const FormContainer = styled.div`
  position: relative;
  padding: 2.5rem;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  z-index: 1;
  color: #333;
  animation: ${fadeIn} 0.6s ease-out;
  transform-origin: center;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-weight: 600;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #6B728E, #8E9AAF);
    border-radius: 10px;
  }
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
  transition: color 0.3s ease;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 38px;
  color: #6B728E;
  transition: all 0.3s ease;
`;

const StyledInput = styled.input`
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 100%;
  font-size: 1rem;
  background-color: white;
  color: #333;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #6B728E;
    box-shadow: 0 0 0 3px rgba(107, 114, 142, 0.2);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const PasswordIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 12px;
  cursor: pointer;
  color: #6B7280;
  transition: color 0.3s ease;
  
  &:hover {
    color: #4B5563;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;

const StyledButton = styled.button`
  background: linear-gradient(135deg, #6B728E, #535665);
  color: white;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 120px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: linear-gradient(135deg, #535665, #6B728E);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(107, 114, 142, 0.4);
  }
  
  &:active {
    transform: translateY(0);
    animation: ${pulse} 0.3s;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0), 
      rgba(255, 255, 255, 0.2), 
      rgba(255, 255, 255, 0));
    animation: ${shimmer} 1.5s infinite;
  }
`;

const ErrorMessage = styled.p`
  color: #E53E3E;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  animation: ${fadeIn} 0.3s ease-in;
`;

// Custom toast styling
const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    border-radius: 8px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .Toastify__toast--success {
    background: linear-gradient(135deg, #4CAF50, #388E3C);
  }
  
  .Toastify__toast--error {
    background: linear-gradient(135deg, #F44336, #D32F2F);
  }
  
  .Toastify__progress-bar {
    background: rgba(255, 255, 255, 0.7);
  }
`;

const LogIn = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  
  // Custom toast configurations
  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: {
      borderRadius: '8px',
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    
    if (!employeeId || !employeeName || !password) {
      setError('Employee ID, Name, and Password are required.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('https://tracker.shinovadatabase.in/login/', {
        employeeId: employeeId,
        employeeName: employeeName,
        password: password,
      });
      
      if (response.status === 200) {
        const { employeeId, employeeName, email, role } = response.data;
        
        // Store user data
        localStorage.setItem('employeeId', employeeId);
        localStorage.setItem('employeeName', employeeName);
        localStorage.setItem('role', role);
        localStorage.setItem('email', email);
        
        // Show animated success toast
        toast.success('🎉 Login successful! Redirecting...', toastConfig);
        
        // Navigate to the Board page after a delay
        setTimeout(() => {
          navigate('/Board');
        }, 2000);
      }
    } catch (error) {
      setIsLoading(false);
      
      if (error.response?.status === 401 || error.response?.status === 404) {
        setError('Invalid credentials or user does not exist.');
        toast.error('❌ Login failed. Please check your credentials.', toastConfig);
      } else {
        setError('An error occurred. Please try again.');
        toast.error('❌ Network error. Please try again later.', toastConfig);
      }
    }
  };

  return (
    <LoginWrapper>
      <StyledToastContainer />
      
      <FormContainer>
        <Title>Welcome Back</Title>
        
        <form onSubmit={handleSubmit} autoComplete="off">
          <InputGroup>
            <InputLabel htmlFor="employeeId">Employee ID</InputLabel>
            <InputIcon>
              <FaIdCard />
            </InputIcon>
            <StyledInput
              type="text"
              id="employeeId"
              placeholder="Enter your employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              autoComplete="off"
            />
          </InputGroup>
          
          <InputGroup>
            <InputLabel htmlFor="employeeName">Employee Name</InputLabel>
            <InputIcon>
              <FaUser />
            </InputIcon>
            <StyledInput
              type="text"
              id="employeeName"
              placeholder="Enter your full name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              required
              autoComplete="off"
            />
          </InputGroup>
          
          <InputGroup>
            <InputLabel htmlFor="password">Password</InputLabel>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <PasswordWrapper>
              <StyledInput
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <PasswordIcon onClick={togglePasswordVisibility}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </PasswordIcon>
            </PasswordWrapper>
          </InputGroup>
          
          <ButtonContainer>
            <StyledButton type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </StyledButton>
          </ButtonContainer>
        </form>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </FormContainer>
    </LoginWrapper>
  );
};

export default LogIn;