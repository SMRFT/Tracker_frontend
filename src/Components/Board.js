import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SketchPicker } from 'react-color';
import { FaTimes, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const BoardContainer = styled.div`
    display: flex;

    height:100vh;
`;
const MainContent = styled.main`
    flex-grow: 1;
    padding: 20px;
`;
const MainHeader = styled.header`
    margin-bottom: 20px;
`;
const HeaderTop = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;
const HeaderBottom = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
`;
const HeaderTitle = styled.h1`
    margin: 0;
    margin-right: 0px;
    justify-content: center;
    align-items: center;
`;
const SortFilter = styled.div`
    display: flex;
    align-items: center; // Center the elements vertically
    background: #fff; // White background
    border: 1px solid #DFE1E6; // Border for better visibility
    border-radius: 4px; // Rounded corners
    padding: 5px 10px; // Added padding for aesthetics
    select {
        margin-right: 10px;
        padding: 5px;
        border: none; // Remove default border
        outline: none; // Remove outline on focus
        background: transparent; // Transparent background
        font-size: 16px; // Increased font size
        color: #555; // Change color
        cursor: pointer; // Pointer cursor
        &:focus {
            border-bottom: 2px solid #0079BF; // Underline on focus
        }
    }
`;
const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    background: #fff;
    border: 1px solid #DFE1E6;
    border-radius: 4px;
    padding: 5px;
`;
const SearchIcon = styled(FaSearch)`
    color: #aaa;
    margin-right: 10px;
`;
const SearchInput = styled.input`
    border: none;
    outline: none;
    padding: 5px;
    width: 200px;
`;
const BoardsSection = styled.section`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    flex-wrap: wrap;
`;
const BoardCard = styled.div`
    width: 200px;
    height: 100px;
    background: ${(props) => props.bgColor || 'linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)'};
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
`;
const CreateNewBoardCard = styled(BoardCard)`
    background: #EBECF0;
    color: black;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
        background: #DFE1E6;
    }
`;
const DialogOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Dialog = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    position: relative;
`;
const DialogTitle = styled.h2`
    margin-top: 0;
`;
const DialogInput = styled.input`
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 20px;
    border-radius: 4px;
    border: 1px solid #DFE1E6;
`;
const DialogButton = styled.button`
    padding: 10px 20px;
    background: #0079BF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background: #026AA7;
    }
`;
const CancelIcon = styled(FaTimes)`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    color: #aaa;
    &:hover {
        color: #000;
    }
`;

const SuccessMessage = styled.div`
    color: green;
    font-weight: bold;
`;

const GradientPickerContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
`;

const GradientOption = styled.div`
    width: 60px;
    height: 60px;
    margin: 5px;
    border: 2px solid transparent;
    cursor: pointer;
    background: ${(props) => props.gradient};
    border-radius: 4px;
    transition: border 0.2s;

    &:hover {
        border: 2px solid #0079BF;
    }

    ${(props) => props.selected && `
        border: 2px solid #0079BF;
    `}
`;

