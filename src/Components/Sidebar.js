import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faTimes } from "@fortawesome/free-solid-svg-icons";
import DeleteBoardModal from "./DeleteBoardModal";
import EditBoardModal from "./EditBoardModal";
import SignOut from "./SignOut";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "./apiRequest";

// Detect if device is mobile
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth <= 768;
};

const SidebarContainer = styled.div`
  width: ${(props) => (props.isMobile ? "85%" : "290px")};
  max-width: ${(props) => (props.isMobile ? "320px" : "290px")};
  background-color: ${(props) =>
    props.bgColor || "linear-gradient(135deg, #ff9a9e, #fad0c4)"};
  padding: ${(props) => (props.isMobile ? "20px 15px" : "20px")};
  height: 100vh;
  position: fixed;
  color: white;
  top: 0;
  left: 0;
  box-shadow: ${(props) =>
    props.isMobile
      ? "2px 0 10px rgba(0, 0, 0, 0.3)"
      : "1px 0 2px rgba(0, 0, 0, 0.5)"};
  transition: transform 0.3s ease, background-color 0.3s ease;
  z-index: 1000;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    transform: ${(props) =>
      props.isSidebarOpen ? "translateX(0)" : "translateX(-100%)"};
    width: 85%;
    max-width: 320px;
    padding: 20px 15px;
  }
`;

const SidebarHeader = styled.div`
  display: ${(props) => (props.isMobile ? "flex" : "none")};
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    display: flex;
  }
`;

const SidebarTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }

  &:active {
    transform: rotate(90deg) scale(0.95);
  }
`;

const SidebarNav = styled.nav`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    margin-bottom: ${(props) => (props.isMobile ? "8px" : "10px")};
  }

  @media (max-width: 768px) {
    li {
      margin-bottom: 8px;
    }
  }
`;

const ToggleButton = styled.button`
  position: fixed;
  top: ${(props) => (props.isMobile ? "15px" : "20px")};
  left: ${(props) => (props.isMobile ? "15px" : "20px")};
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: ${(props) => (props.isMobile ? "50px" : "44px")};
  height: ${(props) => (props.isMobile ? "50px" : "44px")};
  border-radius: 12px;
  font-size: ${(props) => (props.isMobile ? "22px" : "20px")};
  cursor: pointer;
  z-index: 1100;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0) scale(0.95);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 769px) {
    display: none;
  }

  @media (max-width: 768px) {
    display: flex;
    width: 50px;
    height: 50px;
    font-size: 22px;
  }
`;

const Overlay = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 900;
  transition: opacity 0.3s ease;

  @media (max-width: 768px) {
    opacity: ${(props) => (props.isOpen ? "1" : "0")};
  }
`;

const BoardsSection = styled.div`
  margin-top: ${(props) => (props.isMobile ? "20px" : "30px")};

  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

const BoardsTitle = styled.h3`
  font-size: ${(props) => (props.isMobile ? "1rem" : "18px")};
  margin-bottom: ${(props) => (props.isMobile ? "12px" : "15px")};
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 12px;
  }
`;

const BoardList = styled.ul`
  padding: 0;
  margin: 0;
`;

const BoardItem = styled.li`
  list-style: none;
  padding: ${(props) => (props.isMobile ? "12px 14px" : "8px 16px")};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: ${(props) => (props.isMobile ? "8px" : "4px")};
  font-size: ${(props) => (props.isMobile ? "15px" : "16px")};
  background-color: ${(props) =>
    props.isSelected ? "#F0F0F0" : "transparent"};
  color: ${(props) => (props.isSelected ? "black" : "white")};
  margin-bottom: ${(props) => (props.isMobile ? "8px" : "6px")};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.isSelected ? "#F0F0F0" : "rgba(255, 255, 255, 0.1)"};
    transform: ${(props) => (props.isMobile ? "translateX(4px)" : "none")};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
    border-radius: 8px;
    font-size: 15px;
    margin-bottom: 8px;
  }
`;

const StyledNavLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  font-size: ${(props) => (props.isMobile ? "15px" : "16px")};
  font-weight: 500;
  padding: ${(props) => (props.isMobile ? "12px 10px" : "10px")};
  border-radius: ${(props) => (props.isMobile ? "8px" : "4px")};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: ${(props) => (props.isMobile ? "translateX(4px)" : "none")};
  }

  &:active {
    transform: scale(0.98);
  }

  &.active {
    color: ${(props) => (props.isMobile ? "white" : "blue")};
    font-weight: bold;
    background: ${(props) =>
      props.isMobile ? "rgba(255, 255, 255, 0.15)" : "transparent"};
  }

  svg {
    font-size: ${(props) => (props.isMobile ? "20px" : "18px")};
    margin-right: ${(props) => (props.isMobile ? "12px" : "10px")};
  }

  @media (max-width: 768px) {
    font-size: 15px;
    padding: 12px 10px;
    border-radius: 8px;

    &.active {
      color: white;
      background: rgba(255, 255, 255, 0.15);
    }

    svg {
      font-size: 20px;
      margin-right: 12px;
    }
  }
`;

