import React, { useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTimes, FaCalendarAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Styled Components
const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const Label = styled.label`
  width: 100px;
  font-size: 16px;
  color: #4a4a4a;
  font-weight: bold;
`;

const DateTextContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 8px;
  margin-left: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const IconWrapper = styled.div`
  cursor: pointer;
  color: #4caf50;
  font-size: 1.5rem;
  margin-right: 8px;
  transition: color 0.3s ease;

  &:hover {
    color: #45a049;
  }
`;

const Button = styled.button`
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  width: 150px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  float: right;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #45a049;
  }
`;

const CloseIconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #f44336;
  font-size: 24px;
  position: absolute;
  top: 10px;
  right: 10px;
  transition: color 0.3s ease;
  &:hover {
    color: #d32f2f;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: #ffffff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  width: 420px;
  position: relative;
  z-index: 1001;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Date Modal Component
const DateModal = ({ closeModal, cardId }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isStartDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const location = useLocation();
  const { employeeId } = location.state || {};

  const toggleStartDatePicker = () => {
    setStartDatePickerOpen(!isStartDatePickerOpen);
  };

  const toggleEndDatePicker = () => {
    setEndDatePickerOpen(!isEndDatePickerOpen);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(date);
    }
    setStartDatePickerOpen(false);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate && date < startDate) {
      setStartDate(date);
    }
    setEndDatePickerOpen(false);
  };

  const handleSave = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }
  
    const formatDateToLocal = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
  
    const formattedStartDate = formatDateToLocal(startDate);
    const formattedEndDate = formatDateToLocal(endDate);
  
    try {
      const response = await fetch(
        `https://tracker.shinovadatabase.in/cards/${cardId}/?employeeId=${employeeId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startdate: formattedStartDate,
            enddate: formattedEndDate,
          }),
        }
      );
      const responseData = await response.json();  // Ensure you're parsing the response correctly
  
      if (response.ok) {
        // Show success toast if response contains the message
        toast.success(responseData.message || "Date updated successfully!", {
          autoClose: 3000,
          position: "top-right",
        });
        closeModal();
      } else {
        toast.error(responseData.error || "Failed to save dates.");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };
  
  
  

  return (
    <ModalBackdrop>
      <ModalContainer>
        <CloseIconButton onClick={closeModal}>
          <FaTimes />
        </CloseIconButton>
        <h3 style={{ color: "#4caf50" }}>Select Dates</h3>
        <DateWrapper>
          <Label>Start Date:</Label>
          <IconWrapper onClick={toggleStartDatePicker}>
            <FaCalendarAlt />
          </IconWrapper>
          <DateTextContainer>
            <span>{startDate ? startDate.toLocaleDateString() : "Not selected"}</span>
          </DateTextContainer>
        </DateWrapper>
        {isStartDatePickerOpen && (
          <DatePicker selected={startDate} onChange={handleStartDateChange} inline />
        )}
        <DateWrapper>
          <Label>End Date:</Label>
          <IconWrapper onClick={toggleEndDatePicker}>
            <FaCalendarAlt />
          </IconWrapper>
          <DateTextContainer>
            <span>{endDate ? endDate.toLocaleDateString() : "Not selected"}</span>
          </DateTextContainer>
        </DateWrapper>
        {isEndDatePickerOpen && (
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            minDate={startDate}
            inline
          />
        )}
        <Button onClick={handleSave}>Save</Button>
        <ToastContainer />
      </ModalContainer>
    </ModalBackdrop>
  );
};

// Parent Component
const DateButton = ({ cardId }) => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const role = localStorage.getItem('role');
  return (
    <div>
      {(role === 'Admin' || role === 'HOD') && (
      <Button onClick={openModal} style={{ fontWeight: "bold" }}>
        <FaCalendarAlt style={{ marginRight: "8px", fontSize: "1.2rem" }} />
        Dates
      </Button>)}

      {showModal && <DateModal closeModal={closeModal} cardId={cardId} />}
      <ToastContainer />
    </div>
  );
};

export default DateButton;
