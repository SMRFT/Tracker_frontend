import React, { useState, useEffect, useMemo, useCallback } from "react";
import styled from "styled-components";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FiClock, FiCheckSquare, FiTrash2, FiChevronLeft, FiChevronRight, FiSearch, FiX } from "react-icons/fi";
import DeleteBoardModal from "./DeleteBoardModal";
import EditBoardModal from "./EditBoardModal";

import { MdOutlineSpaceDashboard } from "react-icons/md";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "./apiRequest";

// Detect if device is mobile
const isMobile = () => {
  return window.innerWidth <= 768;
};

const HEADER_HEIGHT = 60;

const SidebarContainer = styled.div`
  width: ${(props) => (props.isMobile ? "85%" : props.isCollapsed ? "72px" : "270px")};
  max-width: ${(props) => (props.isMobile ? "320px" : "270px")};
  background-color: var(--bg-primary);
  padding: ${(props) => (props.isMobile ? "20px 15px" : props.isCollapsed ? "20px 10px" : "24px 20px")};
  height: calc(100vh - ${HEADER_HEIGHT}px);
  position: fixed;
  color: var(--text-main);
  top: ${HEADER_HEIGHT}px;
  left: 0;
  border-right: 1px solid var(--border-subtle);
  box-shadow: 1px 0 0 var(--border-subtle);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 99px;
  }

  @media (max-width: 768px) {
    transform: ${(props) => (props.isSidebarOpen ? "translateX(0)" : "translateX(-100%)")};
    width: 85%;
    max-width: 320px;
    padding: 24px 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  color: var(--text-muted);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: var(--text-main);
  }
`;

const SidebarNav = styled.nav`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    margin-bottom: 4px;
  }
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 15px;
  left: 15px;
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  color: var(--text-main);
  width: 44px;
  height: 44px;
  border-radius: 12px;
  font-size: 20px;
  cursor: pointer;
  z-index: 1099;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: none;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Overlay = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 900;
  transition: opacity 0.3s ease;
`;

const BoardsSection = styled.div`
  margin-top: 32px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const BoardsHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 12px;
  
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const BoardsTitleText = styled.h3`
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
`;

const SearchIconButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: var(--text-main);
    background: rgba(0, 0, 0, 0.05);
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 6px 10px;
  margin: 0 12px 12px 12px;
  gap: 8px;

  @media (max-width: 768px) {
    margin: 0 0 12px 0;
  }
`;

const SidebarSearchInput = styled.input`
  background: transparent;
  border: none;
  color: var(--text-main);
  font-size: 0.85rem;
  width: 100%;
  outline: none;

  &::placeholder {
    color: var(--text-muted);
  }
`;

const CloseSearchButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 50%;

  &:hover {
    color: var(--text-main);
    background: rgba(0, 0, 0, 0.05);
  }
