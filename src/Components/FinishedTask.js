import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled, { keyframes } from "styled-components";
import apiRequest from "./apiRequest";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const Trackerbaseurl = process.env.REACT_APP_BACKEND_TRACKER_BASE_URL;

// Detect if device is mobile
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth <= 768;
};

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Enhanced Styled Components
const Container = styled.div`
  padding: ${(props) => (props.isMobile ? "1rem" : "2rem")};
  max-width: 1200px;
  margin: ${(props) => (props.isMobile ? "0" : "0 auto")};
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: ${(props) => (props.isMobile ? "0" : "16px")};
  box-shadow: ${(props) =>
    props.isMobile ? "none" : "0 10px 30px rgba(0, 0, 0, 0.1)"};
  animation: ${fadeIn} 0.6s ease-out;
  min-height: ${(props) => (props.isMobile ? "100vh" : "auto")};

  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0;
    border-radius: 0;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${(props) => (props.isMobile ? "1.5rem" : "2rem")};
  padding: ${(props) => (props.isMobile ? "0.5rem 0" : "0")};

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

const Title = styled.h2`
  color: #2c3e50;
  font-size: ${(props) => (props.isMobile ? "1.75rem" : "2.5rem")};
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #0f0c0dff 0%, #181213ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: ${(props) => (props.isMobile ? "1rem" : "1.5rem")};
  margin-bottom: ${(props) => (props.isMobile ? "1.5rem" : "2rem")};
  padding: ${(props) => (props.isMobile ? "1rem" : "1.5rem")};
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 50;
  flex-direction: ${(props) => (props.isMobile ? "column" : "row")};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`;

const SearchInput = styled.input`
  padding: ${(props) => (props.isMobile ? "12px 14px" : "10px 14px")};
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  width: ${(props) => (props.isMobile ? "100%" : "350px")};
  background: #f8f9fa;
  transition: 0.3s;
  font-size: ${(props) => (props.isMobile ? "16px" : "1rem")};
  height: ${(props) => (props.isMobile ? "48px" : "50px")};

  &:focus {
    outline: none;
    border-color: hsla(347, 39%, 73%, 1);
    box-shadow: 0 0 0 3px rgba(243, 88, 109, 0.1);
    background: white;
  }

  &::placeholder {
    font-size: ${(props) => (props.isMobile ? "14px" : "1rem")};
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 14px;
    font-size: 16px;
  }
`;

const MemberList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;

  @media (max-width: 768px) {
    gap: 0.3rem;
  }
`;

const MemberItem = styled.div`
  background: #fce4ec;
  color: hsla(349, 95%, 77%, 1);
  padding: ${(props) => (props.isMobile ? "0.5rem 1rem" : "0.4rem 0.8rem")};
  border-radius: 6px;
  font-size: ${(props) => (props.isMobile ? "0.85rem" : "0.8rem")};
  font-weight: 500;
  display: inline-block;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
`;

const ActionSection = styled.div`
  display: flex;
  gap: ${(props) => (props.isMobile ? "0.75rem" : "1rem")};
  margin-bottom: ${(props) => (props.isMobile ? "1.5rem" : "2rem")};
  padding: ${(props) => (props.isMobile ? "0.75rem" : "1rem")};
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  flex-direction: ${(props) => (props.isMobile ? "column" : "row")};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.75rem;
  }
`;

const DateFilterWrapper = styled.div`
  display: flex;
  gap: ${(props) => (props.isMobile ? "0.75rem" : "1rem")};
  align-items: center;
  flex-wrap: wrap;
  width: ${(props) => (props.isMobile ? "100%" : "auto")};
  flex-direction: ${(props) => (props.isMobile ? "column" : "row")};

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 0.75rem;
  }
`;

