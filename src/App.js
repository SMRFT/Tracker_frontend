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

const Trackerbaseurl = process.env.REACT_APP_BACKEND_TRACKER_BASE_URL;
const BASE_PATH = process.env.PUBLIC_URL;

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

  return (
    <>
      {sidebarVisible && <Sidebar boards={boards} setBoards={addBoard} />}
      <ContentContainer sidebarVisible={sidebarVisible}>
        <Routes>
          <Route
            path="/"
            element={<Board boards={boards} addBoard={addBoard} />}
          />
          <Route
            path="/Board"
            element={<Board boards={boards} addBoard={addBoard} />}
          />
          <Route path="/SignOut" element={<SignOut />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Todolist" element={<Todolist />} />
          <Route path="/Members" element={<Members />} />
        </Routes>
      </ContentContainer>
    </>
  );
};

const App = () => {
  const [boards, setBoards] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeName, setEmployeeName] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("employeeId");
    const name = localStorage.getItem("employeeName");
    if (id && name) {
      setEmployeeId(id);
      setEmployeeName(name);
    }
  }, []);

  const fetchBoards = async () => {
    const result = await apiRequest(`${Trackerbaseurl}get-boards/`);
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
    }
  }, []);

  const addBoard = (newBoard) => {
    setBoards((prev) => [...prev, newBoard]);
  };

  return (
    <Router basename={BASE_PATH}>
      <AppContent boards={boards} addBoard={addBoard} />
    </Router>
  );
};

export default App;
