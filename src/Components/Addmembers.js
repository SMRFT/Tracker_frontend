import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaPlusCircle, FaTrashAlt, FaTimes } from "react-icons/fa";
import { MdOutlinePersonOutline } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "./apiRequest";

// Detect if device is mobile
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth <= 768;
};

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
  padding: ${(props) => (props.isMobile ? "0" : "20px")};
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: ${(props) => (props.isMobile ? "15px" : "20px")};
  border-radius: ${(props) => (props.isMobile ? "0" : "8px")};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: ${(props) => (props.isMobile ? "100%" : "450px")};
  height: ${(props) => (props.isMobile ? "100vh" : "auto")};
  max-height: ${(props) => (props.isMobile ? "100vh" : "90vh")};
  overflow-y: auto;
  z-index: 1001;

  @media (max-width: 768px) {
    width: 100%;
    height: 100vh;
    border-radius: 0;
    max-height: 100vh;
  }
`;

const MembersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${(props) => (props.isMobile ? "10px" : "20px")};
  position: relative;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const EmployeeCard = styled.div`
  background-color: #f0f0f0;
  color: black;
  border-radius: 8px;
  padding: ${(props) => (props.isMobile ? "12px" : "10px 20px")};
  margin: ${(props) => (props.isMobile ? "8px 0" : "10px 0")};
  width: ${(props) => (props.isMobile ? "100%" : "400px")};
  max-width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 12px 10px;
    margin: 8px 0;
    width: 100%;
  }
`;

const EmployeeCardContent = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  flex-direction: ${(props) => (props.isMobile ? "column" : "row")};
  gap: ${(props) => (props.isMobile ? "8px" : "0")};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const EmployeeInfo = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-wrap: ${(props) => (props.isMobile ? "wrap" : "nowrap")};
  gap: ${(props) => (props.isMobile ? "8px" : "0")};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const EmployeeName = styled.div`
  flex: ${(props) => (props.isMobile ? "1" : "2")};
  font-weight: bold;
  font-size: ${(props) => (props.isMobile ? "1rem" : "inherit")};
  word-break: break-word;

  @media (max-width: 768px) {
    width: 100%;
    font-size: 1rem;
  }
`;

const DepartmentText = styled.div`
  flex: ${(props) => (props.isMobile ? "1" : "2")};
  text-align: ${(props) => (props.isMobile ? "left" : "center")};
  color: #555;
  font-size: ${(props) => (props.isMobile ? "0.85rem" : "0.9rem")};

  @media (max-width: 768px) {
    width: 100%;
    text-align: left;
    font-size: 0.85rem;
  }
`;

const EmployeeId = styled.div`
  flex: ${(props) => (props.isMobile ? "1" : "1")};
  text-align: ${(props) => (props.isMobile ? "left" : "center")};
  font-size: ${(props) => (props.isMobile ? "0.85rem" : "inherit")};
  color: #666;

  @media (max-width: 768px) {
    width: 100%;
    text-align: left;
    font-size: 0.85rem;
  }
`;

const ActionButtonContainer = styled.div`
  flex: ${(props) => (props.isMobile ? "1" : "0.5")};
  text-align: center;
  display: flex;
  justify-content: ${(props) => (props.isMobile ? "flex-end" : "center")};
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
    margin-top: 5px;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${(props) => (props.delete ? "red" : "green")};
  font-size: ${(props) => (props.isMobile ? "1.5em" : "1.2em")};
  padding: ${(props) => (props.isMobile ? "8px" : "4px")};
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    font-size: 1.5em;
    padding: 8px;
  }
`;

const SearchBox = styled.input`
  padding: ${(props) => (props.isMobile ? "12px" : "8px")};
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: ${(props) => (props.isMobile ? "100%" : "300px")};
  font-size: ${(props) => (props.isMobile ? "16px" : "14px")};

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 16px;
    max-width: 100%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${(props) => (props.isMobile ? "15px" : "10px")};
  right: ${(props) => (props.isMobile ? "15px" : "10px")};
  background: ${(props) => (props.isMobile ? "rgba(255,255,255,0.9)" : "none")};
  border: none;
  cursor: pointer;
  color: ${(props) => (props.isMobile ? "red" : "#ccc")};
  font-size: ${(props) => (props.isMobile ? "2em" : "1.5em")};
  z-index: 10;
  border-radius: ${(props) => (props.isMobile ? "50%" : "0")};
  width: ${(props) => (props.isMobile ? "40px" : "auto")};
  height: ${(props) => (props.isMobile ? "40px" : "auto")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: ${(props) => (props.isMobile ? "darkred" : "black")};
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
    font-size: 2em;
    background: rgba(255, 255, 255, 0.9);
    color: red;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
`;

const Button = styled.button`
  margin-top: 15px;
  padding: ${(props) => (props.isMobile ? "12px 20px" : "10px 20px")};
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  width: ${(props) => (props.isMobile ? "100%" : "150px")};
  cursor: pointer;
  font-size: ${(props) => (props.isMobile ? "1.1rem" : "1rem")};
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  float: ${(props) => (props.isMobile ? "none" : "right")};
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 20px;
    font-size: 1.1rem;
    float: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => (props.isMobile ? "1.3rem" : "1.5rem")};
  margin: ${(props) => (props.isMobile ? "15px 0 10px" : "20px 0 10px")};
  color: #333;
  width: 100%;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin: 15px 0 10px;
  }
`;

const EmptyMessage = styled.p`
  color: #666;
  font-size: ${(props) => (props.isMobile ? "0.95rem" : "1rem")};
  text-align: center;
  padding: ${(props) => (props.isMobile ? "15px" : "10px")};

  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 15px;
  }
