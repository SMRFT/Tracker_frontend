import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import DeleteBoardModal from "./DeleteBoardModal";
import EditBoardModal from "./EditBoardModal";
import SignOut from "./SignOut";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "./apiRequest";

const SidebarContainer = styled.div`
  width: 290px;
  background-color: ${(props) =>
    props.bgColor ||
    "linear-gradient(135deg, #ff9a9e, #fad0c4)"}; /* Use bgColor prop or fallback to white */
  padding: 20px;
  height: 100vh;
  position: fixed;
  color: white;
  top: 0;
  left: 0;
  box-shadow: 1px 0 2px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease, background-color 0.3s ease; /* Add smooth transition */
  z-index: 1000;

  @media (max-width: 768px) {
    transform: ${(props) =>
      props.isSidebarOpen ? "translateX(0)" : "translateX(-100%)"};
  }
`;

const SidebarNav = styled.nav`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    margin-bottom: 10px; /* Increased spacing between links */
  }
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  z-index: 1100;

  @media (min-width: 769px) {
    display: none;
  }
`;

const Overlay = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 900;
`;

const BoardsSection = styled.div`
  margin-top: 30px;
`;

const BoardsTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 15px;
  color: white;
  font-weight: 600;
`;

const BoardList = styled.ul`
  padding: 0;
  margin: 0;
`;

const BoardItem = styled.li`
  list-style: none;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  font-size: 16px;
  background-color: ${(props) =>
    props.isSelected ? "#F0F0F0" : "transparent"};
  color: ${(props) => (props.isSelected ? "black" : "white")};
`;

const StyledNavLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  align-items: center; /* Vertically aligns text and icon */
  justify-content: flex-start;
  width: 100%;
  box-sizing: border-box;
  transition: color 0.3s, transform 0.3s;

  &.active {
    color: blue; /* Color for active link */
    font-weight: bold; /* Optional: Make active link bold */
  }
`;

const BoardDetails = styled.div`
  display: flex;
  align-items: center;
`;

const ColorBox = styled.div`
  width: 20px;
  height: 20px;
  background: ${(props) =>
    props.bgColor}; /* This will handle both solid colors and gradients */
  margin-right: 8px;
  border-radius: 4px;
`;

const MenuIcon = styled.div`
  cursor: pointer;
  color: white;
  font-size: 16px;
  position: relative;
`;

const MenuDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: ${(props) => (props.isOpen ? "block" : "none")};
  min-width: 120px;
  z-index: 1500;
`;

const MenuItem = styled.div`
  padding: 8px 12px;
  color: #333;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
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
  const navigate = useNavigate();
  const employeeId = localStorage.getItem("employeeId");
  const employeeName = localStorage.getItem("employeeName");
  const location = useLocation();
  const role = localStorage.getItem("role");
  const Trackerbaseurl = process.env.REACT_APP_BACKEND_TRACKER_BASE_URL;
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    // Save boards to localStorage whenever they change
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);

  useEffect(() => {
    // On component mount, try to load boards from localStorage
    const storedBoards = JSON.parse(localStorage.getItem("boards"));
    if (storedBoards) {
      setBoards(storedBoards);
    }
  }, []);

  const selectedBoardColor =
    location.state?.boardColor || "linear-gradient(135deg, #ff9a9e, #fad0c4)"; // Default color

  const handleBoardClick = (board) => {
    setSelectedBoard(board); // This just sets the selected board
    navigate("/Todolist", {
      state: {
        boardId: board.boardId,
        boardName: board.boardName,
        boardColor: board.boardColor,
        employeeId: employeeId,
        employeeName: employeeName,
      },
    });
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
    window.location.reload(); // Reload the page to reflect changes
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
    window.location.reload(); // Reload the page to reflect changes
  };

  const saveEditedBoard = async (newTitle) => {
    try {
      const updatedBoard = { ...selectedBoard, boardName: newTitle };

      // Use apiRequest instead of direct fetch
      const result = await apiRequest(
        `${Trackerbaseurl}boards/${selectedBoard.boardId}/`,
        "PUT",
        {
          boardName: newTitle,
          boardColor: selectedBoard.boardColor,
          // Remove employeeId and employeeName - backend will get these from token
        }
      );

      if (result.success) {
        const updatedBoards = boards.map((board) =>
          board.boardId === selectedBoard.boardId ? updatedBoard : board
        );
        setBoards(updatedBoards); // Update the boards state in App.js
        closeEditModal();
        toast.success("Board updated successfully!"); // Success toast
      } else {
        console.error("Failed to update board:", result.error);
        toast.error(
          result.error || "An error occurred while updating the board"
        );
      }
    } catch (error) {
      console.error("Error updating board:", error);
      toast.error("Error updating board"); // Toastify error on catch
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
      // Use apiRequest to soft delete the board
      const result = await apiRequest(
        `${Trackerbaseurl}boards/${selectedBoard.boardId}/`,
        "PUT",
        {
          is_active: false, // Soft delete by setting is_active to false
        }
      );

      if (result.success) {
        // Remove the board from the displayed list (since we only show active boards)
        const updatedBoards = boards.filter(
          (board) => board.boardId !== selectedBoard.boardId
        );
        setBoards(updatedBoards); // Update the boards state in App.js
        closeEditModal();
        toast.success("Board deleted successfully!"); // Success toast
      } else {
        console.error("Failed to delete board:", result.error);
        toast.error(
          result.error || "An error occurred while deleting the board"
        );
      }
    } catch (error) {
      console.error("Error deleting board:", error);
      toast.error("Error deleting board"); // Toastify error on catch
    }
  };

  const toggleMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  return (
    <>
      <ToggleButton onClick={toggleSidebar}>☰</ToggleButton>
      <Overlay isOpen={isSidebarOpen} onClick={toggleSidebar} />
      <SidebarContainer
        isSidebarOpen={isSidebarOpen}
        style={{ background: selectedBoardColor, minHeight: "100vh" }}
      >
        <SidebarNav>
          <ul>
            <li>
              <StyledNavLink
                to="/Board"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <MdOutlineSpaceDashboard style={{ marginRight: "10px" }} />
                Board
              </StyledNavLink>
            </li>
            {/* Conditionally render Members link for Admin and HOD only */}
            {(role === "Admin" || role === "HOD") && (
              <li>
                <StyledNavLink
                  to="/Members"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <PiUsersThreeDuotone style={{ marginRight: "10px" }} />
                  Members
                </StyledNavLink>
              </li>
            )}
          </ul>
        </SidebarNav>

        <BoardsSection>
          <BoardsTitle>Your Boards</BoardsTitle>
          <BoardList>
            {boards.map(
              ({ boardId, boardName, boardColor, employeeName }, index) => (
                <BoardItem
                  key={boardId}
                  isSelected={
                    selectedBoard && selectedBoard.boardId === boardId
                  }
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
                    <ColorBox bgColor={boardColor} />
                    {boardName}
                  </BoardDetails>
                  <div className={`menu-${index}`}>
                    <MenuIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(index);
                      }}
                    >
                      <FontAwesomeIcon icon={faEllipsisV} />
                      <MenuDropdown isOpen={activeMenu === index}>
                        <MenuItem
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
              )
            )}
          </BoardList>
        </BoardsSection>
        <SignOut />

        {/* Delete modal and edit modal components */}
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

        <ToastContainer />
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
