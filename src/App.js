import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './Components/Register';
import Board from './Components/Board';
import Todolist from './Components/Todolist';
import Comment from './Components/Comment';
import Sidebar from './Components/Sidebar';

import styled from "styled-components";
import LogIn from './Components/Login';
import Homepage from './Components/Homepage';
import './App.css';
import SignOut from './Components/SignOut';
import Members from './Components/Members';
import "react-toastify/dist/ReactToastify.css";

const ContentContainer = styled.div`
    margin-left: ${({ sidebarVisible }) => (sidebarVisible ? '270px' : '0')}; /* Adjusted for sidebar width */
    margin-top: 0px; /* Fixed syntax for margin-bottom */
    transition: margin-left 0.3s ease;

    @media (max-width: 768px) {
        margin-left: ${({ sidebarVisible }) => (sidebarVisible ? '180px' : '0')}; /* Adjust for smaller sidebar width */
    }

    @media (max-width: 480px) {
        margin-left: 0; /* On very small screens, no margin for sidebar */
    }
`;

const AppContent = ({ boards, addBoard }) => {
    const location = useLocation();

    // Determine if the sidebar should be visible based on the current path
    const sidebarVisible = !['/', '/Login', '/Register'].includes(location.pathname);

    // Check if the current path is the Homepage
    const isHomepage = location.pathname === '/';

    return (
        <>
            {sidebarVisible && <Sidebar boards={boards} setBoards={addBoard} />}
            {isHomepage ? (
                <Routes>
                    <Route path="/" element={<Homepage />} />
                </Routes>
            ) : (
                <ContentContainer sidebarVisible={sidebarVisible}>
                    <Routes>
                        
                        <Route path="/Board" element={<Board boards={boards} addBoard={addBoard} />} />
                        <Route path="/SignOut" element={<SignOut />} />
                        <Route path="/Register" element={<Register />} />        
                        <Route path="/Login" element={<LogIn />} />
                        <Route path="/Todolist" element={<Todolist />} />
                        <Route path="/Members" element={<Members />} />
                    </Routes>
                </ContentContainer>
            )}
        </>
    );
};

const App = () => {
    const [boards, setBoards] = useState([]);
    const [employeeId, setEmployeeId] = useState(null);
    const [employeeName, setEmployeeName] = useState(null);

    useEffect(() => {
        const id = localStorage.getItem('employeeId');
        const name = localStorage.getItem('employeeName');
        console.log("Fetched employeeId:", id);
        console.log("Fetched employeeName:", name);
        if (id && name) {
            setEmployeeId(id);
            setEmployeeName(name);
        }
    }, []);

    const fetchBoards = async () => {
        if (!employeeId || !employeeName) {
            console.error('Employee ID or Name is missing');
            return;
        }

        try {
            const response = await fetch(
                `https://tracker.shinovadatabase.in/get-boards/?employeeId=${employeeId}`
            );

            if (response.ok) {
                const data = await response.json();
                setBoards(data);
            } else {
                const error = await response.json();
                console.error('Failed to fetch boards', error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (employeeId && employeeName) {
            fetchBoards();
        }
    }, [employeeId, employeeName]);

    const addBoard = (newBoard) => {
        const updatedBoards = [...boards, newBoard];
        setBoards(updatedBoards);
    };

    return (
        <Router>
            <AppContent boards={boards} addBoard={addBoard} />
        </Router>
    );
};

export default App;
