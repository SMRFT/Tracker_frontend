import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Home from './Images/home.png';

// Title Animation: Fade-in and color change
const fadeInColor = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
    color: #ffffff;
  }
  50% {
    color: #FFD700;
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    color: #ffffff;
  }
`;

// Paragraph Animation: Slide-in from the right
const slideInRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url(${Home});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  text-align: center;

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-top: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  color: white;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
  animation: ${fadeInColor} 3s ease-in-out;
  margin: 2rem 1rem;
  margin-left: 400px;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin: 0.5rem;
  }
`;

const Paragraph = styled.p`
  color: white;
  font-size: 1.2rem;
  text-align: center;
  max-width: 600px;
  margin: 1rem;
  margin-left: 400px;
  animation: ${slideInRight} 2s ease-out;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 0.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin: 0.5rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  position: absolute;
  top: 1.5rem;
  right: 2rem;

  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    top: 0.5rem;
    right: 0.5rem;
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const StyledButton = styled(Link)`
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: #6B728E;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #4b5563;
    transform: translateY(-3px);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const HomePage = () => {
  return (
    <HomeWrapper>
      <Title>Welcome to Shinova</Title>
      <Paragraph>
        Boost your productivity with our innovative Jira-based work tracking solution. Stay organized, collaborate seamlessly, and achieve your goals efficiently.
      </Paragraph>
      <ButtonContainer>
        <StyledButton to="/Login">Login</StyledButton>
        <StyledButton to="/Register">Register</StyledButton>
      </ButtonContainer>
    </HomeWrapper>
  );
};

export default HomePage;