const Board = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [boardId, setBoardId] = useState('');
    const [boardName, setBoardName] = useState('');
    const [boardColor, setBoardColor] = useState('#0079BF');
    const [boards, setBoards] = useState([]);
    const [sortOrder, setSortOrder] = useState('A-Z');
    const [searchQuery, setSearchQuery] = useState('');
    const [employeeId, setEmployeeId] = useState(null);
    const [employeeName, setEmployeeName] = useState(null);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const id = localStorage.getItem('employeeId');
        const name = localStorage.getItem('employeeName');
        if (id && name) {
            setEmployeeId(id);
            setEmployeeName(name);
        }
    }, []);

    const navigate = useNavigate();
    const gradients = [
        { id: 1, name: 'Blue to Purple', value: 'linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)' },
        { id: 2, name: 'Red to Yellow', value: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)' },
        { id: 3, name: 'Green to Blue', value: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)' },
        { id: 4, name: 'Orange to Pink', value: 'linear-gradient(135deg, #FFB199 0%, #FFCC62 100%)' },
        // Add more gradients as needed
    ];
    
    const fetchBoards = async () => {
        if (!employeeId) return;
        try {
            const response = await fetch(`http://127.0.0.1:8000/get-boards/?employeeId=${employeeId}`);
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
        fetchBoards();
    }, [employeeId]);

    const openDialog = () => {
        setIsDialogOpen(true);
        setSuccess('');
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setBoardName('');
        setBoardColor('#0079BF');
    };

    const handleCreateBoard = async () => {
        if (boardName.trim()) {
            const newBoard = { boardName, boardColor, employeeId, employeeName, boardId };
            try {
                const response = await fetch('http://127.0.0.1:8000/boards/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newBoard),
                });
                if (response.ok) {
                    setSuccess('Board created successfully!');
                    setBoardName(''); // Clear board name input
                    setBoardColor('#0079BF'); // Reset color picker
                    
                    // Refresh boards list and close dialog
                    await fetchBoards(); // Refresh board list
                    setTimeout(() => {
                        closeDialog();
                        setSuccess(''); // Clear success message after dialog closes
                    }, 1500);
                } else {
                    const error = await response.json();
                    setSuccess(`Failed to create board: ${error.message || 'Unknown error'}`);
                }
            } catch (error) {
                setSuccess(`Error creating board: ${error.message}`);
            }
        } else {
            setSuccess('Board name cannot be empty');
        }
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const getFilteredAndSortedBoards = () => {
        let filteredBoards = boards.filter((board) =>
            board.boardName && board.boardName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        if (sortOrder === 'A-Z') {
            filteredBoards = filteredBoards.sort((a, b) => (a.boardName || '').localeCompare(b.boardName || ''));
        } else if (sortOrder === 'Z-A') {
            filteredBoards = filteredBoards.sort((a, b) => (b.boardName || '').localeCompare(a.boardName || ''));
        }
    
        return filteredBoards;
    };

    const handleBoardClick = (board) => {
        navigate('/Todolist', {
            state: {
                boardId: board.boardId,
                boardColor: board.boardColor,
                employeeId: employeeId,
                employeeName: board.employeeName,
                boardName: board.boardName
                
            }
        });
    };

    return (
        <BoardContainer>
            <Sidebar boards={boards} setBoards={setBoards}/>
            <MainContent>
                <MainHeader>
                <HeaderTitle>Boards</HeaderTitle>

                    <HeaderTop>
                    </HeaderTop>
                    <HeaderBottom>
                        <HeaderLeft>
                            <SortFilter>
                                <select value={sortOrder} onChange={handleSortChange}>
                                    <option value="A-Z">Alphabetically A-Z</option>
                                    <option value="Z-A">Alphabetically Z-A</option>
                                </select>
                            </SortFilter>
                        </HeaderLeft>
                        <SearchContainer>
                            <SearchIcon />
                            <SearchInput
                                type="text"
                                placeholder="Search boards..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </SearchContainer>
                    </HeaderBottom>
                </MainHeader>
                <BoardsSection>
                    {getFilteredAndSortedBoards().map((board) => (
                        <BoardCard
                            key={board.boardId}
                            bgColor={board.boardColor}
                            onClick={() => handleBoardClick(board)}
                        >
                            {board.boardName}
                        </BoardCard>
                    ))}
                    <CreateNewBoardCard onClick={openDialog}>
                        + Create new board
                    </CreateNewBoardCard>
                </BoardsSection>
                {isDialogOpen && (
    <DialogOverlay>
        <Dialog>
            <CancelIcon onClick={closeDialog} />
            <DialogTitle>Create New Board</DialogTitle>
            <DialogInput
                type="text"
                placeholder="Enter board name"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
            />
            <GradientPickerContainer>
                {gradients.map((gradient) => (
                    <GradientOption
                        key={gradient.id}
                        gradient={gradient.value}
                        selected={boardColor === gradient.value}
                        onClick={() => setBoardColor(gradient.value)}
                    />
                ))}
            </GradientPickerContainer>
            <DialogButton onClick={handleCreateBoard}>Create</DialogButton>
            {success && <SuccessMessage>{success}</SuccessMessage>}
        </Dialog>
    </DialogOverlay>
)}

            </MainContent>
        </BoardContainer>
    );
};

export default Board;