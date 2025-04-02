"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FiPlus, FiSearch, FiUser } from "react-icons/fi"

// Styled Components with modern design
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
`

const SearchBar = styled.div`
  position: relative;
  width: 300px;
  margin-right: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 1rem;
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border-radius: 12px;
  border: none;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
`

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(99, 102, 241, 0.25);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 6px 10px rgba(99, 102, 241, 0.3);
  }
`

const EmployeeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const EmployeeCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`

const CardHeader = styled.div`
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`

const CardContent = styled.div`
  padding: 1.5rem;
  position: relative;
`

const AvatarCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  position: absolute;
  top: -40px;
  left: 1.5rem;
  border: 4px solid white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

const EmployeeName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 2rem 0 0.5rem;
`

const EmployeeId = styled.p`
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`

const Members = () => {
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("https://tracker.shinovadatabase.in/get-employees/")
        const data = await response.json()
        setEmployees(data)
        setFilteredEmployees(data)
      } catch (error) {
        console.error("Error fetching employee data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = employees.filter(
        (employee) =>
          employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.employeeId.toString().includes(searchTerm),
      )
      setFilteredEmployees(filtered)
    } else {
      setFilteredEmployees(employees)
    }
  }, [searchTerm, employees])

  const handleRegisterClick = () => {
    navigate("/Register")
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <Title>Team Members</Title>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
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
            <ActionButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRegisterClick}>
              <FiPlus />
              Add Member
            </ActionButton>
          </div>
        </Header>

        {isLoading ? (
          <div>Loading members...</div>
        ) : filteredEmployees.length > 0 ? (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <EmployeeGrid>
              {filteredEmployees.map((employee) => (
                <EmployeeCard key={employee.employeeId} variants={itemVariants}>
                  <CardHeader />
                  <CardContent>
                    <AvatarCircle>{getInitials(employee.employeeName)}</AvatarCircle>
                    <EmployeeName>{employee.employeeName}</EmployeeName>
                    <EmployeeId>ID: {employee.employeeId}</EmployeeId>
                  </CardContent>
                </EmployeeCard>
              ))}
            </EmployeeGrid>
          </motion.div>
        ) : (
          <EmptyState>
            <FiUser size={48} style={{ color: "#a0aec0", margin: "0 auto 1rem" }} />
            <h3>No members found</h3>
            <p>Try adjusting your search or add new members</p>
          </EmptyState>
        )}
      </ContentWrapper>
    </PageContainer>
  )
}

export default Members

