import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaTimes, FaSearch, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiRequest from "./apiRequest"; // Import the API helper

// Modern styled components with more subtle shadows, rounded corners, and cleaner spacing
const BoardContainer = styled.div`
  display: flex;
  background-color: #f7f9fc;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding: 2rem;
  transition: all 0.3s ease;
`;

const MainHeader = styled.header`
  margin-bottom: 2rem;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const HeaderBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-weight: 700;
  font-size: 2rem;
  color: #1a202c;
  letter-spacing: -0.5px;
`;

const SortFilter = styled.div`
  position: relative;
  select {
    appearance: none;
    background: white;
    border: none;
    padding: 0.75rem 1rem;
    padding-right: 2.5rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4a5568;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: all 0.2s;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.5);
    }

    &:hover {
      background: #f8fafc;
    }
  }

  &::after {
    content: "▼";
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: 0.75rem;
    color: #718096;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;

  &:focus-within {
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.5);
  }
`;

const SearchIcon = styled(FaSearch)`
  color: #a0aec0;
  margin-right: 0.5rem;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  padding: 0.5rem;
  width: 16rem;
  font-size: 0.875rem;
  color: #4a5568;

  &::placeholder {
    color: #a0aec0;
  }
`;

const BoardsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const BoardCard = styled.div`
  height: 140px;
  background: ${(props) =>
    props.bgColor || "linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)"};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 600;
  border-radius: 0.75rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 60%,
      rgba(0, 0, 0, 0.3) 100%
    );
    pointer-events: none;
  }
`;

const BoardTitle = styled.span`
  font-size: 1.125rem;
  text-align: center;
  padding: 0 1rem;
  z-index: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const CreateNewBoardCard = styled.div`
  height: 140px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.75rem;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px dashed #e2e8f0;

  &:hover {
    background: #f8fafc;
    transform: translateY(-3px);
  }
`;

const PlusIcon = styled(FaPlus)`
  color: #4299e1;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const CreateText = styled.span`
  color: #4a5568;
  font-weight: 500;
  font-size: 0.875rem;
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
  z-index: 50;
  backdrop-filter: blur(2px);
`;

const Dialog = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  width: 28rem;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DialogTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  font-size: 1.25rem;
`;

const DialogInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.25);
  }
`;

const GradientPickerContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const GradientOption = styled.div`
  aspect-ratio: 1;
  border: ${(props) =>
    props.selected ? "2px solid #4299e1" : "2px solid transparent"};
  cursor: pointer;
  background: ${(props) => props.gradient};
  border-radius: 0.5rem;
  transition: all 0.2s;
  box-shadow: ${(props) =>
    props.selected ? "0 0 0 2px rgba(66, 153, 225, 0.3)" : "none"};

  &:hover {
    transform: scale(1.05);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
  }
`;

const CancelButton = styled(Button)`
  background: white;
  color: #4a5568;
  border: 1px solid #e2e8f0;

  &:hover {
    background: #f8fafc;
  }
`;

const CreateButton = styled(Button)`
  background: #4299e1;
  color: white;
  border: none;

  &:hover {
    background: #3182ce;
  }

  &:active {
    background: #2b6cb0;
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }
`;

const CloseIcon = styled(FaTimes)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  color: #cbd5e0;
  transition: all 0.2s;

  &:hover {
    color: #4a5568;
  }
`;

const MessageContainer = styled.div`
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 0.875rem;
`;

const SuccessMessage = styled(MessageContainer)`
  color: #38a169;
`;

const ErrorMessage = styled(MessageContainer)`
  color: #e53e3e;
`;

