import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Home from './Images/home.png';

// More subtle and modern animations
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateX(15px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Modern gradient overlay for background image
const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 0 8rem;
  background-image: linear-gradient(
    to right,
    rgba(13, 17, 23, 0.8) 0%,
    rgba(13, 17, 23, 0.6) 50%,
    rgba(13, 17, 23, 0.3) 100%
  ), url(${Home});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  
  @media (max-width: 1024px) {
    padding: 0 4rem;
  }

  @media (max-width: 768px) {
    padding: 0 2rem;
    justify-content: flex-start;
    padding-top: 6rem;
    align-items: center;
  }
`;

// Modern typography with lighter weight
const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 600;
  color: white;
  letter-spacing: -0.5px;
  animation: ${fadeIn} 1s ease-out;
  margin: 0 0 1.5rem 0;
  max-width: 600px;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

// Subtle accent color and modern typography
const AccentSpan = styled.span`
  color: #6366f1;
  font-weight: 700;
`;

// Modern paragraph styling
const Paragraph = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.6;
  max-width: 550px;
  margin: 0 0 2.5rem 0;
  animation: ${slideIn} 1s ease-out 0.3s forwards;
  opacity: 0;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

// Modern button container with fixed position
const ButtonContainer = styled.div`
  position: absolute;
  top: 2rem;
  right: 2rem;
  display: flex;
  gap: 1rem;
  z-index: 10;
  
  @media (max-width: 768px) {
    top: 1.5rem;
    right: 1.5rem;
  }
  
  @media (max-width: 480px) {
    top: 1rem;
    right: 1rem;
  }
`;

// Action button container for CTA
const ActionContainer = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    gap: 0.75rem;
    align-items: center;
  }
`;

// Modern primary button with subtle hover effect
const PrimaryButton = styled(Link)`
  text-decoration: none;
  padding: 0.75rem 1.75rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  background: linear-gradient(90deg, #6366f1 0%, #4f46e5 100%);
  border: none;
  box-shadow: 0 4px 6px rgba(99, 102, 241, 0.25);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 10px rgba(99, 102, 241, 0.35);
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem 1.5rem;
  }
`;

// Modern secondary button (outline style)
const SecondaryButton = styled(Link)`
  text-decoration: none;
  padding: 0.75rem 1.75rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem 1.5rem;
  }
`;

// Modern navigation button
const NavButton = styled(Link)`
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  color: white;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const HomePage = () => {
  return (
    <HomeWrapper>
      <ButtonContainer>
        <NavButton to="/Login">Login</NavButton>
      </ButtonContainer>
      
      <Title>Welcome to <AccentSpan>SHiNova</AccentSpan></Title>
      <Paragraph>
        Boost your productivity with our innovative Jira-based work tracking solution. 
        Stay organized, collaborate seamlessly, and achieve your goals efficiently.
      </Paragraph>
      
      <ActionContainer>
        <PrimaryButton to="/Register">Get Started</PrimaryButton>
        {/* <SecondaryButton to="/Demo">See Demo</SecondaryButton> */}
      </ActionContainer>
    </HomeWrapper>
  );
};

export default HomePage;