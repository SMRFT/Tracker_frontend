import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaPlus, FaTrashAlt, FaTimes } from "react-icons/fa";
import { MdOutlinePersonOutline } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "./apiRequest";

// Robust check for mobile based on viewport width
const isMobile = () => {
  return window.innerWidth <= 768;
};

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  padding: ${(props) => (props.isMobile ? "0" : "20px")};
`;

const ModalContainer = styled.div`
  background-color: var(--bg-secondary);
  padding: 24px;
  border-radius: ${(props) => (props.isMobile ? "0" : "16px")};
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: ${(props) => (props.isMobile ? "100%" : "480px")};
  height: ${(props) => (props.isMobile ? "100vh" : "auto")};
  max-height: ${(props) => (props.isMobile ? "100vh" : "85vh")};
  display: flex;
  flex-direction: column;
  z-index: 3001;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-subtle);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-right: 30px;

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-main);
    margin: 0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: var(--border-subtle);
    color: var(--text-main);
    transform: rotate(90deg);
  }
`;

const SearchBox = styled.input`
  padding: 10px 14px;
  margin-bottom: 20px;
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  width: 100%;
  font-size: 0.9rem;
  color: var(--text-main);
  background-color: var(--bg-primary);
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: var(--text-light);
  }
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: var(--bg-primary);
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border-subtle);
    border-radius: 3px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 16px 0 8px 0;
  
  &:first-of-type {
    margin-top: 0;
  }
`;

const EmployeeCard = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary-accent);
    background: var(--bg-secondary);
  }
`;

const EmployeeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const AvatarCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${(props) => props.bgColor || "#6366f1"};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
`;

const TextDetails = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;

  .name {
    font-weight: 600;
    color: var(--text-main);
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sub {
    font-size: 0.75rem;
    color: var(--text-muted);
    display: flex;
    gap: 8px;
  }
`;

const ActionButton = styled.button`
  background: ${(props) => (props.isDelete ? "#fee2e2" : "#eeebff")};
  color: ${(props) => (props.isDelete ? "#ef4444" : "#6366f1")};
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: ${(props) => (props.isDelete ? "#fecaca" : "#e0dcfe")};
    transform: scale(1.05);
  }
`;

const TriggerButton = styled.button`
  width: 100%;
  padding: 10px 16px;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);

  &:hover {
    background-color: #4f46e5;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EmptyMessage = styled.p`
  color: var(--text-light);
  font-size: 0.85rem;
  text-align: center;
  margin: 12px 0;
  font-weight: 500;