const LoadingSpinner = styled.div`
  border: 2px solid #e2e8f0;
  border-top: 2px solid #4299e1;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Board = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [boardColor, setBoardColor] = useState(
    "linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)"
  );
  const [boards, setBoards] = useState([]);
  const [sortOrder, setSortOrder] = useState("A-Z");
  const [searchQuery, setSearchQuery] = useState("");
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeName, setEmployeeName] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const Trackerbaseurl = process.env.REACT_APP_BACKEND_TRACKER_BASE_URL;
  const navigate = useNavigate();

  const gradients = [
    { id: 1, value: "linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)" },
    { id: 2, value: "linear-gradient(135deg, #159957 0%, #155799 100%)" },
    { id: 3, value: "linear-gradient(135deg, #616161 0%, #9bc5c3 100%)" },
    { id: 4, value: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)" },
    { id: 5, value: "linear-gradient(135deg, #3c1053 0%, #ad5389 100%)" },
    { id: 6, value: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)" },
    { id: 7, value: "linear-gradient(135deg, #4389A2 0%, #5C258D 100%)" },
    { id: 8, value: "linear-gradient(135deg, #36D1DC 0%, #5B86E5 100%)" },
  ];

  useEffect(() => {
    const id = localStorage.getItem("employeeId");
    const name = localStorage.getItem("employeeName");
    const role = localStorage.getItem("role");

    if (id && name && role) {
      setEmployeeId(id);
      setEmployeeName(name);
      setRole(role);
    }
  }, []);

  const fetchBoards = async () => {
    setIsLoading(true);
    try {
      const role = localStorage.getItem("role");

      const result = await apiRequest(
        `${Trackerbaseurl}get-boards/${role}/`, // FIXED: path param, not query
        "GET"
      );

      if (result.success) {
        setBoards(Array.isArray(result.data) ? result.data : []);
        setMessage({ type: "", text: "" });
      } else {
        console.error("Failed to fetch boards:", result.error);
        setMessage({ type: "error", text: result.error });
        setBoards([]);
      }
    } catch (error) {
      console.error("Error fetching boards:", error);
      setMessage({ type: "error", text: "Failed to load boards" });
      setBoards([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId && role) {
      fetchBoards();
    }
  }, [employeeId, role]);

  const openDialog = () => {
    setIsDialogOpen(true);
    setMessage({ type: "", text: "" });
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setBoardName("");
    setBoardColor("linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)");
    setMessage({ type: "", text: "" });
  };

  const handleCreateBoard = async () => {
    if (!boardName.trim()) {
      setMessage({ type: "error", text: "Board name cannot be empty" });
      return;
    }

    setIsCreating(true);
    setMessage({ type: "", text: "" });

    try {
      const newBoard = {
        boardName: boardName.trim(),
        boardColor,
        is_active: true,
      };

      const result = await apiRequest(
        `${Trackerbaseurl}boards/`,
        "POST",
        newBoard
      );

      console.log("API Result:", result); // Debug log

      // Check if the request was successful
      if (result.success || (result.data && result.data.message)) {
        const successMessage =
          result.data?.message ||
          result.message ||
          "Board created successfully!";
        setMessage({ type: "success", text: successMessage });
        setBoardName("");
        setBoardColor("linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)");

        await fetchBoards();

        setTimeout(() => {
          closeDialog();
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: result.error || result.message || "Failed to create board",
        });
      }
    } catch (error) {
      console.error("Error creating board:", error);
      setMessage({ type: "error", text: "Error creating board" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getFilteredAndSortedBoards = () => {
    let filteredBoards = boards.filter(
      (board) =>
        board.boardName &&
        board.boardName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortOrder === "A-Z") {
      filteredBoards = filteredBoards.sort((a, b) =>
        (a.boardName || "").localeCompare(b.boardName || "")
      );
    } else if (sortOrder === "Z-A") {
      filteredBoards = filteredBoards.sort((a, b) =>
        (b.boardName || "").localeCompare(a.boardName || "")
      );
    }

    return filteredBoards;
  };

  const handleBoardClick = (board) => {
    navigate("/Todolist", {
      state: {
        boardId: board.boardId,
        boardColor: board.boardColor,
        employeeId: employeeId,
        employeeName: board.employeeName,
        boardName: board.boardName,
      },
    });
  };

  return (
    <BoardContainer>
      <MainContent>
        <MainHeader>
          <HeaderTitle>Boards</HeaderTitle>
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
          {isLoading ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "2rem",
              }}
            >
              <LoadingSpinner style={{ margin: "0 auto" }} />
              <div>Loading boards...</div>
            </div>
          ) : (
            <>
             {getFilteredAndSortedBoards().map((board) => (
  <BoardCard
    key={board.boardId}
    bgColor={board.boardColor}
    onClick={() => handleBoardClick(board)}
  >
    <div style={{ textAlign: "center", zIndex: 1 }}>
      <BoardTitle>{board.boardName}</BoardTitle>
      {board.created_by_name && (
        <div
          style={{
            fontSize: "0.85rem",
            marginTop: "0.4rem",
            color: "rgba(255, 255, 255, 0.85)",
            fontWeight: 400,
          }}
        >
          Created by {board.created_by_name}
        </div>
      )}
    </div>
  </BoardCard>
))}

              {(role === "Admin" || role === "HOD") && (
                <CreateNewBoardCard onClick={openDialog}>
                  <PlusIcon />
                  <CreateText>Create New Board</CreateText>
                </CreateNewBoardCard>
              )}
            </>
          )}
        </BoardsSection>

        {message.type === "error" && !isDialogOpen && (
          <ErrorMessage>{message.text}</ErrorMessage>
        )}

        {isDialogOpen && (
          <DialogOverlay>
            <Dialog>
              <CloseIcon onClick={closeDialog} />
              <DialogTitle>Create New Board</DialogTitle>
              <DialogInput
                type="text"
                placeholder="Enter board name"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                disabled={isCreating}
              />
              <GradientPickerContainer>
                {gradients.map((gradient) => (
                  <GradientOption
                    key={gradient.id}
                    gradient={gradient.value}
                    selected={boardColor === gradient.value}
                    onClick={() => !isCreating && setBoardColor(gradient.value)}
                  />
                ))}
              </GradientPickerContainer>
              <ButtonContainer>
                <CancelButton onClick={closeDialog} disabled={isCreating}>
                  Cancel
                </CancelButton>
                <CreateButton
                  onClick={handleCreateBoard}
                  disabled={isCreating || !boardName.trim()}
                >
                  {isCreating && <LoadingSpinner />}
                  {isCreating ? "Creating..." : "Create Board"}
                </CreateButton>
              </ButtonContainer>
              {message.text &&
                (message.type === "success" ? (
                  <SuccessMessage>{message.text}</SuccessMessage>
                ) : (
                  <ErrorMessage>{message.text}</ErrorMessage>
                ))}
            </Dialog>
          </DialogOverlay>
        )}
      </MainContent>
    </BoardContainer>
  );
};

export default Board;