const BoardDetails = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
`;

const ColorBox = styled.div`
  width: ${(props) => (props.isMobile ? "24px" : "20px")};
  height: ${(props) => (props.isMobile ? "24px" : "20px")};
  background: ${(props) => props.bgColor};
  margin-right: ${(props) => (props.isMobile ? "10px" : "8px")};
  border-radius: ${(props) => (props.isMobile ? "6px" : "4px")};
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    border-radius: 6px;
  }
`;

const BoardName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MenuIcon = styled.div`
  cursor: pointer;
  color: ${(props) => (props.isSelected ? "#333" : "white")};
  font-size: ${(props) => (props.isMobile ? "18px" : "16px")};
  position: relative;
  padding: ${(props) => (props.isMobile ? "8px" : "4px")};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => 
    props.isSelected 
      ? "rgba(0, 0, 0, 0.05)" 
      : "rgba(255, 255, 255, 0.1)"};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid ${(props) => 
    props.isSelected 
      ? "rgba(0, 0, 0, 0.1)" 
      : "rgba(255, 255, 255, 0.2)"};
  border-radius: ${(props) => (props.isMobile ? "8px" : "6px")};
  width: ${(props) => (props.isMobile ? "32px" : "28px")};
  height: ${(props) => (props.isMobile ? "32px" : "28px")};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: ${(props) => 
      props.isSelected 
        ? "rgba(0, 0, 0, 0.1)" 
        : "rgba(255, 255, 255, 0.2)"};
    border: 1px solid ${(props) => 
      props.isSelected 
        ? "rgba(0, 0, 0, 0.15)" 
        : "rgba(255, 255, 255, 0.3)"};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    font-size: 18px;
    padding: 8px;
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: ${(props) => (props.isMobile ? "10px" : "8px")};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: ${(props) => (props.isOpen ? "block" : "none")};
  min-width: ${(props) => (props.isMobile ? "140px" : "120px")};
  z-index: 1500;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    border-radius: 10px;
    min-width: 140px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
  }
`;

const MenuItem = styled.div`
  padding: ${(props) => (props.isMobile ? "12px 16px" : "10px 14px")};
  color: #333;
  cursor: pointer;
  font-size: ${(props) => (props.isMobile ? "15px" : "14px")};
  font-weight: 500;
  transition: all 0.2s ease;
  background: transparent;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &:active {
    background: rgba(0, 0, 0, 0.1);
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 15px;
  }