`;

const BoardList = styled.ul`
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
  
  &::-webkit-scrollbar {
    width: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const BoardItemContainer = styled.li`
  list-style: none;
  padding: ${(props) => (props.isCollapsed ? "8px" : "10px 12px")};
  cursor: pointer;
  display: flex;
  justify-content: ${(props) => (props.isCollapsed ? "center" : "space-between")};
  align-items: center;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: ${(props) => (props.isSelected ? "rgba(99, 102, 241, 0.15)" : "transparent")};
  color: ${(props) => (props.isSelected ? "var(--primary-accent)" : "var(--text-muted)")};
  margin-bottom: 4px;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
    color: var(--text-main);
  }
`;

const StyledNavLink = styled(NavLink)`
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.925rem;
  font-weight: 500;
  padding: ${(props) => (props.isCollapsed ? "12px" : "10px 14px")};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isCollapsed ? "center" : "flex-start")};
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s ease;
  gap: 12px;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
    color: var(--text-main);
  }

  &.active {
    color: var(--primary-accent);
    background: rgba(99, 102, 241, 0.15);
    border-left: 3px solid var(--primary-accent);
    border-radius: 0 8px 8px 0;
  }

  svg {
    font-size: 1.15rem;
    flex-shrink: 0;
  }
`;

const BoardDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
`;

const ColorBox = styled.div`
  width: 12px;
  height: 12px;
  background: ${(props) => props.bgColor};
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 6px ${(props) => props.bgColor}80;
`;

const BoardName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: ${(props) => (props.isCollapsed ? "none" : "block")};
`;

const MenuIcon = styled.div`
  cursor: pointer;
  color: var(--text-muted);
  font-size: 0.85rem;
  position: relative;
  width: 24px;
  height: 24px;
  display: ${(props) => (props.isCollapsed ? "none" : "flex")};
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: var(--text-main);
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
  display: ${(props) => (props.isOpen ? "block" : "none")};
  min-width: 110px;
  z-index: 1500;
  overflow: hidden;
`;

const MenuItem = styled.div`
  padding: 8px 12px;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.825rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: var(--border-subtle);
    color: var(--text-main);
  }
`;

const BottomActionSection = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border-subtle);
`;

const CollapseBtn = styled.button`
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isCollapsed ? "center" : "flex-start")};
  gap: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    color: var(--text-main);
    background: rgba(0, 0, 0, 0.05);
  }

  svg {
    font-size: 1.15rem;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;


const BoardRow = React.memo(function BoardRow({
  board,
  index,
  isCollapsed,
  isSelected,
  isMenuOpen,
  onSelect,
  onToggleMenu,
  onEdit,
  onDelete,
}) {
  const { boardId, boardName, boardColor } = board;

  return (
    <BoardItemContainer
      isCollapsed={isCollapsed}
      isSelected={isSelected}
      title={isCollapsed ? boardName : ""}
      onClick={() => onSelect(board)}
    >
      <BoardDetails>
        <ColorBox bgColor={boardColor} />
        <BoardName isCollapsed={isCollapsed}>{boardName}</BoardName>
      </BoardDetails>
      <div className={`menu-${index}`}>
        <MenuIcon
          isCollapsed={isCollapsed}
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu(index);
          }}
        >
          <FontAwesomeIcon icon={faEllipsisV} />
          <MenuDropdown isOpen={isMenuOpen}>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit({ boardId, boardName, boardColor }, index);
              }}
            >
              Edit
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete({ boardId, boardName });
              }}
            >
              Delete
            </MenuItem>
          </MenuDropdown>
        </MenuIcon>
      </div>
    </BoardItemContainer>
  );
});

