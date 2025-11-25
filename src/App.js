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
  margin-left: ${({ sidebarVisible }) => (sidebarVisible ? "270px" : "0")};
  margin-top: 0px;
  transition: margin-left 0.3s ease;
  @media (max-width: 768px) {
    margin-left: ${({ sidebarVisible }) => (sidebarVisible ? "180px" : "0")};
  }
  @media (max-width: 480px) {
    margin-left: 0;
  }
`;

const AppContent = ({ boards, addBoard }) => {
  const location = useLocation();
  const sidebarVisible = !["/Register"].includes(location.pathname);
  const [hasAdminPrivileges, setHasAdminPrivileges] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const hasAdminAccess = () => {
      return role === "Admin";
    };
    setHasAdminPrivileges(hasAdminAccess());
  }, []);  

  return (
    
     <>
       {sidebarVisible && <Sidebar boards={boards} setBoards={addBoard} />}
       <ContentContainer sidebarVisible={sidebarVisible}>
       
       {/* {hasAdminPrivileges && (
           <div style={{ margin: "10px 95%" }}>
             <button
               onClick={() => manualDeadlineCheck()}
               className="btn btn-warning"
             >
               📧
             </button>
          </div>
 )}  */}
      
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
    //</>
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
