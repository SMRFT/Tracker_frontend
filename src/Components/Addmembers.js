import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaPlusCircle, FaTrashAlt, FaTimes } from 'react-icons/fa';
import { MdOutlinePersonOutline } from "react-icons/md";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1001;
`;
const MembersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
`;
const EmployeeCard = styled.div`
  background-color: #F0F0F0;
  color: black;
  border-radius: 8px;
  padding: 10px 20px;
  margin: 10px 0;
  width: 300px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
const EmployeeName = styled.span`
  font-weight: bold;
  cursor: pointer;
`;
const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${props => (props.delete ? 'red' : 'green')};
  font-size: 1.2em;
  &:hover {
    opacity: 0.8;
  }
`;
const SearchBox = styled.input`
  padding: 8px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
`;
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #ccc;
  font-size: 1.5em;
  &:hover {
    color: black;
  }
`;
const Message = styled.div`
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  color: ${props => (props.success ? 'green' : 'red')};
  background-color: ${props => (props.success ? '#D4EDDA' : '#F8D7DA')};
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
const Addmembers = ({ cardId, cardName, boardId, closeModal }) => {
  const [employees, setEmployees] = useState([]);
  const [addedMembers, setAddedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://tracker.shinovadatabase.in/get-employees/');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        setError('Error fetching employee data');
      } finally {
        setLoading(false);
      }
    };
    const fetchAddedMembers = async () => {
      try {
        const response = await fetch(
          `https://tracker.shinovadatabase.in/add_member_to_card/?cardId=${cardId}&boardId=${boardId}&cardName=${cardName}`
        );
        const data = await response.json();
        setAddedMembers(data);
      } catch (error) {
        console.error('Error fetching added members:', error);
      }
    };
    fetchEmployees();
    fetchAddedMembers();
  }, [cardId, boardId, cardName]);

  const handleSelect = async (employee) => {
    setLoading(true);
    try {
      const response = await fetch('https://tracker.shinovadatabase.in/add_member_to_card/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId,
          employeeId: employee.employeeId,
          employeeName: employee.employeeName,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error || 'Error adding member.');
      } else {
        setAddedMembers([...addedMembers, employee]);
        setEmployees(employees.filter((emp) => emp.employeeId !== employee.employeeId));
        toast.success('Member added successfully!');
      }
    } catch (error) {
      toast.error('Error adding member.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (employee) => {
    try {
      const response = await fetch(
        `https://tracker.shinovadatabase.in/add_member_to_card/?cardId=${cardId}&employeeId=${employee.employeeId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to remove member');
      }
      setAddedMembers(addedMembers.filter((member) => member.employeeId !== employee.employeeId));
      setEmployees([...employees, employee]);
      toast.warn('Member removed successfully!');
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Error removing member.');
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !addedMembers.some((member) => member.employeeId === employee.employeeId)
  );


  return (
    <ModalBackdrop>
      <ModalContainer>
        <MembersContainer>
          <CloseButton onClick={closeModal}><FaTimes /></CloseButton>
          <h2>Members</h2>
          <SearchBox
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

          {filteredEmployees.length > 0 ? (
            filteredEmployees.map(employee => (
              <EmployeeCard key={employee.employeeId}>
                <EmployeeName>{employee.employeeName}</EmployeeName>
                <span>{employee.employeeId}</span>
                <IconButton onClick={() => handleSelect(employee)}>
                  <FaPlusCircle />
                </IconButton>
              </EmployeeCard>
            ))
          ) : (
            <p>No employees found.</p>
          )}
          <h2>Added Members</h2>
          {addedMembers.length > 0 ? (
            addedMembers.map(member => (
              <EmployeeCard key={member.employeeId}>
                <EmployeeName>{member.employeeName}</EmployeeName>
                <span>{member.employeeId}</span>
                <IconButton delete onClick={() => handleRemove(member)}>
                  <FaTrashAlt />
                </IconButton>
              </EmployeeCard>
            ))
          ) : (
            <p>No members added yet.</p>
          )}
        </MembersContainer>
      </ModalContainer>
    </ModalBackdrop>
  );
};
// Parent Component
const Addmembersbutton = ({ cardId }) => {
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
       <Button onClick={openModal}>
        <MdOutlinePersonOutline  style={{ marginRight: "8px", fontSize: "1.2rem" }} />
        Member
      </Button>   )}
      {showModal && <Addmembers closeModal={closeModal} cardId={cardId} />}
    </div>
  );
};
export default Addmembersbutton;