const DatePickerWrapper = styled.div`
  position: relative;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  width: ${(props) => (props.isMobile ? "100%" : "auto")};

  label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6c757d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
    width: ${(props) => (props.isMobile ? "100%" : "180px")};
    padding: ${(props) => (props.isMobile ? "14px 16px" : "12px 16px")};
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: ${(props) => (props.isMobile ? "16px" : "0.95rem")};
    transition: all 0.3s ease;
    background: #f8f9fa;
    color: #2c3e50;
    font-weight: 500;

    &::placeholder {
      color: #adb5bd;
      font-size: ${(props) => (props.isMobile ? "14px" : "inherit")};
    }

    &:focus {
      outline: none;
      border-color: #ff9a9e;
      box-shadow: 0 0 0 3px rgba(235, 86, 121, 0.1);
      background: white;
    }

    &:hover {
      border-color: #fad0c4;
    }
  }

  .react-datepicker-popper {
    z-index: 1000 !important;
  }

  .react-datepicker {
    z-index: 1000 !important;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    font-size: ${(props) => (props.isMobile ? "1rem" : "inherit")};
  }

  .react-datepicker__header {
    background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
    border-bottom: none;
    border-radius: 6px 6px 0 0;
    padding: ${(props) => (props.isMobile ? "12px 0" : "8px 0")};
  }

  .react-datepicker__day,
  .react-datepicker__day-name {
    width: ${(props) => (props.isMobile ? "2.5rem" : "1.7rem")};
    line-height: ${(props) => (props.isMobile ? "2.5rem" : "1.7rem")};
    margin: ${(props) => (props.isMobile ? "0.25rem" : "0.166rem")};
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range {
    background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
    color: white;
  }

  .react-datepicker__day:hover {
    background: #f0f0f0;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    width: 100%;

    .react-datepicker__input-container input {
      width: 100%;
      padding: 14px 16px;
      font-size: 16px;
    }
  }
`;

const Button = styled.button`
  padding: ${(props) => (props.isMobile ? "12px 20px" : "10px 16px")};
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: ${(props) => (props.isMobile ? "1rem" : "0.9rem")};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  width: ${(props) => (props.isMobile ? "100%" : "auto")};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(235, 86, 121, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 20px;
    font-size: 1rem;
  }
`;

const ClearButton = styled(Button)`
  background: #6c757d;

  &:hover {
    background: #5a6268;
    box-shadow: 0 6px 16px rgba(108, 117, 125, 0.3);
  }
`;

const ViewButton = styled.button`
  padding: ${(props) => (props.isMobile ? "10px 16px" : "8px 14px")};
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: ${(props) => (props.isMobile ? "0.9rem" : "0.8rem")};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  width: ${(props) => (props.isMobile ? "100%" : "auto")};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(235, 86, 121, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px 16px;
  }
`;

const TableWrapper = styled.div`
  background: white;
  border-radius: 12px;
  overflow: ${(props) => (props.isMobile ? "visible" : "hidden")};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    overflow: visible;
    box-shadow: none;
    background: transparent;
    border-radius: 0;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  display: ${(props) => (props.isMobile ? "none" : "table")};

  @media (max-width: 768px) {
    display: none;
  }
`;

const Th = styled.th`
  padding: 1.2rem 1rem;
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  color: white;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 10;

  &:first-child {
    border-top-left-radius: 12px;
  }

  &:last-child {
    border-top-right-radius: 12px;
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  vertical-align: top;
  transition: background-color 0.2s ease;
`;

const Tr = styled.tr`
  transition: all 0.3s ease;

  &:nth-child(even) {
    background-color: #f8f9fa;
  }

  &:hover {
    background-color: #e3f2fd !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:last-child td {
    border-bottom: none;
  }
`;

// Mobile Card View
const CardList = styled.div`
  display: ${(props) => (props.isMobile ? "flex" : "none")};
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
`;

const CardTitle = styled.div`
  flex: 1;
`;

const CardBoardName = styled.div`
  font-size: 0.75rem;
  color: #6c757d;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
`;

const CardTaskName = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  word-break: break-word;
`;

const CardSection = styled.div`
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CardLabel = styled.div`
  font-size: 0.7rem;
  color: #6c757d;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 0.3rem;
`;

const CardValue = styled.div`
  font-size: 0.9rem;
  color: #495057;
  font-weight: 500;
`;

const DateRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

const DateColumn = styled.div`
  flex: 1;
`;

