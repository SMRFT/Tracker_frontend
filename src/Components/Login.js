import React, { useState } from 'react';
import styled , { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Image1 from './Images/Login-Background.jpg';
import Image2 from './Images/Login-background2.jpg';
import Vector1 from './Images/Login-vector1.jpg';
import Vector2 from './Images/Login-vector2.jpg';
// LoginWrapper: Ensures the background image covers the entire viewport

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;
const LoginWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; // Ensure it covers the full viewport height
  // background-image: url(${Image2});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1300px; // Adjust width as needed
    height: 100%;
    background-image: url(${Vector1});
    background-size: contain;
    background-repeat: no-repeat;

    z-index: 0; // Behind the form container
  }

 
`;


// FormContainer: Adds blur effect and semi-transparent background to highlight the form
const FormContainer = styled.div`
  position: absolute;
  right: 100px; // Adjust the right position as needed
  padding: 2rem;
  border-radius: 15px;
  backdrop-filter: blur(12px); // Apply blur effect
  background-color:#E3E9FF; // Fully transparent background
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  z-index: 1; // Ensure the form is above the background and vector images
  color: Black; // White text color for better contrast
`;


const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: Black; // Ensure the title is white for readability
`;
const StyledInput = styled.input`
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 5px;
  width: 100%;
  font-size: 1rem;
  background-color: white; // Slightly lighter background for input fields
  color: #FFFFFF;
  &:focus {
    outline: none;
    background-color: white; // Darken the background color on focus
  }
`;
const StyledButton = styled.button`
  background-color: #6B728E;
  color: white;
  padding: 10px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100px;
  &:hover {
    background-color: #697565;
  }
`;
const ErrorMessage = styled.p`
  color: #DC3545;
  text-align: center;
`;
const LogIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Both username and password are required.');
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/login/', {
        email: username,
        password: password,
      });
      if (response.status === 200) {
        const { employeeId, employeeName, email } = response.data;
        localStorage.setItem('employeeId', employeeId);
        localStorage.setItem('employeeName', employeeName);
        localStorage.setItem('email', email);
        navigate('/Board');
      }
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 404) {
        setError('Invalid credentials or user does not exist.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };
  return (
    <LoginWrapper>
      <FormContainer>
        <Title>Login</Title>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label htmlFor="username">Username (Email)</label>
            <StyledInput
              type="text"
              className={`form-control ${error && !username ? 'is-invalid' : ''}`}
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="off"
            />
            {error && !username && <div className="invalid-feedback">{error}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <StyledInput
              type="password"
              className={`form-control ${error && !password ? 'is-invalid' : ''}`}
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            {error && !password && <div className="invalid-feedback">{error}</div>}
          </div>
          <center>
            <StyledButton type="submit">Sign in</StyledButton>
          </center>
        </form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div className="mt-3 text-center">
          <p>If not registered please, <Link to="/Register" >Register</Link></p>
          
        </div>
      </FormContainer>
    </LoginWrapper>
  );
};
export default LogIn;