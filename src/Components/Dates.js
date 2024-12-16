import React, { useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTimes } from "react-icons/fa"; // Import cross icon from react-icons
import { CgCalendarDates } from "react-icons/cg";
import { useLocation, useNavigate } from 'react-router-dom';
// Styled Components
const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const Label = styled.label`
  width: 100px;
  font-size: 16px;
  color: black;
`;

const DateTextContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: white;
  border-radius: 16px;
  padding: 8px;
  margin-left: 8px;
`;

const StyledSpan = styled.span`
  margin-right: 8px;
  color: black;
`;

const Button = styled.button`
  margin-top: 15px;
  padding: 8px 16px;
  background-color: grey;
  color: white;
  border: none;
  border-radius: 4px;
  width: 120px;
  cursor: pointer;
  font-size: 1.1rem;
  display: flex; // Use flexbox
  align-items: center; // Center vertically
  justify-content: center; // Center horizontally
  float:right;
  &:hover {
    background-color: gray;
  }
`;

const CloseIconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: red;
  font-size: 24px;
  position: absolute;
  top: 10px;
  right: 10px;
  &:hover {
    color: darkred;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 400px;
  position: relative;
  z-index: 1001;
`;

// Date Component
const DateModal = ({ closeModal, cardId }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const location = useLocation();
  const {employeeId, employeeName,boardId, boardName,boardColor } = location.state || {};
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
console.log('id',employeeId)
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleSave = async () => {
    if (!startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
    }

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
   
    const response = await fetch(`http://127.0.0.1:8000/cards/${cardId}/?employeeId=${employeeId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            startdate: formattedStartDate,
            enddate: formattedEndDate,
        }),
    });

    if (response.ok) {
        
        closeModal();
    } else {
        const errorData = await response.json();
        alert(`Failed to save dates: ${errorData.error || 'Unknown error'}`);
    }
};

  return (
    <ModalBackdrop>
      <ModalContainer>
        <CloseIconButton onClick={closeModal}>
          <FaTimes /> {/* Cross icon */}
        </CloseIconButton>
        <h3>Select Dates</h3>
        <div>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Select start date"
          />
        </div>
        <div>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="Select end date"
          />
          <DateWrapper>
            <Label>Start Date:</Label>
            <DateTextContainer>
              <StyledSpan>
                {startDate ? startDate.toLocaleDateString() : 'Not selected'}
              </StyledSpan>
            </DateTextContainer>
          </DateWrapper>
          <DateWrapper>
            <Label>End Date:</Label>
            <DateTextContainer>
              <StyledSpan>
                {endDate ? endDate.toLocaleDateString() : 'Not selected'}
              </StyledSpan>
            </DateTextContainer>
          </DateWrapper>
        </div>
        <Button onClick={handleSave}>Save</Button> {/* Save button */}
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

  return (
    <div>
      <Button onClick={openModal}>
        <CgCalendarDates style={{ marginRight: "8px", fontSize: "1.2rem" }} />
        Dates
      </Button>

      {showModal && <DateModal closeModal={closeModal} cardId={cardId} />}
    </div>
  );
};

export default DateButton;