const Sidebar = ({ boards, refreshBoards, isCollapsed, setIsCollapsed }) => {
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [editingBoardIndex, setEditingBoardIndex] = useState(null);
  const [boardName, setBoardName] = useState("");
  const [boardId, setBoardId] = useState("");
  const [isMobileView, setIsMobileView] = useState(isMobile());
  const [isSearching, setIsSearching] = useState(false);
  const [boardSearchTerm, setBoardSearchTerm] = useState("");
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

  const handleBoardClick = useCallback((board) => {
    setSelectedBoard(board);
    navigate("/Todolist", {
      state: {
        boardId: board.boardId,
        boardName: board.boardName,
        boardColor: board.boardColor,
        employeeId: employeeId,
        employeeName: board.employeeName || employeeName,
        created_by_name: board.created_by_name || board.employeeName || board.created_by,
        created_by: board.created_by,
      },
    });
    if (isMobileView) {
      setIsSidebarOpen(false);
    }
  }, [navigate, employeeId, employeeName, isMobileView]);

  const openDeleteModal = useCallback((board) => {
    setSelectedBoard(board);
    setBoardName(board.boardName);
    setBoardId(board.boardId);
    setIsDeleteModalOpen(true);
    setActiveMenu(null);
  }, []);

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedBoard(null);
  };

  const openEditModal = useCallback((board, index) => {
    setSelectedBoard(board);
    setEditingBoardIndex(index);
    setBoardName(board.boardName);
    setBoardId(board.boardId);
    setIsEditModalOpen(true);
    setActiveMenu(null);
  }, []);

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBoard(null);
    setEditingBoardIndex(null);
  };

  const saveEditedBoard = async (newTitle) => {
    try {
      const result = await apiRequest(
        `${Trackerbaseurl}boards/${selectedBoard.boardId}/`,
        "PUT",
        {
          boardName: newTitle,
          boardColor: selectedBoard.boardColor,
        }
      );

      if (result.success) {
        await refreshBoards();
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
        await refreshBoards();
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

  const toggleMenu = useCallback((index) => {
    setActiveMenu((prev) => (prev === index ? null : index));
  }, []);

  const filteredBoards = useMemo(() => {
    const term = (boardSearchTerm || "").toLowerCase();
    return boards.filter(
      (board) => board && board.boardName && board.boardName.toLowerCase().includes(term)
    );
  }, [boards, boardSearchTerm]);

  return (
    <>
      <ToggleButton onClick={toggleSidebar}>
        ☰
      </ToggleButton>
      <Overlay isOpen={isSidebarOpen} onClick={toggleSidebar} />
      <SidebarContainer
        isMobile={isMobileView}
        isSidebarOpen={isSidebarOpen}
        isCollapsed={isCollapsed}
      >
        {isMobileView && (
          <CloseButton onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
        )}

        <SidebarNav isCollapsed={isCollapsed}>
          <ul>
            <li>
              <StyledNavLink
                isCollapsed={isCollapsed}
                to="/Board"
                title={isCollapsed ? "Boards" : ""}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <MdOutlineSpaceDashboard />
                {!isCollapsed && <span>Boards</span>}
              </StyledNavLink>
            </li>
            {(role === "Admin" || role === "HOD") && (
              <li>
                <StyledNavLink
                  isCollapsed={isCollapsed}
                  to="/Members"
                  title={isCollapsed ? "Members" : ""}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <PiUsersThreeDuotone />
                  {!isCollapsed && <span>Members</span>}
                </StyledNavLink>
              </li>
            )}
            <li>
              <StyledNavLink
                isCollapsed={isCollapsed}
                to="/deadlines"
                title={isCollapsed ? "Task Deadlines" : ""}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FiClock />
                {!isCollapsed && <span>Task Deadlines</span>}
              </StyledNavLink>
            </li>
            <li>
              <StyledNavLink
                isCollapsed={isCollapsed}
                to="/finished"
                title={isCollapsed ? "Finished Tasks" : ""}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FiCheckSquare />
                {!isCollapsed && <span>Finished Tasks</span>}
              </StyledNavLink>
            </li>
            {role === "Admin" && (
              <li>
                <StyledNavLink
                  isCollapsed={isCollapsed}
                  to="/Deletedcards"
                  title={isCollapsed ? "Deleted Cards" : ""}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <FiTrash2 />
                  {!isCollapsed && <span>Deleted Cards</span>}
                </StyledNavLink>
              </li>
            )}
          </ul>
        </SidebarNav>

        <BoardsSection isCollapsed={isCollapsed}>
          {isCollapsed ? (
            <div style={{ height: "1px", background: "rgba(255, 255, 255, 0.08)", margin: "16px 0" }} />
          ) : (
            <>
              <BoardsHeaderContainer>
                <BoardsTitleText>Your Boards</BoardsTitleText>
                {!isSearching && (
                  <SearchIconButton onClick={() => setIsSearching(true)} title="Search boards">
                    <FiSearch size={14} />
                  </SearchIconButton>
                )}
              </BoardsHeaderContainer>
              {isSearching && (
                <SearchInputWrapper>
                  <FiSearch size={14} color="var(--text-muted)" />
                  <SidebarSearchInput
                    type="text"
                    placeholder="Search boards..."
                    value={boardSearchTerm}
                    onChange={(e) => setBoardSearchTerm(e.target.value)}
                    autoFocus
                  />
                  <CloseSearchButton 
                    onClick={() => {
                      setIsSearching(false);
                      setBoardSearchTerm("");
                    }}
                    title="Close search"
                  >
                    <FiX size={12} />
                  </CloseSearchButton>
                </SearchInputWrapper>
              )}
            </>
          )}
          <BoardList>
            {filteredBoards.map((board, index) => (
              <BoardRow
                key={board.boardId}
                board={board}
                index={index}
                isCollapsed={isCollapsed}
                isSelected={!!selectedBoard && selectedBoard.boardId === board.boardId}
                isMenuOpen={activeMenu === index}
                onSelect={handleBoardClick}
                onToggleMenu={toggleMenu}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
          </BoardList>
        </BoardsSection>

        <BottomActionSection>
          <CollapseBtn isCollapsed={isCollapsed} onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <FiChevronRight /> : <><FiChevronLeft /> <span>Collapse Sidebar</span></>}
          </CollapseBtn>
        </BottomActionSection>

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