`;

const Sidebar = ({ boards, setBoards }) => {
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [editingBoardIndex, setEditingBoardIndex] = useState(null);
  const [boardName, setBoardName] = useState("");
  const [boardId, setBoardId] = useState("");
  const [isMobileView, setIsMobileView] = useState(isMobile());
  const navigate = useNavigate();
  const employeeId = localStorage.getItem("employeeId");
  const employeeName = localStorage.getItem("employeeName");
  const location = useLocation();
  const role = localStorage.getItem("role");
  const Trackerbaseurl = process.env.REACT_APP_BACKEND_TRACKER_BASE_URL;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(isMobile());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when clicking on a link (mobile only)
  useEffect(() => {
    if (isMobileView) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);

  useEffect(() => {
    const storedBoards = JSON.parse(localStorage.getItem("boards"));
    if (storedBoards) {
      setBoards(storedBoards);
    }
  }, []);

  const selectedBoardColor =
    location.state?.boardColor || "linear-gradient(135deg, #ff9a9e, #fad0c4)";

  const handleBoardClick = (board) => {
    setSelectedBoard(board);
    navigate("/Todolist", {
      state: {
        boardId: board.boardId,
        boardName: board.boardName,
        boardColor: board.boardColor,
        employeeId: employeeId,
        employeeName: employeeName,
      },
    });
    if (isMobileView) {
      setIsSidebarOpen(false);
    }
  };

  const openDeleteModal = (board) => {
    setSelectedBoard(board);
    setBoardName(board.boardName);
    setBoardId(board.boardId);
    setIsDeleteModalOpen(true);
    setActiveMenu(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedBoard(null);
  };

  const openEditModal = (board, index) => {
    setSelectedBoard(board);
    setEditingBoardIndex(index);
    setBoardName(board.boardName);
    setBoardId(board.boardId);
    setIsEditModalOpen(true);
    setActiveMenu(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBoard(null);
    setEditingBoardIndex(null);
  };

  const saveEditedBoard = async (newTitle) => {
    try {
      const updatedBoard = { ...selectedBoard, boardName: newTitle };

      const result = await apiRequest(
        `${Trackerbaseurl}boards/${selectedBoard.boardId}/`,
        "PUT",
        {
          boardName: newTitle,
          boardColor: selectedBoard.boardColor,
        }
      );

      if (result.success) {
        const updatedBoards = boards.map((board) =>
          board.boardId === selectedBoard.boardId ? updatedBoard : board
        );
        setBoards(updatedBoards);
        closeEditModal();
        toast.success("Board updated successfully!", {
          position: isMobileView ? "top-center" : "top-right",
        });
      } else {
        console.error("Failed to update board:", result.error);
        toast.error(result.error || "An error occurred while updating the board", {
          position: isMobileView ? "top-center" : "top-right",
        });
      }
    } catch (error) {
      console.error("Error updating board:", error);
      toast.error("Error updating board", {
        position: isMobileView ? "top-center" : "top-right",
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenu !== null && !event.target.closest(`.menu-${activeMenu}`)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu]);

  const handleDeleteBoard = async () => {
    try {
      const result = await apiRequest(
        `${Trackerbaseurl}boards/${selectedBoard.boardId}/`,
        "PUT",
        {
          is_active: false,
        }
      );

      if (result.success) {
        const updatedBoards = boards.filter(
          (board) => board.boardId !== selectedBoard.boardId
        );
        setBoards(updatedBoards);
        closeDeleteModal();
        toast.success("Board deleted successfully!", {
          position: isMobileView ? "top-center" : "top-right",
        });
      } else {
        console.error("Failed to delete board:", result.error);
        toast.error(result.error || "An error occurred while deleting the board", {
          position: isMobileView ? "top-center" : "top-right",
        });
      }
    } catch (error) {
      console.error("Error deleting board:", error);
      toast.error("Error deleting board", {
        position: isMobileView ? "top-center" : "top-right",
      });
    }
  };

  const toggleMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  return (
    <>
      <ToggleButton isMobile={isMobileView} onClick={toggleSidebar}>
        ☰
      </ToggleButton>
      <Overlay isOpen={isSidebarOpen} onClick={toggleSidebar} />
      <SidebarContainer
        isMobile={isMobileView}
        isSidebarOpen={isSidebarOpen}
        style={{ background: selectedBoardColor, minHeight: "100vh" }}
      >
        {isMobileView && (
          <SidebarHeader isMobile={isMobileView}>
            <SidebarTitle>Menu</SidebarTitle>
            <CloseButton onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faTimes} />
            </CloseButton>
          </SidebarHeader>
        )}

        <SidebarNav isMobile={isMobileView}>
          <ul>
            <li>
              <StyledNavLink
                isMobile={isMobileView}
                to="/Board"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <MdOutlineSpaceDashboard />
                Board
              </StyledNavLink>
            </li>
            {(role === "Admin" || role === "HOD") && (
              <li>
                <StyledNavLink
                  isMobile={isMobileView}
                  to="/Members"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <PiUsersThreeDuotone />
                  Members
                </StyledNavLink>
              </li>
            )}
            <li>
              <StyledNavLink
                isMobile={isMobileView}
                to="/deadlines"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Task Deadlines
              </StyledNavLink>
            </li>
            <li>
              <StyledNavLink
                isMobile={isMobileView}
                to="/finished"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Finished Tasks
              </StyledNavLink>
            </li>
            {(role === "Admin") && (
            <li>
              <StyledNavLink
                isMobile={isMobileView}
                to="/Deletedcards"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Deleted cards
              </StyledNavLink>
            </li>  
            )}          
          </ul>
        </SidebarNav>

        <BoardsSection isMobile={isMobileView}>
          <BoardsTitle isMobile={isMobileView}>Your Boards</BoardsTitle>
          <BoardList>
            {boards.map(
              ({ boardId, boardName, boardColor, employeeName }, index) => {
                const isSelected = selectedBoard && selectedBoard.boardId === boardId;
                return (
                  <BoardItem
                    key={boardId}
                    isMobile={isMobileView}
                    isSelected={isSelected}
                    bgColor={boardColor}
                    onClick={() =>
                      handleBoardClick({
                        boardId,
                        boardName,
                        boardColor,
                        employeeName,
                      })
                    }
                  >
                    <BoardDetails>
                      <ColorBox isMobile={isMobileView} bgColor={boardColor} />
                      <BoardName>{boardName}</BoardName>
                    </BoardDetails>
                    <div className={`menu-${index}`}>
                      <MenuIcon
                        isMobile={isMobileView}
                        isSelected={isSelected}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(index);
                        }}
                      >
                        <FontAwesomeIcon icon={faEllipsisV} />
                        <MenuDropdown isMobile={isMobileView} isOpen={activeMenu === index}>
                          <MenuItem
                            isMobile={isMobileView}
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(
                                { boardId, boardName, boardColor },
                                index
                              );
                            }}
                          >
                            Edit
                          </MenuItem>
                          <MenuItem
                            isMobile={isMobileView}
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteModal({ boardId, boardName });
                            }}
                          >
                            Delete
                          </MenuItem>
                        </MenuDropdown>
                      </MenuIcon>
                    </div>
                  </BoardItem>
                );
              }
            )}
          </BoardList>
        </BoardsSection>
        <SignOut />

        {isDeleteModalOpen && (
          <DeleteBoardModal
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            onDelete={handleDeleteBoard}
            boardName={boardName}
          />
        )}

        {isEditModalOpen && (
          <EditBoardModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            boardName={boardName}
            onSave={saveEditedBoard}
          />
        )}

      </SidebarContainer>
    </>
  );
};

export default Sidebar;