import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { FaTimes, FaSearch, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiRequest from "./apiRequest"; // Import the API helper
import { motion, AnimatePresence } from "framer-motion";
import DialogOverlay from "./ui/Overlay";
import LoadingSpinner from "./ui/Spinner";

const BoardContainer = styled.div`
  display: flex;
  background-color: var(--bg-primary);
  height: 100vh;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
`;

const MainContent = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  min-width: 0;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-top: 50px; /* Account for mobile menu button */
  }
`;

const MainHeader = styled.header`
  margin-bottom: 2.5rem;
  flex-shrink: 0;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const HeaderBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-weight: 800;
  font-size: 2rem;
  color: var(--text-main);
  letter-spacing: -0.02em;
`;

const SortFilter = styled.div`
  position: relative;
  
  select {
    appearance: none;
    background: var(--bg-secondary);
    border: 1px solid var(--border-subtle);
    padding: 0.625rem 1.25rem;
    padding-right: 2.5rem;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-muted);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:focus {
      outline: none;
      border-color: var(--primary-accent);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
    }

    &:hover {
      background: #fafafa;
      color: var(--text-main);
      border-color: #cbd5e1;
    }
  }

  &::after {
    content: "▼";
    position: absolute;
    right: 1.125rem;
    top: 50%;
    transform: translateY(-50%) scale(0.85);
    pointer-events: none;
    font-size: 0.65rem;
    color: var(--text-light);
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 0.375rem 0.875rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  width: 320px;

  &:focus-within {
    border-color: var(--primary-accent);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const SearchIcon = styled(FaSearch)`
  color: var(--text-light);
  margin-right: 0.5rem;
  font-size: 0.875rem;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  padding: 0.375rem;
  width: 100%;
  font-size: 0.875rem;
  color: var(--text-main);
  background: transparent;

  &::placeholder {
    color: var(--text-light);
  }
`;

const BoardsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  align-content: start;
  gap: 1.5rem;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 1.5rem;
  margin: 0 -0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border-subtle);
    border-radius: 99px;
  }
`;

const BoardCard = styled(motion.div)`
  height: 160px;
  background: ${(props) => props.bgColor || "linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)"};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem;
  color: white;
  border-radius: 16px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.05) 0%,
      rgba(0, 0, 0, 0.25) 100%
    );
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.15);
    &::before {
      opacity: 0.5;
    }
  }
`;

const BoardCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 1;
`;

const CreatorBadge = styled.div`
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
`;

const BoardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  word-break: break-word;
`;

const CreateNewBoardCard = styled.div`
  height: 160px;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px dashed var(--border-subtle);

  &:hover {
    background: var(--bg-primary);
    border-color: var(--primary-accent);
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  }
`;

const PlusIconContainer = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(79, 70, 229, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  color: var(--primary-accent);
  transition: all 0.2s ease;

  ${CreateNewBoardCard}:hover & {
    background: var(--primary-accent);
    color: white;
  }
`;

const CreateText = styled.span`
  color: var(--text-main);
  font-weight: 600;
  font-size: 0.9rem;
`;

const Dialog = styled(motion.div)`
  background: var(--bg-secondary);
  padding: 2.25rem;
  border-radius: 20px;
  width: 100%;
  max-width: 450px;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const DialogTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: 700;
  color: var(--text-main);
  font-size: 1.35rem;
  letter-spacing: -0.01em;
`;

const DialogInput = styled.input`
  width: 100%;
  padding: 0.8rem 1.1rem;
  margin-bottom: 1.5rem;
  border-radius: 10px;
  border: 1px solid var(--border-subtle);
  font-size: 0.9rem;
  color: var(--text-main);
  background: var(--bg-primary);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    outline: none;
    border-color: var(--primary-accent);
    background: white;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
`;

const PickerLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
`;

const GradientPickerContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const GradientOption = styled.div`
  aspect-ratio: 1.6;
  border: ${(props) => (props.selected ? "3px solid var(--primary-accent)" : "2px solid transparent")};
  cursor: pointer;
  background: ${(props) => props.gradient};
  border-radius: 8px;
  transition: all 0.2s;
  box-shadow: ${(props) => (props.selected ? "0 4px 10px rgba(79, 70, 229, 0.25)" : "none")};

  &:hover {
    transform: scale(1.06);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
  }
`;

const CancelButton = styled(Button)`
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);

  &:hover {
    background: var(--bg-primary);
    color: var(--text-main);
  }