`;

const getBackgroundColor = (name) => {
  const colors = [
    "#818cf8", // Indigo
    "#fb7185", // Rose
    "#fbbf24", // Amber
    "#34d399", // Emerald
    "#60a5fa", // Blue
    "#c084fc", // Purple
  ];
  if (!name) return colors[0];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const Addmembers = ({ cardId, cardName, boardId, closeModal, onMemberUpdate }) => {
  const [employees, setEmployees] = useState([]);
  const [addedMembers, setAddedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileView, setIsMobileView] = useState(isMobile());
  const Trackerbaseurl = process.env.REACT_APP_BACKEND_TRACKER_BASE_URL;

  useEffect(() => {
    const handleResize = () => setIsMobileView(isMobile());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await apiRequest(`${Trackerbaseurl}get-employees/`);
        if (response.success) {
          setEmployees(response.data);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAddedMembers = async () => {
      try {
        const response = await apiRequest(
          `${Trackerbaseurl}add_member_to_card/?cardId=${cardId}&boardId=${boardId}&cardName=${cardName}`
        );
        if (response.success) {
          setAddedMembers(response.data);
        }
      } catch (error) {
        console.error("Error fetching added members:", error);
      }
    };

    fetchEmployees();
    fetchAddedMembers();
  }, [cardId, boardId, cardName, Trackerbaseurl]);

  const handleSelect = async (employee) => {
    try {
      const result = await apiRequest(`${Trackerbaseurl}add_member_to_card/`, "POST", {
        cardId,
        employeeId: employee.employeeId,
        employeeName: employee.employeeName,
        department: employee.department,
      });

      if (!result.success) {
        toast.error(result.error || "Error adding member.");
      } else {
        setAddedMembers([...addedMembers, employee]);
        setEmployees(employees.filter((emp) => emp.employeeId !== employee.employeeId));
        if (onMemberUpdate) onMemberUpdate();
        toast.success("Member added successfully!");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Unexpected error occurred.");
    }
  };

  const handleRemove = async (employee) => {
    try {
      const result = await apiRequest(
        `${Trackerbaseurl}add_member_to_card/?cardId=${cardId}&employeeId=${employee.employeeId}`,
        "DELETE"
      );

      if (!result.success) {
        toast.error(result.error || "Failed to remove member");
      } else {
        setAddedMembers(addedMembers.filter((m) => m.employeeId !== employee.employeeId));
        setEmployees([...employees, employee]);
        if (onMemberUpdate) onMemberUpdate();
        toast.warn("Member removed successfully!");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Error removing member.");
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !addedMembers.some((member) => member.employeeId === employee.employeeId)
  );

  return (
    <ModalBackdrop isMobile={isMobileView} onClick={closeModal}>
      <ModalContainer isMobile={isMobileView} onClick={(e) => e.stopPropagation()}>
        <Header>
          <h2>Manage Members</h2>
          <CloseButton onClick={closeModal}>
            <FaTimes />
          </CloseButton>
        </Header>

        <SearchBox
          type="text"
          placeholder="Search employees to assign..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <ScrollArea>
          <SectionTitle>Assigned Members ({addedMembers.length})</SectionTitle>
          {addedMembers.length > 0 ? (
            addedMembers.map((member) => (
              <EmployeeCard key={member.employeeId}>
                <EmployeeInfo>
                  <AvatarCircle bgColor={getBackgroundColor(member.employeeName)}>
                    {member.employeeName ? member.employeeName.charAt(0).toUpperCase() : "U"}
                  </AvatarCircle>
                  <TextDetails>
                    <span className="name">{member.employeeName}</span>
                    <span className="sub">
                      <span>{member.department}</span>
                      <span>•</span>
                      <span>ID: {member.employeeId}</span>
                    </span>
                  </TextDetails>
                </EmployeeInfo>
                <ActionButton isDelete onClick={() => handleRemove(member)} title="Remove Member">
                  <FaTrashAlt size={12} />
                </ActionButton>
              </EmployeeCard>
            ))
          ) : (
            <EmptyMessage>No members assigned to this task yet.</EmptyMessage>
          )}

          <SectionTitle>Available Employees</SectionTitle>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <EmployeeCard key={employee.employeeId}>
                <EmployeeInfo>
                  <AvatarCircle bgColor={getBackgroundColor(employee.employeeName)}>
                    {employee.employeeName ? employee.employeeName.charAt(0).toUpperCase() : "U"}
                  </AvatarCircle>
                  <TextDetails>
                    <span className="name">{employee.employeeName}</span>
                    <span className="sub">
                      <span>{employee.department}</span>
                      <span>•</span>
                      <span>ID: {employee.employeeId}</span>
                    </span>
                  </TextDetails>
                </EmployeeInfo>
                <ActionButton onClick={() => handleSelect(employee)} title="Assign Member">
                  <FaPlus size={12} />
                </ActionButton>
              </EmployeeCard>
            ))
          ) : (
            <EmptyMessage>No available employees matching search.</EmptyMessage>
          )}
        </ScrollArea>
      </ModalContainer>
    </ModalBackdrop>
  );
};

const Addmembersbutton = ({ cardId, boardId, cardName, onMemberUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const role = localStorage.getItem("role");

  return (
    <div>
      {(role === "Admin" || role === "HOD") && (
        <TriggerButton onClick={openModal}>
          <MdOutlinePersonOutline size={18} />
          Members
        </TriggerButton>
      )}
      {showModal && (
        <Addmembers
          closeModal={closeModal}
          cardId={cardId}
          boardId={boardId}
          cardName={cardName}
          onMemberUpdate={onMemberUpdate}
        />
      )}
    </div>
  );
};

export default Addmembersbutton;