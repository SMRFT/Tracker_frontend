import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

const MembersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  position: relative;
`;

const EmployeeRow = styled.div`
  display: flex;
  justify-content: flex-start; /* Align items to the left */
  flex-wrap: wrap;
  margin-bottom: 20px;
  width: 100%; /* Ensure it takes the full width */
`;

const EmployeeCard = styled.div`
  background-color: #F0F0F0;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  width: 250px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const EmployeeName = styled.span`
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 8px;
`;

const EmployeeId = styled.span`
  color: #888;
`;

const InviteButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #45A049;
  }
`;

const Members = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/get-employees/')
      .then(response => response.json())
      .then(data => setEmployees(data))
      .catch(error => console.error('Error fetching employee data:', error));
  }, []);

  const handleRegisterClick = () => {
    navigate('/Register');
  };

  // Split employees into rows of 3
  const employeeRows = [];
  for (let i = 0; i < employees.length; i += 5) {
    employeeRows.push(employees.slice(i, i + 5));
  }

  return (
    <MembersContainer>
      <InviteButton onClick={handleRegisterClick}>Invite Member</InviteButton>
        <center><h2>Employee List</h2></center> <br/>
      {employeeRows.map((row, rowIndex) => (
        <EmployeeRow key={rowIndex}>
          {row.map(employee => (
            <EmployeeCard key={employee.employeeId}>
              <EmployeeName>{employee.employeeName}</EmployeeName>
              <EmployeeId>{employee.employeeId}</EmployeeId>
            </EmployeeCard>
          ))}
        </EmployeeRow>
      ))}
    </MembersContainer>
  );
};

export default Members;
