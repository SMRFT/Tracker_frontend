"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiSearch, FiUser, FiGrid, FiList, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import apiRequest from "./apiRequest";

// --- THEME CONSTANTS ---
const THEME = {
  gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  primaryColor: "var(--primary-accent)",
  secondaryColor: "var(--primary-hover)",
  textMain: "var(--text-main)",
  textLight: "var(--text-muted)",
  bg: "var(--bg-primary)",
  white: "var(--bg-secondary)",
  shadow: "0 10px 30px -10px rgba(99, 102, 241, 0.15)",
  cardShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
};

// --- STYLED COMPONENTS ---

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${THEME.bg};
  padding: 2rem;
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
`;

const ContentWrapper = styled(motion.div)`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  background: ${THEME.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: ${THEME.textLight};
  margin: 0.5rem 0 0 0;
  font-size: 0.95rem;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchBar = styled.div`
  position: relative;
  width: 280px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.8rem;
  border-radius: 50px;
  border: 2px solid var(--border-subtle);
  background-color: var(--bg-secondary);
  font-size: 0.95rem;
  color: var(--text-main);
  box-shadow: ${THEME.cardShadow};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${THEME.primaryColor};
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
  }

  &::placeholder {
    color: var(--text-light);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${THEME.primaryColor};
  font-size: 1.1rem;
`;

const ViewToggle = styled.div`
  display: flex;
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 4px;
  box-shadow: ${THEME.cardShadow};
  border: 1px solid var(--border-subtle);
`;

const ViewButton = styled(motion.button)`
  padding: 0.6rem 1rem;
  border: none;
  background: ${(props) => (props.active ? THEME.gradient : "transparent")};
  color: ${(props) => (props.active ? "white" : THEME.textLight)};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => (props.active ? "white" : THEME.primaryColor)};
  }
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: ${THEME.gradient};
  color: white;
  border: none;
  border-radius: 50px; // Modern pill button
  font-weight: 600;
  cursor: pointer;
  font-size: 0.95rem;
  box-shadow: ${THEME.shadow};
  border: 1px solid rgba(255,255,255,0.2);

  svg {
    stroke-width: 2.5;
  }
`;

// Modern Stats Cards
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: ${THEME.white};
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: ${THEME.cardShadow};
  border: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${THEME.gradient};
  }
`;

const StatNumber = styled.span`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${THEME.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
`;

const StatLabel = styled.span`
  font-size: 0.9rem;
  color: ${THEME.textLight};
  font-weight: 500;
  margin-top: 0.25rem;
`;

// Table Components
const TableContainer = styled(motion.div)`
  background: ${THEME.white};
  border-radius: 24px;
  box-shadow: ${THEME.shadow};
  overflow: hidden;
  border: 1px solid var(--border-subtle);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const TableHeader = styled.thead`
  background: var(--bg-secondary);
`;

const TableRow = styled(motion.tr)`
  background: var(--bg-secondary);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-primary); // Subtle slate-50 tint
    transform: scale(1.002);
  }
`;

const TableHeaderCell = styled.th`
  padding: 1.25rem 1.5rem;
  text-align: left;
  font-weight: 700;
  color: var(--text-muted);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid var(--border-subtle);
`;

const TableCell = styled.td`
  padding: 1.25rem 1.5rem;
  font-size: 0.95rem;
  color: ${THEME.textMain};
  vertical-align: middle;
  border-bottom: 1px solid var(--border-subtle);

  ${TableRow}:last-child & {
    border-bottom: none;
  }
`;

// Shared Avatar Style
const Avatar = styled.div`
  width: ${(props) => props.size || "40px"};
  height: ${(props) => props.size || "40px"};
  border-radius: 50%;
  background: ${(props) => props.bgColor || THEME.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.fontSize || "0.9rem"};
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 10px rgba(99, 102, 241, 0.25);
  border: 2px solid var(--bg-secondary);
`;

const EmployeeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const EmployeeName = styled.div`
  font-weight: 600;
  color: ${THEME.textMain};
`;

const Chip = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) => props.bg || "#edf2f7"};
  color: ${(props) => props.color || "#4a5568"};
`;

// Grid View Components
const CompactGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const GridCard = styled(motion.div)`
  background: var(--bg-secondary);
  border-radius: 24px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: ${THEME.cardShadow};
  border: 1px solid var(--border-subtle);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${THEME.shadow};
    border-color: var(--primary-accent);
  }
`;

const GridCardHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, var(--bg-primary) 100%);
  z-index: 0;
`;

const CardContent = styled.div`
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const GridName = styled.h3`
  font-weight: 700;
  color: ${THEME.textMain};
  font-size: 1.1rem;
  margin: 0.75rem 0 0.25rem 0;
`;

const GridRole = styled.p`
  font-size: 0.85rem;
  color: ${THEME.primaryColor};
  font-weight: 600;
  margin: 0 0 1rem 0;
`;

// Pagination
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2.5rem;
`;

const PaginationButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: ${(props) => (props.active ? THEME.gradient : "var(--bg-secondary)")};
  color: ${(props) => (props.active ? "white" : THEME.textMain)};
  border-radius: 50%; // Circle buttons
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: ${(props) => (props.active ? THEME.shadow : "0 2px 5px rgba(0,0,0,0.05)")};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--bg-primary);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-secondary);
  border-radius: 24px;
  box-shadow: ${THEME.cardShadow};
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);

  h3 {
    color: var(--text-main);
    margin: 1rem 0 0.5rem;
  }
`;

// --- MAIN COMPONENT ---

const Members = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewType, setViewType] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Reduced slightly for grid aesthetic

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
          employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.employeeId.toString().includes(searchTerm)
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
    setCurrentPage(1);
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

  // Pagination Logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handlePageChange = (page) => setCurrentPage(page);

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
          <FiChevronLeft />
        </PaginationButton>
        {pages}
        <PaginationButton
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <FiChevronRight />
        </PaginationButton>
      </PaginationContainer>
    );
  };

  const renderTableView = () => (
    <TableContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Table>
        <TableHeader>
          <tr>
            <TableHeaderCell>Team Member</TableHeaderCell>
            <TableHeaderCell>Employee ID</TableHeaderCell>
            <TableHeaderCell>Department</TableHeaderCell>
            <TableHeaderCell>Designation</TableHeaderCell>
          </tr>
        </TableHeader>
        <tbody>
          {currentEmployees.map((employee, index) => (
            <TableRow 
              key={employee.employeeId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <TableCell>
                <EmployeeInfo>
                  <Avatar>
                    {getInitials(employee.employeeName)}
                  </Avatar>
                  <EmployeeName>{employee.employeeName}</EmployeeName>
                </EmployeeInfo>
              </TableCell>
              <TableCell>
                <Chip bg="rgba(99, 102, 241, 0.08)" color="#6366f1">#{employee.employeeId}</Chip>
              </TableCell>
              <TableCell>{employee.department || "N/A"}</TableCell>
              <TableCell>
                 <Chip bg="var(--bg-primary)" color="var(--text-muted)">{employee.designation || "N/A"}</Chip>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );

  const renderGridView = () => (
    <CompactGrid
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {currentEmployees.map((employee, index) => (
        <GridCard
          key={employee.employeeId}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -5 }}
        >
          <GridCardHeader />
          <CardContent>
            <Avatar size="64px" fontSize="1.2rem" style={{ marginBottom: '1rem' }}>
              {getInitials(employee.employeeName)}
            </Avatar>
            <GridName>{employee.employeeName}</GridName>
            <GridRole>{employee.designation || "Team Member"}</GridRole>
            
            <Chip bg="rgba(99, 102, 241, 0.08)" color="#6366f1" style={{ marginTop: '0.5rem' }}>
              {employee.department || "General"}
            </Chip>
          </CardContent>
        </GridCard>
      ))}
    </CompactGrid>
  );

  return (
    <PageContainer>
      <ContentWrapper initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Header>
          <TitleGroup>
            <Title>Team Members</Title>
            <Subtitle>Manage your team and view their details</Subtitle>
          </TitleGroup>
          
          <HeaderActions>
            <SearchBar>
              <SearchIcon>
                <FiSearch />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>
            
            <ViewToggle>
              <ViewButton
                active={viewType === "table"}
                onClick={() => setViewType("table")}
                whileTap={{ scale: 0.95 }}
              >
                <FiList />
              </ViewButton>
              <ViewButton
                active={viewType === "grid"}
                onClick={() => setViewType("grid")}
                whileTap={{ scale: 0.95 }}
              >
                <FiGrid />
              </ViewButton>
            </ViewToggle>

            {/* <ActionButton
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(255, 154, 158, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRegisterClick}
            >
              <FiPlus />
              <span>Add Member</span>
            </ActionButton> */}
          </HeaderActions>
        </Header>

        <StatsGrid>
          <StatCard whileHover={{ y: -5 }}>
            <StatNumber>{employees.length}</StatNumber>
            <StatLabel>Total Members</StatLabel>
          </StatCard>
          <StatCard whileHover={{ y: -5 }}>
            <StatNumber>{filteredEmployees.length}</StatNumber>
            <StatLabel>Currently Visible</StatLabel>
          </StatCard>
          <StatCard whileHover={{ y: -5 }}>
            <StatNumber>{Math.ceil(filteredEmployees.length / itemsPerPage)}</StatNumber>
            <StatLabel>Total Pages</StatLabel>
          </StatCard>
        </StatsGrid>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              style={{ textAlign: "center", padding: "4rem", color: THEME.primaryColor }}
            >
              Loading...
            </motion.div>
          ) : filteredEmployees.length > 0 ? (
            <motion.div key="content">
              {viewType === "table" ? renderTableView() : renderGridView()}
              {totalPages > 1 && renderPagination()}
            </motion.div>
          ) : (
            <EmptyState>
              <FiUser size={64} style={{ color: "#cbd5e1", marginBottom: "1rem" }} />
              <h3>No members found</h3>
              <p>Try adjusting your search or add a new member to the team.</p>
            </EmptyState>
          )}
        </AnimatePresence>
      </ContentWrapper>
    </PageContainer>
  );
};

export default Members;