`;

const CreateButton = styled(Button)`
  background: var(--primary-accent);
  color: white;
  border: none;

  &:hover {
    background: var(--primary-hover);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background: #cbd5e1;
    color: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const CloseIcon = styled(FaTimes)`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  cursor: pointer;
  color: var(--text-light);
  transition: all 0.2s;

  &:hover {
    color: var(--text-main);
  }
`;

const MessageContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  border-radius: 8px;
  padding: 8px 12px;
`;

const SuccessMessage = styled(MessageContainer)`
  color: var(--success);
  background: rgba(16, 185, 129, 0.08);
`;

const ErrorMessage = styled(MessageContainer)`
  color: var(--danger);
  background: rgba(239, 68, 68, 0.08);
`;

const GRADIENTS = [
  { id: 1, value: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)" },
  { id: 2, value: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)" },
  { id: 3, value: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
  { id: 4, value: "linear-gradient(135deg, #f59e0b 0%, #e11d48 100%)" },
  { id: 5, value: "linear-gradient(135deg, #3c1053 0%, #ad5389 100%)" },
  { id: 6, value: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)" },
  { id: 7, value: "linear-gradient(135deg, #2e0854 0%, #9b51e0 100%)" },
  { id: 8, value: "linear-gradient(135deg, #475569 0%, #0f172a 100%)" },
];

const Board = ({ boards, refreshBoards, boardsLoading }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [boardColor, setBoardColor] = useState(
    "linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)"
  );
  const [sortOrder, setSortOrder] = useState("A-Z");
  const [searchQuery, setSearchQuery] = useState("");
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeName, setEmployeeName] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [role, setRole] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const Trackerbaseurl = process.env.REACT_APP_BACKEND_TRACKER_BASE_URL;
  const navigate = useNavigate();

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

  const openDialog = () => {
    setIsDialogOpen(true);
    setMessage({ type: "", text: "" });
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setBoardName("");
    setBoardColor("linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)");
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

      if (result.success || (result.data && result.data.message)) {
        const successMessage =
          result.data?.message ||
          result.message ||
          "Board created successfully!";
        setMessage({ type: "success", text: successMessage });
        setBoardName("");
        setBoardColor("linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)");

        await refreshBoards();

        setTimeout(() => {
          closeDialog();
        }, 1200);
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

  const filteredAndSortedBoards = useMemo(() => {
    const filteredBoards = boards.filter(
      (board) =>
        board.boardName &&
        board.boardName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortOrder === "A-Z") {
      filteredBoards.sort((a, b) =>
        (a.boardName || "").localeCompare(b.boardName || "")
      );
    } else if (sortOrder === "Z-A") {
      filteredBoards.sort((a, b) =>
        (b.boardName || "").localeCompare(a.boardName || "")
      );
    }

    return filteredBoards;
  }, [boards, searchQuery, sortOrder]);

  const handleBoardClick = (board) => {
    navigate("/Todolist", {
      state: {
        boardId: board.boardId,
        boardColor: board.boardColor,
        employeeId: employeeId,
        employeeName: board.employeeName,
        boardName: board.boardName,
        created_by_name: board.created_by_name || board.employeeName || board.created_by,
        created_by: board.created_by,
      },
    });
  };

  return (
    <BoardContainer>
      <MainContent>
        <MainHeader>
          <HeaderTop>
            <HeaderTitle>Workspace Boards</HeaderTitle>
          </HeaderTop>
          <HeaderBottom>
            <HeaderLeft>
              <SortFilter>
                <select value={sortOrder} onChange={handleSortChange}>
                  <option value="A-Z">Sort Alphabetically A-Z</option>
                  <option value="Z-A">Sort Alphabetically Z-A</option>
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
          {boardsLoading ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "4rem 0",
              }}
            >
              <LoadingSpinner style={{ margin: "0 auto 12px" }} />
              <div style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Loading your boards...</div>
            </div>
          ) : (
            <>
              {filteredAndSortedBoards.map((board) => (
                <BoardCard
                  key={board.boardId}
                  bgColor={board.boardColor}
                  onClick={() => handleBoardClick(board)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <BoardCardHeader>
                    <CreatorBadge>
                      By {board.created_by_name || "Unknown"}
                    </CreatorBadge>
                  </BoardCardHeader>
                  <BoardTitle>{board.boardName}</BoardTitle>
                </BoardCard>
              ))}

              {(role === "Admin" || role === "HOD") && (
                <CreateNewBoardCard onClick={openDialog}>
                  <PlusIconContainer>
                    <FaPlus />
                  </PlusIconContainer>
                  <CreateText>Create New Board</CreateText>
                </CreateNewBoardCard>
              )}
            </>
          )}
        </BoardsSection>

        {message.type === "error" && !isDialogOpen && (
          <ErrorMessage style={{ maxWidth: "400px", margin: "24px auto 0" }}>
            {message.text}
          </ErrorMessage>
        )}

        <AnimatePresence>
          {isDialogOpen && (
            <DialogOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Dialog
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
              >
                <CloseIcon onClick={closeDialog} />
                <DialogTitle>Create New Board</DialogTitle>
                
                <DialogInput
                  type="text"
                  placeholder="e.g. Q3 Product Roadmap"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  disabled={isCreating}
                  autoFocus
                />
                
                <PickerLabel>Choose a theme color</PickerLabel>
                <GradientPickerContainer>
                  {GRADIENTS.map((gradient) => (
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
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {isCreating && <LoadingSpinner />}
                      <span>{isCreating ? "Creating..." : "Create Board"}</span>
                    </div>
                  </CreateButton>
                </ButtonContainer>

                {message.text && message.type && (
                  message.type === "success" ? (
                    <SuccessMessage>{message.text}</SuccessMessage>
                  ) : (
                    <ErrorMessage>{message.text}</ErrorMessage>
                  )
                )}
              </Dialog>
            </DialogOverlay>
          )}
        </AnimatePresence>
      </MainContent>
    </BoardContainer>
  );
};

export default Board;