const NoDataWrapper = styled.div`
  text-align: center;
  padding: ${(props) => (props.isMobile ? "2rem 1rem" : "3rem 2rem")};
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const NoDataMessage = styled.p`
  font-size: ${(props) => (props.isMobile ? "1rem" : "1.2rem")};
  color: #6c757d;
  margin: 1rem 0;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const NoDataIcon = styled.div`
  font-size: ${(props) => (props.isMobile ? "3rem" : "4rem")};
  color: #dee2e6;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${(props) => (props.isMobile ? "2rem" : "3rem")};
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const LoadingSpinner = styled.div`
  width: ${(props) => (props.isMobile ? "35px" : "40px")};
  height: ${(props) => (props.isMobile ? "35px" : "40px")};
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: ${(props) => (props.isMobile ? "0.75rem 1.5rem" : "0.6rem 1.2rem")};
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  color: white;
  border-radius: 20px;
  font-size: ${(props) => (props.isMobile ? "0.9rem" : "0.8rem")};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  width: ${(props) => (props.isMobile ? "100%" : "auto")};
  text-align: center;

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
`;

// Modal Styles
const Modal = styled.div`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: ${(props) => (props.isMobile ? "flex-end" : "center")};
  z-index: 2000;
  padding: ${(props) => (props.isMobile ? "0" : "1rem")};

  @media (max-width: 768px) {
    align-items: flex-end;
    padding: 0;
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: ${(props) => (props.isMobile ? "16px 16px 0 0" : "12px")};
  max-width: ${(props) => (props.isMobile ? "100%" : "700px")};
  width: 100%;
  max-height: ${(props) => (props.isMobile ? "85vh" : "90vh")};
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: ${slideUp} 0.3s ease-out;

  @media (max-width: 768px) {
    border-radius: 16px 16px 0 0;
    max-height: 85vh;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #eb5679;
    border-radius: 4px;

    &:hover {
      background: #d6156c;
    }
  }
`;

const ModalHeader = styled.div`
  padding: ${(props) => (props.isMobile ? "1.25rem" : "1.5rem")};
  background: linear-gradient(135deg, #e87e9cff 0%, #fad0c4 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const ModalTitle = styled.div`
  flex: 1;
`;

const BoardNameModal = styled.div`
  font-size: ${(props) => (props.isMobile ? "0.8rem" : "0.85rem")};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.9;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const CardNameModal = styled.h3`
  margin: 0;
  font-size: ${(props) => (props.isMobile ? "1.2rem" : "1.4rem")};
  font-weight: 700;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  width: ${(props) => (props.isMobile ? "40px" : "36px")};
  height: ${(props) => (props.isMobile ? "40px" : "36px")};
  border-radius: 50%;
  cursor: pointer;
  font-size: ${(props) => (props.isMobile ? "1.4rem" : "1.2rem")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }

  &:active {
    transform: rotate(90deg) scale(0.95);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.4rem;
  }
`;

const ModalBody = styled.div`
  padding: ${(props) => (props.isMobile ? "1.25rem" : "1.5rem")};
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.isMobile ? "1.25rem" : "1.5rem")};

  @media (max-width: 768px) {
    padding: 1.25rem;
    gap: 1.25rem;
  }
`;

const ModalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionLabel = styled.label`
  font-size: ${(props) => (props.isMobile ? "0.7rem" : "0.75rem")};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6c757d;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const DateGrid = styled.div`
  display: grid;
  grid-template-columns: ${(props) => (props.isMobile ? "1fr" : "1fr 1fr")};
  gap: ${(props) => (props.isMobile ? "0.75rem" : "1rem")};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const DateBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const DateValue = styled.div`
  font-size: ${(props) => (props.isMobile ? "0.95rem" : "1rem")};
  font-weight: 600;
  color: rgba(243, 13, 67, 1);

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const DescriptionBox = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: ${(props) => (props.isMobile ? "1rem" : "0.8rem")};
  max-height: ${(props) => (props.isMobile ? "200px" : "150px")};
  overflow-y: auto;
  font-size: ${(props) => (props.isMobile ? "0.95rem" : "0.9rem")};
  color: #495057;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(238, 21, 72, 1);
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    max-height: 200px;
    font-size: 0.95rem;
  }
`;

const CommentsBox = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: ${(props) => (props.isMobile ? "1.25rem" : "1rem")};
  max-height: ${(props) => (props.isMobile ? "300px" : "250px")};
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #eb5679;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    max-height: 300px;
  }
`;

const CommentItem = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }
`;

const CommentAuthor = styled.div`
  font-size: ${(props) => (props.isMobile ? "0.85rem" : "0.8rem")};
  font-weight: 700;
  color: #eb5679;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.3rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const CommentText = styled.div`
  font-size: ${(props) => (props.isMobile ? "0.95rem" : "0.9rem")};
  color: #495057;
  line-height: 1.5;
  margin-bottom: 0.3rem;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const CommentTime = styled.div`
  font-size: ${(props) => (props.isMobile ? "0.8rem" : "0.75rem")};
  color: #adb5bd;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const FinishedTask = () => {
  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  const [from, setFrom] = useState(oneWeekAgo);
  const [to, setTo] = useState(today);
  const [finishedCards, setFinishedCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isMobileView, setIsMobileView] = useState(isMobile());

  const role = localStorage.getItem("role");
  const employeeId = localStorage.getItem("employeeId");

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(isMobile());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchFinishedCards = useCallback(async () => {
    if (!from || !to) {
      toast.error("Please select both From and To dates");
      return;
    }

    setIsLoading(true);

    const fromStr = from.toISOString().split("T")[0];
    const toStr = to.toISOString().split("T")[0];
    const url = `${Trackerbaseurl}cards/done/date-range/?from=${fromStr}&to=${toStr}&auth-user-id=${employeeId}&role=${role}`;

    try {
      const response = await apiRequest(url, "GET");
      let data = response?.data?.data || response?.data || [];

      if (!Array.isArray(data)) data = [];
      setFinishedCards(data);
      setFilteredCards(data);

      if (data.length === 0) {
        toast.info("No finished cards found for selected range", { autoClose: 2000 });
      }
    } catch (error) {
      toast.error("Failed to fetch finished cards");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [from, to, employeeId, role]);

  useEffect(() => {
    if (employeeId && role) fetchFinishedCards();
    else toast.error("Missing employee ID or role", { autoClose: 2000 });
  }, [employeeId, role, from, to, fetchFinishedCards]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCards(finishedCards);
      return;
    }

    const lower = searchTerm.toLowerCase();
    const filtered = finishedCards.filter(
      (card) =>
        card.cardName?.toLowerCase().includes(lower) ||
        card.boardName?.toLowerCase().includes(lower) ||
        card.employeeId?.toLowerCase().includes(lower) ||
        card.members?.some(
          (m) =>
            m.employeeName?.toLowerCase().includes(lower) ||
            m.employeeId?.toLowerCase().includes(lower)
        )
    );

    setFilteredCards(filtered);
  }, [searchTerm, finishedCards]);

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

  const handleClear = () => {
    setSearchTerm("");
    const newFrom = new Date();
    const newTo = new Date();
    newFrom.setDate(newTo.getDate() - 7);
    setFrom(newFrom);
    setTo(newTo);
    toast.info("Filters cleared", { autoClose: 1500 });
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const currentDate = new Date().toLocaleString();

    const printContent = `
    <html>
      <head>
        <title>Finished Tasks Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 2rem;
            color: #2c3e50;
          }
          h1 {
            color: #f6676e;
            text-align: center;
            margin-bottom: 0.5rem;
          }
          .timestamp {
            text-align: center;
            color: #6c757d;
            margin-bottom: 2rem;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
          }
          th {
            background: linear-gradient(135deg, #fec0c2ff 0%, rgba(254, 182, 185, 1) 100%);
            color: white;
            padding: 1rem;
            text-align: left;
          }
          td {
            padding: 1rem;
            border-bottom: 1px solid #e9ecef;
            vertical-align: top;
          }
          tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          .members {
            font-size: 0.9rem;
            color: #c2185b;
          }
          @media print {
            body { margin: 1rem; }
          }
        </style>
      </head>
      <body>
        <h1>Finished Tasks Report</h1>
        <div class="timestamp">Generated on: ${currentDate}</div>
        <table>
          <thead>
            <tr>
              <th>Board</th>
              <th>Task</th>
              <th>Members</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Description</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            ${finishedCards
              .map(
                (card) => `
              <tr>
                <td>${card.boardName || "—"}</td>
                <td>${card.cardName || "—"}</td>
                <td>
                  ${
                    card.members?.length
                      ? card.members
                          .map(
                            (m) =>
                              `<div class="members">${m.employeeName} (${m.employeeId})</div>`
                          )
                          .join("")
                      : "—"
                  }
                </td>
                <td>${formatDate(card.startdate)}</td>
                <td>${formatDate(card.enddate)}</td>
                <td>${card.description || "—"}</td>
                <td>
                  ${
                    card.comment?.length
                      ? card.comment
                          .map(
                            (c) => `
                            <div class="comment-box">
                              <strong>${c.empname} (ID: ${c.empid})</strong><br/>
                              ${c.commenttext}<br/>
                              <span class="comment-meta">${c.date} at ${c.time}</span>
                            </div>
                          `
                          )
                          .join("")
                      : "—"
                  }
                </td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleExportExcel = () => {
    const exportData = finishedCards.map((card) => ({
      Board: card.boardName || "—",
      Task: card.cardName || "—",
      Members: card.members?.length
        ? card.members.map((m) => `${m.employeeName} (${m.employeeId})`).join(", ")
        : "—",
      "Start Date": formatDate(card.startdate),
      "End Date": formatDate(card.enddate),
      Description: card.description || "—",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Finished Tasks");

    const today = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `Finished_Tasks_${today}.xlsx`);

    toast.success("Excel file downloaded successfully", {
      autoClose: 2000,
      closeOnClick: true,
      closeButton: true,
    });
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  if (isLoading) {
    return (
      <Container isMobile={isMobileView}>
        <Header isMobile={isMobileView}>
          <Title isMobile={isMobileView}>Finished Tasks</Title>
        </Header>
        <LoadingWrapper isMobile={isMobileView}>
          <LoadingSpinner isMobile={isMobileView} />
        </LoadingWrapper>
      </Container>
    );
  }

  return (
    <Container isMobile={isMobileView}>
      <Header isMobile={isMobileView}>
        <Title isMobile={isMobileView}>Finished Tasks</Title>
      </Header>

      <FilterSection isMobile={isMobileView}>
        <SearchInput
          isMobile={isMobileView}
          type="text"
          placeholder="Search member, card, board, employee ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <DateFilterWrapper isMobile={isMobileView}>
          <DatePickerWrapper isMobile={isMobileView}>
            <DatePicker
              selected={from}
              onChange={(date) => setFrom(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select start date"
              maxDate={new Date()}
            />
          </DatePickerWrapper>

          <DatePickerWrapper isMobile={isMobileView}>
            <DatePicker
              selected={to}
              onChange={(date) => setTo(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select end date"
              maxDate={new Date()}
            />
          </DatePickerWrapper>

          <ClearButton isMobile={isMobileView} onClick={handleClear}>
            Clear
          </ClearButton>
        </DateFilterWrapper>

        <Badge isMobile={isMobileView}>{filteredCards.length} Tasks</Badge>
      </FilterSection>

      <ActionSection isMobile={isMobileView}>
        <Button isMobile={isMobileView} onClick={handlePrint}>
          Print
        </Button>
        <Button isMobile={isMobileView} onClick={handleExportExcel}>
          Export Excel
        </Button>
      </ActionSection>

      {filteredCards.length === 0 ? (
        <NoDataWrapper isMobile={isMobileView}>
          <NoDataIcon isMobile={isMobileView}>📭</NoDataIcon>
          <NoDataMessage isMobile={isMobileView}>No finished tasks found</NoDataMessage>
        </NoDataWrapper>
      ) : (
        <TableWrapper isMobile={isMobileView}>
          {/* Desktop Table View */}
          <Table isMobile={isMobileView}>
            <thead>
              <tr>
                <Th>Board Name</Th>
                <Th>Card Name</Th>
                <Th>Members</Th>
                <Th>From Date</Th>
                <Th>Due Date</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((card) => (
                <Tr key={card.cardId}>
                  <Td>{card.boardName || "—"}</Td>
                  <Td>{card.cardName || "—"}</Td>
                  <Td>
                    <MemberList>
                      {card.members?.length ? (
                        card.members.map((m) => (
                          <MemberItem key={m.employeeId}>
                            {m.employeeName} ({m.employeeId})
                          </MemberItem>
                        ))
                      ) : (
                        <span>—</span>
                      )}
                    </MemberList>
                  </Td>
                  <Td>{formatDate(card.startdate)}</Td>
                  <Td>{formatDate(card.enddate)}</Td>
                  <Td>
                    <ViewButton onClick={() => setSelectedCard(card)}>View</ViewButton>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>

          {/* Mobile Card View */}
          <CardList isMobile={isMobileView}>
            {filteredCards.map((card) => (
              <Card key={card.cardId}>
                <CardHeader>
                  <CardTitle>
                    <CardBoardName>{card.boardName || "—"}</CardBoardName>
                    <CardTaskName>{card.cardName || "—"}</CardTaskName>
                  </CardTitle>
                </CardHeader>

                <CardSection>
                  <CardLabel>Members</CardLabel>
                  <MemberList>
                    {card.members?.length ? (
                      card.members.map((m) => (
                        <MemberItem key={m.employeeId} isMobile={isMobileView}>
                          {m.employeeName} ({m.employeeId})
                        </MemberItem>
                      ))
                    ) : (
                      <CardValue>—</CardValue>
                    )}
                  </MemberList>
                </CardSection>

                <DateRow>
                  <DateColumn>
                    <CardLabel>Start Date</CardLabel>
                    <CardValue>{formatDate(card.startdate)}</CardValue>
                  </DateColumn>
                  <DateColumn>
                    <CardLabel>Due Date</CardLabel>
                    <CardValue>{formatDate(card.enddate)}</CardValue>
                  </DateColumn>
                </DateRow>

                <CardSection>
                  <ViewButton
                    isMobile={isMobileView}
                    onClick={() => setSelectedCard(card)}
                  >
                    View Details
                  </ViewButton>
                </CardSection>
              </Card>
            ))}
          </CardList>
        </TableWrapper>
      )}

      {/* Modal for Card Details */}
      <Modal isOpen={!!selectedCard} isMobile={isMobileView} onClick={closeModal}>
        <ModalContent isMobile={isMobileView} onClick={(e) => e.stopPropagation()}>
          {selectedCard && (
            <>
              <ModalHeader isMobile={isMobileView}>
                <ModalTitle>
                  <BoardNameModal isMobile={isMobileView}>
                    {selectedCard.boardName}
                  </BoardNameModal>
                  <CardNameModal isMobile={isMobileView}>
                    {selectedCard.cardName}
                  </CardNameModal>
                </ModalTitle>
                <CloseButton isMobile={isMobileView} onClick={closeModal}>
                  ✕
                </CloseButton>
              </ModalHeader>

              <ModalBody isMobile={isMobileView}>
                {/* Members */}
                <ModalSection>
                  <SectionLabel isMobile={isMobileView}>Members</SectionLabel>
                  <MemberList>
                    {selectedCard.members?.length ? (
                      selectedCard.members.map((m) => (
                        <MemberItem key={m.employeeId} isMobile={isMobileView}>
                          {m.employeeName} ({m.employeeId})
                        </MemberItem>
                      ))
                    ) : (
                      <span>No members assigned</span>
                    )}
                  </MemberList>
                </ModalSection>

                {/* Dates */}
                <DateGrid isMobile={isMobileView}>
                  <DateBox>
                    <SectionLabel isMobile={isMobileView}>Start Date</SectionLabel>
                    <DateValue isMobile={isMobileView}>
                      {formatDate(selectedCard.startdate)}
                    </DateValue>
                  </DateBox>
                  <DateBox>
                    <SectionLabel isMobile={isMobileView}>Due Date</SectionLabel>
                    <DateValue isMobile={isMobileView}>
                      {formatDate(selectedCard.enddate)}
                    </DateValue>
                  </DateBox>
                </DateGrid>

                {/* Description */}
                {selectedCard.description && (
                  <ModalSection>
                    <SectionLabel isMobile={isMobileView}>Description</SectionLabel>
                    <DescriptionBox isMobile={isMobileView}>
                      {selectedCard.description}
                    </DescriptionBox>
                  </ModalSection>
                )}

                {/* Comments */}
                {selectedCard.comment?.length > 0 && (
                  <ModalSection>
                    <SectionLabel isMobile={isMobileView}>
                      Comments ({selectedCard.comment.length})
                    </SectionLabel>
                    <CommentsBox isMobile={isMobileView}>
                      {selectedCard.comment.map((com, idx) => (
                        <CommentItem key={idx}>
                          <CommentAuthor isMobile={isMobileView}>
                            {com.empname} (ID: {com.empid})
                          </CommentAuthor>
                          <CommentText isMobile={isMobileView}>
                            {com.commenttext}
                          </CommentText>
                          <CommentTime isMobile={isMobileView}>
                            {com.date} at {com.time}
                          </CommentTime>
                        </CommentItem>
                      ))}
                    </CommentsBox>
                  </ModalSection>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default FinishedTask;