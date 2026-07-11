import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTimes, FaCalendarAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "./apiRequest";

// ... [Keep all your existing styled components here: DateWrapper, Label, etc.] ...
// (I have omitted them to save space, but keep them exactly as they were in your file)

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
  background-color: ${(props) => (props.disabled ? "#e0e0e0" : "#f3f4f6")}; // slightly darker if disabled
  border-radius: 8px;
  padding: 8px;
  margin-left: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const IconWrapper = styled.div`
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  color: ${(props) => (props.disabled ? "#9e9e9e" : "#4caf50")};
  font-size: 1.5rem;
  margin-right: 8px;
  transition: color 0.3s ease;

  &:hover {
    color: ${(props) => (props.disabled ? "#9e9e9e" : "#45a049")};
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

// --- MODAL COMPONENT ---

const DateModal = ({ closeModal, cardId, boardId, onDateUpdate, existingStartDate }) => {
  // Initialize state with existingStartDate if present
  const [startDate, setStartDate] = useState(existingStartDate || null);
  const [endDate, setEndDate] = useState(null);
  
  const [isStartDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setEndDatePickerOpen] = useState(false);
  
  const location = useLocation();
  const Trackerbaseurl = process.env.REACT_APP_BACKEND_TRACKER_BASE_URL;

  // 👇 LOGIC CHANGE: Prevent opening if date exists
  const toggleStartDatePicker = () => {
    if (existingStartDate) return; 
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
    const userRole = localStorage.getItem("role");

    try {
      const response = await apiRequest(
        `${Trackerbaseurl}cards/${cardId}/${boardId}/${userRole}/`,
        "PATCH",
        {
          startdate: formattedStartDate,
          enddate: formattedEndDate,
        }
      );

      if (response.success) {
        toast.success(response.data?.message || "Date updated successfully!", {
          autoClose: 3000,
          position: "top-right",
        });
        
      if (onDateUpdate) {
          onDateUpdate(startDate, endDate); 
        }

        closeModal();
      } else {
        if (response.status === 401) {
          toast.error("Session expired. Please log in again.");
        } else if (response.status === 400) {
          toast.error(response.data?.error || "Invalid data provided.");
        } else {
          toast.error(response.error || "Failed to save dates.");
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <ModalBackdrop>
      <ModalContainer>
        <CloseIconButton onClick={closeModal}>
          <FaTimes />
        </CloseIconButton>
        <h3 style={{ color: "#4caf50" }}>Select Dates</h3>
        
        {/* START DATE SECTION */}
        <DateWrapper>
          <Label>Start Date:</Label>
          {/* 👇 Pass disabled prop for styling and check click */}
          <IconWrapper 
            onClick={toggleStartDatePicker} 
            disabled={!!existingStartDate}
            title={existingStartDate ? "Start date cannot be changed" : "Select start date"}
          >
            <FaCalendarAlt />
          </IconWrapper>
          <DateTextContainer disabled={!!existingStartDate}>
            <span>
              {startDate ? startDate.toLocaleDateString() : "Not selected"}
            </span>
          </DateTextContainer>
        </DateWrapper>

        {isStartDatePickerOpen && (
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            inline
          />
        )}

        {/* END DATE SECTION */}
        <DateWrapper>
          <Label>End Date:</Label>
          <IconWrapper onClick={toggleEndDatePicker}>
            <FaCalendarAlt />
          </IconWrapper>
          <DateTextContainer>
            <span>
              {endDate ? endDate.toLocaleDateString() : "Not selected"}
            </span>
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
      </ModalContainer>
    </ModalBackdrop>
  );
};

// --- PARENT WRAPPER COMPONENT ---

const DateButton = ({ cardId, boardId, onDateUpdate, existingStartDate }) => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const role = localStorage.getItem("role");

  return (
    <div>
      {(role === "Admin" || role === "HOD") && (
        <Button onClick={openModal} style={{ fontWeight: "bold" }}>
          <FaCalendarAlt style={{ marginRight: "8px", fontSize: "1.2rem" }} />
          Dates
        </Button>
      )}

      {showModal && (
        <DateModal
          closeModal={closeModal}
          cardId={cardId}
          boardId={boardId}
          onDateUpdate={onDateUpdate}
          // 👇 Pass the existing date down to the modal
          existingStartDate={existingStartDate}
        />
      )}
    </div>
  );
};

export default DateButton;