`;

const Addmembers = ({ cardId, cardName, boardId, closeModal, onMemberUpdate }) => {
  const [employees, setEmployees] = useState([]);
  const [addedMembers, setAddedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileView, setIsMobileView] = useState(isMobile());
  const role = localStorage.getItem("role");
  const Trackerbaseurl = process.env.REACT_APP_BACKEND_TRACKER_BASE_URL;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(isMobile());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await apiRequest(`${Trackerbaseurl}get-employees/`);

        if (response.success) {
          setEmployees(response.data);
        } else {
          console.error("API Error:", response.error);
          setError(response.error || "Error fetching employee data");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Error fetching employee data");
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
        } else {
          console.error("API Error:", response.error);
        }
      } catch (error) {
        console.error("Error fetching added members:", error);
      }
    };

    fetchEmployees();
    fetchAddedMembers();
  }, [cardId, boardId, cardName]);

  const handleSelect = async (employee) => {
    setLoading(true);
    try {
      const result = await apiRequest(`${Trackerbaseurl}add_member_to_card/`, "POST", {
        cardId,
        employeeId: employee.employeeId,
        employeeName: employee.employeeName,
        department: employee.department,
      });

      if (!result.success) {
        toast.error(result.error || "Error adding member.", {
          position: isMobileView ? "top-center" : "top-right",
        });
      } else {
        setAddedMembers([...addedMembers, employee]);
        setEmployees(employees.filter((emp) => emp.employeeId !== employee.employeeId));

        if (onMemberUpdate) onMemberUpdate();

        const successMessage = result.data?.message || "Member added successfully!";
        toast.success(successMessage, {
          position: isMobileView ? "top-center" : "top-right",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Unexpected error occurred.", {
        position: isMobileView ? "top-center" : "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (employee) => {
    try {
      const result = await apiRequest(
        `${Trackerbaseurl}add_member_to_card/?cardId=${cardId}&employeeId=${employee.employeeId}`,
        "DELETE"
      );

      if (!result.success) {
        toast.error(result.error || "Failed to remove member", {
          position: isMobileView ? "top-center" : "top-right",
        });
      } else {
        setAddedMembers(addedMembers.filter((m) => m.employeeId !== employee.employeeId));
        setEmployees([...employees, employee]);

        if (onMemberUpdate) onMemberUpdate();

        toast.warn("Member removed successfully!", {
          position: isMobileView ? "top-center" : "top-right",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Error removing member.", {
        position: isMobileView ? "top-center" : "top-right",
      });
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !addedMembers.some((member) => member.employeeId === employee.employeeId)
  );

  return (
    <ModalBackdrop isMobile={isMobileView}>
      <ModalContainer isMobile={isMobileView}>
        <MembersContainer isMobile={isMobileView}>
          <CloseButton isMobile={isMobileView} onClick={closeModal}>
            <FaTimes />
          </CloseButton>
          <SectionTitle isMobile={isMobileView}>Members</SectionTitle>
          <SearchBox
            isMobile={isMobileView}
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <EmployeeCard key={employee.employeeId} isMobile={isMobileView}>
                <EmployeeCardContent isMobile={isMobileView}>
                  <EmployeeInfo isMobile={isMobileView}>
                    <EmployeeName isMobile={isMobileView}>
                      {employee.employeeName}
                    </EmployeeName>
                    <DepartmentText isMobile={isMobileView}>
                      {employee.department}
                    </DepartmentText>
                    <EmployeeId isMobile={isMobileView}>
                      ID: {employee.employeeId}
                    </EmployeeId>
                  </EmployeeInfo>
                  <ActionButtonContainer isMobile={isMobileView}>
                    <IconButton
                      isMobile={isMobileView}
                      onClick={() => handleSelect(employee)}
                    >
                      <FaPlusCircle />
                    </IconButton>
                  </ActionButtonContainer>
                </EmployeeCardContent>
              </EmployeeCard>
            ))
          ) : (
            <EmptyMessage isMobile={isMobileView}>No employees found.</EmptyMessage>
          )}

          <SectionTitle isMobile={isMobileView}>Added Members</SectionTitle>
          {addedMembers.length > 0 ? (
            addedMembers.map((member) => (
              <EmployeeCard key={member.employeeId} isMobile={isMobileView}>
                <EmployeeCardContent isMobile={isMobileView}>
                  <EmployeeInfo isMobile={isMobileView}>
                    <EmployeeName isMobile={isMobileView}>
                      {member.employeeName}
                    </EmployeeName>
                    <DepartmentText isMobile={isMobileView}>
                      {member.department}
                    </DepartmentText>
                    <EmployeeId isMobile={isMobileView}>
                      ID: {member.employeeId}
                    </EmployeeId>
                  </EmployeeInfo>
                  <ActionButtonContainer isMobile={isMobileView}>
                    <IconButton
                      isMobile={isMobileView}
                      delete
                      onClick={() => handleRemove(member)}
                    >
                      <FaTrashAlt />
                    </IconButton>
                  </ActionButtonContainer>
                </EmployeeCardContent>
              </EmployeeCard>
            ))
          ) : (
            <EmptyMessage isMobile={isMobileView}>No members added yet.</EmptyMessage>
          )}
        </MembersContainer>
      </ModalContainer>
    </ModalBackdrop>
  );
};

const Addmembersbutton = ({ cardId, boardId, cardName, onMemberUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [isMobileView, setIsMobileView] = useState(isMobile());
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const role = localStorage.getItem("role");

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(isMobile());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {(role === "Admin" || role === "HOD") && (
        <Button isMobile={isMobileView} onClick={openModal}>
          <MdOutlinePersonOutline style={{ marginRight: "8px", fontSize: "1.2rem" }} />
          Member
        </Button>
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