"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlus, FiSearch, FiUser, FiGrid, FiList } from "react-icons/fi";
import apiRequest from "./apiRequest";

// Styled Components with compact design
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1.5rem;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchBar = styled.div`
  position: relative;
  width: 300px;

  @media (max-width: 768px) {
    width: 250px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background-color: white;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
`;

const ViewToggle = styled.div`
  display: flex;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const ViewButton = styled.button`
  padding: 0.6rem 1rem;
  border: none;
  background: ${(props) => (props.active ? "#6366f1" : "white")};
  color: ${(props) => (props.active ? "white" : "#64748b")};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.active ? "#5b21b6" : "#f8fafc")};
  }
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }
`;

const StatsBar = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const StatItem = styled.div`
  text-align: center;

  .number {
    font-size: 1.5rem;
    font-weight: 700;
    color: #6366f1;
    margin: 0;
  }

  .label {
    font-size: 0.8rem;
    color: #64748b;
    margin: 0;
  }
`;

// Table View Components
const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const TableRow = styled.tr`
  &:hover {
    background: #f8fafc;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f1f5f9;
  }
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableCell = styled.td`
  padding: 0.8rem 1rem;
  font-size: 0.9rem;
  color: #374151;
  vertical-align: middle;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
`;

const EmployeeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const EmployeeName = styled.div`
  font-weight: 600;
  color: #1e293b;
`;

const EmployeeId = styled.div`
  font-size: 0.8rem;
  color: #64748b;
  font-family: monospace;
`;

// Grid View Components (Compact)
const CompactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
`;

const CompactCard = styled(motion.div)`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: #6366f1;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
  }
`;

const CompactAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
`;

const CompactName = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const CompactId = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  font-family: monospace;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  background: ${(props) => (props.active ? "#6366f1" : "white")};
  color: ${(props) => (props.active ? "white" : "#374151")};
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${(props) => (props.active ? "#5b21b6" : "#f8fafc")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Members = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewType, setViewType] = useState("table"); // "table" or "grid"
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const navigate = useNavigate();
  const Trackerbaseurl = process.env.REACT_APP_BACKEND_TRACKER_BASE_URL;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest(`${Trackerbaseurl}get-employees/`);

        if (response.success) {
          setEmployees(response.data);
          setFilteredEmployees(response.data);
        } else {
          console.error("API Error:", response.error);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [Trackerbaseurl]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = employees.filter(
        (employee) =>
          employee.employeeName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          employee.employeeId.toString().includes(searchTerm)
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, employees]);

  const handleRegisterClick = () => {
    window.location.href = "https://test.shinova.in/global";
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationButton
          key={i}
          active={currentPage === i}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PaginationButton>
      );
    }

    return (
      <PaginationContainer>
        <PaginationButton
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </PaginationButton>
        {pages}
        <PaginationButton
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </PaginationButton>
        <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
          Showing {startIndex + 1}-
          {Math.min(endIndex, filteredEmployees.length)} of{" "}
          {filteredEmployees.length}
        </span>
      </PaginationContainer>
    );
  };

  const renderTableView = () => (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Employee</TableHeaderCell>
            <TableHeaderCell>ID</TableHeaderCell>
            <TableHeaderCell>Department</TableHeaderCell>
            <TableHeaderCell>Designation</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {currentEmployees.map((employee) => (
            <TableRow key={employee.employeeId}>
              <TableCell>
                <EmployeeInfo>
                  <Avatar>{getInitials(employee.employeeName)}</Avatar>
                  <EmployeeName>{employee.employeeName}</EmployeeName>
                </EmployeeInfo>
              </TableCell>
              <TableCell>
                <EmployeeId>{employee.employeeId}</EmployeeId>
              </TableCell>
              <TableCell>{employee.department || "N/A"}</TableCell>
              <TableCell>{employee.designation || "N/A"}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );

  const renderGridView = () => (
    <CompactGrid>
      {currentEmployees.map((employee) => (
        <CompactCard key={employee.employeeId}>
          <CompactAvatar>{getInitials(employee.employeeName)}</CompactAvatar>
          <CompactName>{employee.employeeName}</CompactName>
          <CompactId>{employee.employeeId}</CompactId>
          <CompactId>{employee.department}</CompactId>
          <CompactId>{employee.designation}</CompactId>
        </CompactCard>
      ))}
    </CompactGrid>
  );

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <Title>Team Members</Title>
          <HeaderActions>
            <SearchBar>
              <SearchIcon>
                <FiSearch />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>
            <ViewToggle>
              <ViewButton
                active={viewType === "table"}
                onClick={() => setViewType("table")}
              >
                <FiList /> Table
              </ViewButton>
              <ViewButton
                active={viewType === "grid"}
                onClick={() => setViewType("grid")}
              >
                <FiGrid /> Grid
              </ViewButton>
            </ViewToggle>
            <ActionButton
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegisterClick}
            >
              <FiPlus />
              Add Member
            </ActionButton>
          </HeaderActions>
        </Header>

        <StatsBar>
          <StatItem>
            <p className="number">{employees.length}</p>
            <p className="label">Total Members</p>
          </StatItem>
          <StatItem>
            <p className="number">{filteredEmployees.length}</p>
            <p className="label">Filtered</p>
          </StatItem>
          <StatItem>
            <p className="number">
              {Math.ceil(filteredEmployees.length / itemsPerPage)}
            </p>
            <p className="label">Pages</p>
          </StatItem>
        </StatsBar>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            Loading members...
          </div>
        ) : filteredEmployees.length > 0 ? (
          <>
            {viewType === "table" ? renderTableView() : renderGridView()}
            {totalPages > 1 && renderPagination()}
          </>
        ) : (
          <EmptyState>
            <FiUser
              size={48}
              style={{ color: "#a0aec0", margin: "0 auto 1rem" }}
            />
            <h3>No members found</h3>
            <p>Try adjusting your search or add new members</p>
          </EmptyState>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default Members;
