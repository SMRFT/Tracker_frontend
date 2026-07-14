import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./Components/Register";
import Board from "./Components/Board";
import Todolist from "./Components/Todolist";
import Sidebar from "./Components/Sidebar";
import SignOut from "./Components/SignOut";
import Notification from "./Components/Notification";
import { FiLogOut, FiX, FiSun, FiMoon } from "react-icons/fi";
import Members from "./Components/Members";
import styled from "styled-components";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "./Components/apiRequest";
import {
  startAutoDeadlineCheck,
  stopAutoDeadlineCheck,
  manualDeadlineCheck,
} from "./Components/autoDeadlineCheck";
import { ToastContainer } from "react-toastify";
import TaskDeadline from "./Components/TaskDeadline";
import FinishedTask from "./Components/FinishedTask";
import Deletedcards from "./Components/Deletedcards";

const Trackerbaseurl =
  process.env.REACT_APP_BACKEND_TRACKER_BASE_URL ;

const ContentContainer = styled.div`
  margin-left: ${({ sidebarVisible, isCollapsed }) => 
    sidebarVisible ? (isCollapsed ? "72px" : "270px") : "0"};
  margin-top: 0px;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
  background-color: var(--bg-primary);
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background-color: var(--bg-primary);
  color: var(--text-main);
  height: 60px;
  border-bottom: 1px solid var(--border-subtle);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    padding-left: 56px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  background: linear-gradient(135deg, var(--text-main) 0%, var(--text-muted) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const LogOutButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }
`;

const ThemeToggleBtn = styled.button`
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary-accent);
    background: rgba(99, 102, 241, 0.1);
  }
`;

const ModalOverlay = styled.div`
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
  animation: fadeIn 0.2s ease-in-out;
`;

const ConfirmModalContainer = styled.div`
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: slideIn 0.3s ease-out;
`;

const ConfirmModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-main);
  }
`;

const CloseButton = styled.button`
  background: var(--bg-primary);
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: all 0.2s;

  &:hover {
    background: var(--border-subtle);
    color: var(--text-main);
  }
`;

const ConfirmModalBody = styled.div`
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
`;

const ConfirmButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

const CancelButton = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background-color: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);

  &:hover {
    background-color: var(--bg-primary);
  }
`;

const ConfirmLogoutButton = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: #ef4444;
  border: none;
  color: white;

  &:hover {
    background: #dc2626;
  }
`;

const AppContent = ({ boards, addBoard }) => {
  const location = useLocation();
  const sidebarVisible = !["/Register"].includes(location.pathname);
  const [hasAdminPrivileges, setHasAdminPrivileges] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    const hasAdminAccess = () => {
      return role === "Admin";
    };
    setHasAdminPrivileges(hasAdminAccess());
  }, []);  

  const handleSignOut = () => {
    localStorage.removeItem("employeeId");
    localStorage.removeItem("employeeName");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
     <>
       {sidebarVisible && (
         <Sidebar 
           boards={boards} 
           setBoards={addBoard} 
           isCollapsed={isSidebarCollapsed} 
           setIsCollapsed={setIsSidebarCollapsed} 
         />
       )}
       <ContentContainer sidebarVisible={sidebarVisible} isCollapsed={isSidebarCollapsed}>
         {sidebarVisible && (
           <HeaderContainer>
             <HeaderLeft>
               <HeaderTitle>Shinova Tracker</HeaderTitle>
             </HeaderLeft>
             <HeaderRight>
               <SignOut isCollapsed={true} isHeader={true} />
               <ThemeToggleBtn onClick={toggleTheme} title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                 {isDarkMode ? <FiSun /> : <FiMoon />}
               </ThemeToggleBtn>
               <Notification />
               <LogOutButton onClick={() => setShowLogoutConfirm(true)} title="Log Out">
                 <FiLogOut />
               </LogOutButton>
             </HeaderRight>
           </HeaderContainer>
         )}
         <Routes>
           <Route
             path="/"
             element={<Board boards={boards} addBoard={addBoard} />}
           />
           <Route
             path="/Board"
             element={<Board boards={boards} addBoard={addBoard} />}
           />
           <Route path="/finished" element={<FinishedTask />} />
           <Route path="/deadlines" element={<TaskDeadline />} />
           <Route path="/SignOut" element={<SignOut />} />
           <Route path="/Register" element={<Register />} />
           <Route path="/Todolist" element={<Todolist />} />
           <Route path="/Members" element={<Members />} />
           <Route path="/Deletedcards" element={<Deletedcards />} />
         </Routes>
       </ContentContainer>

       {showLogoutConfirm && (
         <ModalOverlay onClick={() => setShowLogoutConfirm(false)}>
           <ConfirmModalContainer onClick={(e) => e.stopPropagation()}>
             <ConfirmModalHeader>
               <h3>Confirm Log Out</h3>
               <CloseButton onClick={() => setShowLogoutConfirm(false)}>
                 <FiX />
               </CloseButton>
             </ConfirmModalHeader>
             <ConfirmModalBody>
               Are you sure you want to log out of Shinova Tracker?
             </ConfirmModalBody>
             <ConfirmButtonGroup>
               <CancelButton onClick={() => setShowLogoutConfirm(false)}>Cancel</CancelButton>
               <ConfirmLogoutButton onClick={handleSignOut}>Log Out</ConfirmLogoutButton>
             </ConfirmButtonGroup>
           </ConfirmModalContainer>
         </ModalOverlay>
       )}
     </>
  );
};

const App = () => {
  const [boards, setBoards] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const fetchBoards = async () => {
    const currentRole = localStorage.getItem("role");
    const result = await apiRequest(`${Trackerbaseurl}get-boards/${currentRole}/`);
    if (result.success) {
      setBoards(Array.isArray(result.data) ? result.data : []);
    } else {
      console.error("Failed to fetch boards:", result.error);
      if (result.status === 401 || result.status === 403) {
        console.warn("Unauthorized access. Redirecting to login...");
        // window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchBoards();
      startAutoDeadlineCheck(); // Automatic checks start here
    }
    return () => stopAutoDeadlineCheck(); // Stop on component unmount
  }, []);

  const addBoard = (newBoard) => {
    setBoards((prev) => [...prev, newBoard]);
  };

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <AppContent boards={boards} addBoard={addBoard} />
      <ToastContainer 
  autoClose={2000} 
  closeOnClick 
  closeButton 
  hideProgressBar 
/>
    </Router>
  );
};

export default App;
