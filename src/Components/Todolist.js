import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaCalendarAlt, FaRegCalendarAlt, FaRegComment, FaTimes, FaPlus, FaRegCreditCard } from "react-icons/fa";

import DateComponent from "./Dates";
import Addmembers from "./Addmembers";
import Description from "./Description";
import Comment from "./Comment";
import { isBefore, format, parseISO } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "./apiRequest";
import { motion, AnimatePresence } from "framer-motion";

const ItemType = {
  CARD: "card",
};

const TodolistContainer = styled.div`
  background-color: var(--bg-primary);
  height: calc(100vh - 60px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
    overflow: visible;
    padding: 1rem;
    margin-top: 50px;
  }
`;

const HeaderBanner = styled.div`
  background: ${(props) => props.bannerColor || "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)"};
  border-radius: 16px;
  padding: 1.75rem 2.25rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BoardTitle = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const BoardSubtitle = styled.span`
  font-size: 0.85rem;
  opacity: 0.85;
  font-weight: 500;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const EmployeeAvatars = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  
  /* Overlapping avatar stack effect */
  & > * {
    margin-left: -8px;
    &:first-child {
      margin-left: 0;
    }
  }
`;

const EmployeeAvatar = styled.div`
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);

  &:hover {
    transform: translateY(-3px) scale(1.08);
    z-index: 10;
    border-color: white;
  }
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.12);
  padding: 6px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
`;

const CalendarIconButton = styled.button`
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
`;

const BoardGrid = styled.div`
  display: flex;
  gap: 1.5rem;
  padding-bottom: 2rem;
  overflow-x: auto;
  overflow-y: hidden;
  align-items: flex-start;
  flex: 1;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 99px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    overflow-x: visible;
    overflow-y: visible;
    flex: none;
  }
`;

const ColumnWrapper = styled.div`
  width: 290px;
  min-width: 290px;
  padding: 16px;
  border-radius: 16px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 280px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.01);

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
    height: auto;
  }
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 4px;
`;

const ColumnTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
`;

const CountBadge = styled.span`
  background: #cbd5e1;
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 9999px;
`;

const CardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  flex: 1;
  padding: 2px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

const CardContainer = styled.div`
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border-subtle);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.08);
    border-color: var(--primary-accent);
  }
`;

const CardRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const CardBody = styled.div`
  cursor: pointer;
  flex: 1;
`;

const CardText = styled.strong`
  font-size: 0.925rem;
  font-weight: 600;
  color: var(--text-main);
  line-height: 1.4;
  word-break: break-word;
`;

const CreatorInfo = styled.p`
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 4px 0 0 0;
  line-height: 1.3;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--text-light);
  padding: 2px;
  line-height: 1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: var(--danger);
    background: #fee2e2;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px solid var(--border-subtle);
  flex-wrap: wrap;
  gap: 8px;
`;

const DateBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${(props) => (props.isOverdue ? "rgba(239, 68, 68, 0.15)" : "var(--bg-secondary)")};
  color: ${(props) => (props.isOverdue ? "var(--danger)" : "var(--text-muted)")};
`;

const CardMemberList = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  
  & > * {
    margin-left: -6px;
    &:first-child {
      margin-left: 0;
    }
  }
`;

const CardMemberAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1.5px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  color: white;
  background-color: ${(props) => props.bgColor || "var(--primary-accent)"};
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`;

const CardMemberImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1.5px solid white;
  object-fit: cover;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`;

const AddCardContainer = styled.div`
  margin-top: 12px;
`;

const AddCardInput = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  font-size: 0.85rem;
  color: var(--text-main);
  background: white;
  resize: none;
  min-height: 60px;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--primary-accent);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const AddCardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
`;

const AddCardBtn = styled.button`
  padding: 6px 12px;
  background-color: var(--primary-accent);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background-color: var(--primary-hover);
  }
`;

const AddCardCancelBtn = styled.button`
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:hover {
    background: #e2e8f0;
    color: var(--text-main);
  }
`;

const AddInitialCardButton = styled.button`
  width: 100%;
  padding: 8px;
  background: transparent;
  color: var(--text-muted);
  border: 1px dashed var(--border-subtle);
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
    color: var(--text-main);
    border-color: #cbd5e1;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalContainer = styled(motion.div)`
  background-color: var(--bg-secondary);
  width: 100%;
  max-width: 900px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-subtle);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-subtle);
`;

const ModalHeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: var(--border-subtle);
    color: var(--text-main);
  }
`;

const ModalContent = styled.div`
  display: flex;
  padding: 2rem;
  gap: 2rem;
  flex: 1;
  overflow-y: auto;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.5rem;
  }
`;

const ModalLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const ModalRight = styled.div`
  flex: 0 0 260px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid var(--border-subtle);

  @media (max-width: 768px) {
    flex: unset;
    width: 100%;
  }
`;

const CardNameInput = styled.input`
  font-size: 1.35rem;
  font-weight: 700;
  padding: 4px 8px;
  border: 1px solid var(--primary-accent);
  border-radius: 6px;
  color: var(--text-main);
  width: 90%;
  outline: none;
`;

const CardNameText = styled.h2`
  cursor: pointer;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
  letter-spacing: -0.01em;

  &:hover {
    color: var(--primary-accent);
  }
`;

const DetailGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const DetailLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DetailValue = styled.div`
  font-size: 0.9rem;
  color: var(--text-main);
`;

const DateBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--bg-secondary);
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border-subtle);
`;

const DateRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  
  strong {
    color: var(--text-muted);
    font-weight: 500;
  }
`;

const EmployeeCardsWrapper = styled.div`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-sidebar);
  padding: 1.25rem;
  border-radius: 16px;
  width: 290px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;

  @media (max-width: 768px) {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 320px;
  }
`;

const EmployeeCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const EmployeeCardsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding-bottom: 8px;

  h3 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
  }
`;

const EmployeeCardsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
`;

const EmployeeCardItem = styled.li`
  padding: 8px 0;
  font-size: 0.85rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const CalendarContainer = styled.div`
  position: fixed;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  width: 80vw;
  height: 80vh;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  z-index: 1000;
  overflow: hidden;
  padding: 20px;
  border: 1px solid var(--border-subtle);

  @media (max-width: 768px) {
    width: 95vw;
    height: 70vh;
    top: 80px;
  }
`;

const DragAndDropCards = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeId, employeeName, boardId, boardName, boardColor } =
    location.state || {};
  const [modalContent, setModalContent] = useState({
    cardName: "",
    cardId: "",
    boardName: "",
    boardId: "",
    startdate: null,
    enddate: null,
    columnId: null,
    created_by_name: "",
    created_date: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedCardName, setEditedCardName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [cardMembers, setCardMembers] = useState([]);
  const [cardAdded, setCardAdded] = useState(false);
  const [showDeleteCardConfirm, setShowDeleteCardConfirm] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const Trackerbaseurl = process.env.REACT_APP_BACKEND_TRACKER_BASE_URL;

  const localizer = momentLocalizer(moment);

  const Card = ({ id, index, columnId, text, createdByName, moveCard, openModal, created_date, startdate, enddate }) => {
    const [, drag] = useDrag({
      type: ItemType.CARD,
      item: { id, index, columnId },
    });

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString(); 
    };

    const overdue = enddate && isOverdue(enddate, columnId);

    return (
      <CardContainer ref={drag}>
        <CardRow>
          <CardBody onClick={() => openModal(text, id)}>
            <CardText>{text || "Untitled Task"}</CardText>
            {createdByName && (
              <CreatorInfo>
                By {createdByName}
              </CreatorInfo>
            )}
          </CardBody>
          <RemoveButton onClick={() => {
            setCardToDelete({ id, columnId });
            setShowDeleteCardConfirm(true);
          }}>
            ×
          </RemoveButton>
        </CardRow>
        
        {(enddate || cardMembers[id]?.length > 0) && (
          <CardFooter>
            {enddate && (
              <DateBadge isOverdue={overdue}>
                <FaRegCalendarAlt size={10} />
                <span>{formatDate(enddate)}</span>
              </DateBadge>
            )}
            
            <CardMemberList>
              {cardMembers[id]?.slice(0, 3).map((member, idx) => (
                <React.Fragment key={idx}>
                  {member.profilePicture ? (
                    <CardMemberImage
                      src={member.profilePicture.startsWith("http") || member.profilePicture.startsWith("data:") ? member.profilePicture : `${Trackerbaseurl}${member.profilePicture.startsWith("/") ? member.profilePicture.slice(1) : member.profilePicture}`}
                      alt={member.employeeName}
                      title={member.employeeName}
                    />
                  ) : (
                    <CardMemberAvatar
                      bgColor={getBackgroundColor(member.employeeName)}
                      title={member.employeeName}
                    >
                      {member.employeeName.charAt(0).toUpperCase()}
                    </CardMemberAvatar>
                  )}
                </React.Fragment>
              ))}
              {cardMembers[id]?.length > 3 && (
                <CardMemberAvatar bgColor="#cbd5e1" title={`${cardMembers[id].length - 3} more`}>
                  +{cardMembers[id].length - 3}
                </CardMemberAvatar>
              )}
            </CardMemberList>
          </CardFooter>
        )}
      </CardContainer>
    );
  };
  
  const Column = ({
    id,
    title,
    cards = [],
    moveCard,
    openModal,
    addCard,
    setColumns,
    showAddCardButton = false,
  }) => {
    const [, drop] = useDrop({
      accept: ItemType.CARD,
      hover: (item) => {
        if (!item) return;
        const { id: cardId, index: fromIndex, columnId: fromColumnId } = item;
        const toIndex = cards.findIndex((card) => card.id === cardId);
        if (fromColumnId === id) {
          if (toIndex !== -1 && fromIndex !== toIndex) {
            moveCard(fromIndex, id, toIndex, id);
            item.index = toIndex;
          }
        } else {
          const toIndex = cards.length;
          moveCard(fromIndex, fromColumnId, toIndex, id);
          item.columnId = id;
        }
      },
    });
    const [inputValue, setInputValue] = useState("");
    const [isAddingCard, setIsAddingCard] = useState(false);

    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };

    const handleAddCard = () => {
      if (inputValue.trim()) {
        addCard(id, inputValue);
        setInputValue("");
        setIsAddingCard(false);
      }
    };

    return (
      <ColumnWrapper ref={drop}>
        <ColumnHeader>
          <ColumnTitle>{title}</ColumnTitle>
          <CountBadge>{cards.length}</CountBadge>
        </ColumnHeader>
        
        <CardsList>
          {cards.map((card, index) => (
            <Card
              key={card.cardId}
              id={card.cardId}
              index={index}
              columnId={id}
              text={card.cardName}
              createdByName={card.created_by_name}
              created_date={card.created_date}
              startdate={card.startdate}
              enddate={card.enddate}
              moveCard={moveCard}
              openModal={() => openModal(card.cardName, card.cardId, title)}
            />
          ))}
        </CardsList>
        
        {showAddCardButton &&
          (localStorage.getItem("role") === "Admin" ||
            localStorage.getItem("role") === "HOD" ||
            localStorage.getItem("role") === "Employee") && (
            <AddCardContainer>
              {isAddingCard ? (
                <>
                  <AddCardInput
                    placeholder="What needs to be done?"
                    value={inputValue}
                    onChange={handleInputChange}
                    autoFocus
                  />
                  <AddCardActions>
                    <AddCardBtn onClick={handleAddCard}>
                      Add Task
                    </AddCardBtn>
                    <AddCardCancelBtn onClick={() => setIsAddingCard(false)}>
                      <FaTimes />
                    </AddCardCancelBtn>
                  </AddCardActions>
                </>
              ) : (
                <AddInitialCardButton onClick={() => setIsAddingCard(true)}>
                  <FaPlus size={12} />
                  <span>Add Task</span>
                </AddInitialCardButton>
              )}
            </AddCardContainer>
          )}
      </ColumnWrapper>
    );
  };

  const closeModal = () => {
    setIsEditing(false);
    setIsOpen(false);
  };

  const [columns, setColumns] = useState({
    do: [],
    doing: [],
    done: [],
    hold: [],
  });

  const handleEditCardName = async () => {
    const userRole = localStorage.getItem("role");
    try {
      const result = await apiRequest(
        `${Trackerbaseurl}cards/${modalContent.cardId}/${boardId}/${userRole}/`,
        "PATCH",
        { cardName: editedCardName }
      );

      if (result.success) {
        if (columns && modalContent.boardName && columns[modalContent.boardName.toLowerCase()]) {
          const key = modalContent.boardName.toLowerCase();
          const updatedColumns = { ...columns };
          const updatedCards = updatedColumns[key].map((card) =>
            card.cardId === modalContent.cardId
              ? { ...card, cardName: editedCardName }
              : card
          );
          setColumns({
            ...updatedColumns,
            [key]: updatedCards,
          });
        }
        await fetchCardsWithMembers(boardId);
      } else {
        console.error("Error updating card name:", result.error);
      }
    } catch (error) {
      console.error("Error updating card name:", error);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardId, setCardId] = useState("");
  const [cardName, setCardName] = useState("");
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const [cards, setCards] = useState([]);
  const [userRole, setRole] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole) {
      setRole(userRole);
    }
  }, []);

  const fetchCardsWithMembers = async (boardId) => {
    const userRole = localStorage.getItem("role");
    try {
      const result = await apiRequest(
        `${Trackerbaseurl}cards/${boardId}/${userRole}/`
      );

      if (!result.success) {
        console.error("Error fetching cards:", result.error);
        return;
      }

      const data = result.data;
      const parsedData = data.map((card) => ({
        ...card,
        startdate: card.startdate ? parseISO(card.startdate) : null,
        enddate: card.enddate ? parseISO(card.enddate) : null,
        created_date: card.created_date ? parseISO(card.created_date) : null,
      }));

      const updatedColumns = {
        do: parsedData.filter((card) => card.columnId === "do"),
        doing: parsedData.filter((card) => card.columnId === "doing"),
        done: parsedData.filter((card) => card.columnId === "done"),
        hold: parsedData.filter((card) => card.columnId === "hold"),
      };

      setColumns(updatedColumns);
      setCards(parsedData);

      const membersData = {};
      parsedData.forEach((card) => {
        let members = [];
        if (card.members) {
          try {
            members = typeof card.members === "string" ? JSON.parse(card.members) : card.members;
          } catch (e) {
            members = [];
          }
        }
        membersData[card.cardId] = members;
      });

      setCardMembers(membersData);

      const calendarEvents = parsedData.map((card) => ({
        title: card.cardName,
        start: card.startdate || new Date(),
        end: card.enddate || new Date(),
        allDay: true,
      }));

      setEvents(calendarEvents);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCardsWithMembers(boardId);
  }, [boardId, userRole]);

  const moveCard = async (fromIndex, fromColumnId, toIndex, toColumnId) => {
    const updatedColumns = { ...columns };
    if (!updatedColumns[fromColumnId] || !updatedColumns[toColumnId]) {
      console.error("Invalid column IDs:", fromColumnId, toColumnId);
      return;
    }
    const [movedCard] = updatedColumns[fromColumnId].splice(fromIndex, 1);
    if (!movedCard) {
      console.error("Card not found:", { fromIndex, fromColumnId });
      return;
    }
    updatedColumns[toColumnId].splice(toIndex, 0, movedCard);
    setColumns(updatedColumns);
    const userRole = localStorage.getItem("role");
    try {
      const result = await apiRequest(
        `${Trackerbaseurl}cards/${movedCard.cardId}/${boardId}/${userRole}/`,
        "PATCH",
        { columnId: toColumnId }
      );

      if (!result.success) {
        console.error("Error updating card column:", result.error);
      }
    } catch (error) {
      console.error("Error updating card column:", error);
    }
  };

  const addCard = async (columnId, text) => {
    const newCard = {
      cardName: text || `Task ${Date.now()}`,
      boardId,
      columnId,
      employeeId,
      employeeName,
      boardName,
    };
    const userRole = localStorage.getItem("role");

    try {
      const result = await apiRequest(
        `${Trackerbaseurl}cards/${boardId}/${userRole}/`,
        "POST",
        newCard
      );

      if (result.success) {
        const data = result.data;
        localStorage.setItem("cardId", data.cardId);
        localStorage.setItem("cardName", data.cardName);

        const updatedColumns = { ...columns };
        updatedColumns[columnId].push({
          cardId: data.cardId,
          cardName: data.cardName,
        });
        setColumns(updatedColumns);
        setCardAdded(true);
      } else {
        console.error("Error adding card:", result.error);
      }
    } catch (error) {
      console.error("Error saving card:", error);
    }
  };

  useEffect(() => {
    if (cardAdded) {
      fetchCardsWithMembers(boardId);
      setCardAdded(false);
    }
  }, [cardAdded]);

  const openModal = (cardName, cardId, colTitle) => {
    const selectedCard = cards.find((card) => card.cardId === cardId);

    const defaultStartDate = selectedCard?.startdate || null;
    const defaultEndDate = selectedCard?.enddate || null;

    setCardName(cardName || "No Card Name");
    setCardId(cardId || null);
    setModalContent({
      cardName: cardName || "No Card Name",
      cardId: cardId || null,
      boardName: colTitle || "No Board Name",
      boardId: boardId || null,
      startdate: defaultStartDate,
      enddate: defaultEndDate,
      columnId: selectedCard?.columnId || null,
      created_by_name: selectedCard?.created_by_name || "System",
      created_date: selectedCard?.created_date || null,
    });

    setEditedCardName(cardName || "");
    setIsModalOpen(true);
    setIsOpen(true);
  };

  const handleRemoveCard = async (targetCardId, colId) => {
    const userRole = localStorage.getItem("role");
    try {
      const result = await apiRequest(
        `${Trackerbaseurl}cards/${targetCardId}/${boardId}/${userRole}/`,
        "DELETE"
      );

      if (result.success) {
        toast.success(result.data?.message || "Card deleted successfully!", {
          autoClose: 2000,
          position: "top-right",
        });

        setColumns((prevColumns) => {
          const updatedCards = prevColumns[colId].filter(
            (card) => card.cardId !== targetCardId
          );
          return { ...prevColumns, [colId]: updatedCards };
        });
      } else {
        toast.error(result.error || "Failed to delete the card.", {
          autoClose: 2000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error deleting card:", error);
      toast.error("Error deleting card.", {
        autoClose: 2000,
        position: "top-right",
      });
    }
  };

  const fetchMembers = async (targetCardId, targetBoardId, targetCardName) => {
    try {
      const result = await apiRequest(
        `${Trackerbaseurl}add_member_to_card/?cardId=${targetCardId}&boardId=${targetBoardId}&cardName=${targetCardName}`
      );

      if (result.success) {
        setMembers(result.data);

        setCardMembers((prev) => ({
          ...prev,
          [targetCardId]: result.data,
        }));
      } else {
        console.error("Error fetching members:", result.error);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  useEffect(() => {
    if (cardId && boardId && cardName) {
      fetchMembers(cardId, boardId, cardName);
    }
  }, [cardId, boardId, cardName]);

  const getBackgroundColor = (name) => {
    const colors = [
      "#818cf8", // Indigo
      "#fb7185", // Rose
      "#34d399", // Emerald
      "#60a5fa", // Blue
      "#a78bfa", // Purple
      "#fbbf24", // Amber
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeCards, setEmployeeCards] = useState([]);
  const [members1, setMembers1] = useState([]);

  const fetchEmployees = async (boardId) => {
    try {
      const result = await apiRequest(`${Trackerbaseurl}employees/${boardId}/`);

      if (result.success && result.data && result.data.employees) {
        setMembers1(result.data.employees);
      } else {
        console.error("Failed to fetch employees:", result.error);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    if (boardId) {
      fetchEmployees(boardId);
    }
  }, [boardId]);

  const fetchEmployeeCards = (member, boardId, position) => {
    const employeeId = member.employeeId;

    apiRequest(`${Trackerbaseurl}employeecards/${employeeId}/${boardId}/`)
      .then((response) => {
        const data = response.data;
        if (data.cards) {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          const filteredCards = data.cards.filter((card) => {
            if (card.columnId !== "done") return true;
            if (!card.lastmodified_date) return false;
            return new Date(card.lastmodified_date) > oneWeekAgo;
          });

          if (filteredCards.length > 0) {
            setEmployeeCards(filteredCards);
            setAvatarPosition(position);
            setSelectedEmployee(member);
          } else {
            setSelectedEmployee(null);
            setEmployeeCards([]);
            toast.info(`No active cards found for ${member.employeeName}`, { autoClose: 2000 });
          }
        } else {
          setSelectedEmployee(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching cards:", error);
        setSelectedEmployee(null);
      });
  };

  const isOverdue = (endDate, columnId) => {
    if (columnId === "done") return false;

    const today = new Date();
    const todayDateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const endDateOnly = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );

    return todayDateOnly > endDateOnly;
  };

  const handleInstantDateUpdate = (newStartDate, newEndDate) => {
    setModalContent((prev) => ({
      ...prev,
      startdate: newStartDate,
      enddate: newEndDate,
    }));

    setColumns((prevColumns) => {
      const updatedColumns = { ...prevColumns };
      Object.keys(updatedColumns).forEach((colKey) => {
        updatedColumns[colKey] = updatedColumns[colKey].map((card) => {
          if (card.cardId === modalContent.cardId) {
            return {
              ...card,
              startdate: newStartDate,
              enddate: newEndDate,
            };
          }
          return card;
        });
      });
      return updatedColumns;
    });

    setEvents((prevEvents) => 
      prevEvents.map((event) => {
        if (event.title === modalContent.cardName) { 
           return { ...event, start: newStartDate, end: newEndDate };
        }
        return event;
      })
    );
    
    fetchCardsWithMembers(boardId); 
  };

  const [avatarPosition, setAvatarPosition] = useState({ top: 0, left: 0 });

  return (
    <TodolistContainer>
      <DndProvider backend={HTML5Backend}>
        <HeaderBanner bannerColor={boardColor}>
          <HeaderLeft>
            <BoardTitle>{boardName || "Board Workspace"}</BoardTitle>
            <BoardSubtitle>HOD / Owner: {employeeName || "General"}</BoardSubtitle>
          </HeaderLeft>
          
          <HeaderRight>
            <EmployeeAvatars>
              {members1.map((member) => {
                if (!member.employeeName || member.employeeName.trim() === "") {
                  return null;
                }
                return (
                  <EmployeeAvatar
                    key={member.employeeId}
                    title={member.employeeName}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const calculatedPosition = {
                        top: rect.bottom + window.scrollY + 10,
                        left: rect.left + window.scrollX,
                      };
                      fetchEmployeeCards(member, boardId, calculatedPosition);
                    }}
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.employeeName)}&background=random&color=fff`}
                      alt={member.employeeName}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                      }}
                    />
                  </EmployeeAvatar>
                );
              })}
            </EmployeeAvatars>

            <IconGroup>
              <CalendarIconButton
                onClick={() => setIsCalendarVisible(!isCalendarVisible)}
                title="Toggle Calendar View"
              >
                <FaCalendarAlt />
              </CalendarIconButton>
            </IconGroup>
          </HeaderRight>
        </HeaderBanner>

        <AnimatePresence>
          {selectedEmployee && (
            <EmployeeCardsWrapper
              top={avatarPosition.top}
              left={avatarPosition.left}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <EmployeeCardsContainer>
                <EmployeeCardsHeader>
                  <h3>{selectedEmployee.employeeName}'s Tasks</h3>
                  <ModalCloseButton 
                    onClick={() => setSelectedEmployee(null)}
                    style={{ padding: '2px', color: 'white' }}
                  >
                    <FaTimes size={14} />
                  </ModalCloseButton>
                </EmployeeCardsHeader>

                <EmployeeCardsList>
                  {employeeCards.map((card) => (
                    <EmployeeCardItem key={card.cardId}>
                      <strong>{card.cardName}</strong> (Column: {card.columnId})
                    </EmployeeCardItem>
                  ))}
                </EmployeeCardsList>
              </EmployeeCardsContainer>
            </EmployeeCardsWrapper>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCalendarVisible && (
            <CalendarContainer>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                <ModalCloseButton onClick={() => setIsCalendarVisible(false)}>
                  <FaTimes />
                </ModalCloseButton>
              </div>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "calc(100% - 40px)", width: "100%" }}
              />
            </CalendarContainer>
          )}
        </AnimatePresence>

        <BoardGrid>
          <Column
            id="do"
            title="Do"
            cards={columns.do}
            moveCard={moveCard}
            openModal={openModal}
            addCard={addCard}
            setColumns={setColumns}
            showAddCardButton={true}
          />
          <Column
            id="doing"
            title="Doing"
            cards={columns.doing}
            moveCard={moveCard}
            openModal={openModal}
            setColumns={setColumns}
          />
          <Column
            id="done"
            title="Done"
            cards={columns.done}
            moveCard={moveCard}
            openModal={openModal}
            setColumns={setColumns}
          />
          <Column
            id="hold"
            title="Hold"
            cards={columns.hold}
            moveCard={moveCard}
            openModal={openModal}
            setColumns={setColumns}
          />
        </BoardGrid>

        <AnimatePresence>
          {isOpen && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ModalContainer
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
              >
                <ModalHeader>
                  <ModalHeaderTitle>
                    <FaRegCreditCard size={18} style={{ color: "var(--primary-accent)" }} />
                    {isEditing ? (
                      <CardNameInput
                        type="text"
                        value={editedCardName}
                        onChange={(e) => setEditedCardName(e.target.value)}
                        onBlur={() => {
                          setIsEditing(false);
                          handleEditCardName();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setIsEditing(false);
                            handleEditCardName();
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <CardNameText onClick={() => setIsEditing(true)}>
                        {editedCardName}
                      </CardNameText>
                    )}
                  </ModalHeaderTitle>
                  <ModalCloseButton onClick={closeModal}>
                    <FaTimes />
                  </ModalCloseButton>
                </ModalHeader>

                <ModalContent>
                  <ModalLeft>
                    <DetailGroup>
                      <DetailLabel>Assigned Members</DetailLabel>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {members.length > 0 ? (
                          members.map((member, idx) => {
                            let imageUrl = member.profilePicture;
                            if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("data:")) {
                              const cleanPath = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
                              imageUrl = `${Trackerbaseurl}${cleanPath}`;
                            }

                            return (
                              <React.Fragment key={idx}>
                                {imageUrl ? (
                                  <CardMemberImage
                                    src={imageUrl}
                                    alt={member.employeeName}
                                    title={member.employeeName}
                                    style={{ width: '32px', height: '32px' }}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <CardMemberAvatar
                                    bgColor={getBackgroundColor(member.employeeName)}
                                    title={member.employeeName}
                                    style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}
                                  >
                                    {member.employeeName.charAt(0).toUpperCase()}
                                  </CardMemberAvatar>
                                )}
                              </React.Fragment>
                            );
                          })
                        ) : (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No members assigned yet</span>
                        )}
                      </div>
                    </DetailGroup>

                    <Description
                      boardId={boardId}
                      boardName={boardName}
                      cardId={cardId}
                      cardName={cardName}
                    />

                    <Comment
                      boardId={boardId}
                      boardName={boardName}
                      cardId={cardId}
                    />
                  </ModalLeft>

                  <ModalRight>
                    <DetailGroup>
                      <DetailLabel>Status / Column</DetailLabel>
                      <DetailValue style={{ textTransform: 'capitalize', fontWeight: 600, color: 'var(--primary-accent)' }}>
                        {modalContent.boardName}
                      </DetailValue>
                    </DetailGroup>
                    
                    <DetailGroup>
                      <DetailLabel>Timeline</DetailLabel>
                      <DateBoxWrapper>
                        <DateRow>
                          <strong>Start:</strong>
                          <span style={{ fontWeight: 600 }}>
                            {modalContent.startdate
                              ? modalContent.startdate.toLocaleDateString()
                              : "—"}
                          </span>
                        </DateRow>
                        <DateRow>
                          <strong>Due Date:</strong>
                          <span 
                            style={{ 
                              fontWeight: 600, 
                              color: modalContent.enddate && isOverdue(modalContent.enddate, modalContent.columnId) ? "#ef4444" : "inherit" 
                            }}
                          >
                            {modalContent.enddate
                              ? modalContent.enddate.toLocaleDateString()
                              : "—"}
                          </span>
                        </DateRow>
                      </DateBoxWrapper>
                    </DetailGroup>

                    <div style={{ display: 'flex', gap: '24px' }}>
                      <DetailGroup style={{ flex: 1 }}>
                        <DetailLabel>Created By</DetailLabel>
                        <DetailValue style={{ fontWeight: 500 }}>
                          {modalContent.created_by_name || "Unknown"}
                        </DetailValue>
                      </DetailGroup>
                      <DetailGroup style={{ flex: 1 }}>
                        <DetailLabel>Created At</DetailLabel>
                        <DetailValue style={{ fontWeight: 500 }}>
                          {modalContent.created_date
                            ? new Date(modalContent.created_date).toLocaleDateString()
                            : "—"}
                        </DetailValue>
                      </DetailGroup>
                    </div>

                    <Addmembers
                      cardId={cardId}
                      boardId={boardId}
                      cardName={cardName}
                      onMemberUpdate={() =>
                        fetchMembers(cardId, boardId, cardName)
                      }
                    />
                    
                    <DateComponent
                      cardId={cardId}
                      boardId={boardId}
                      employeeId={employeeId}
                      existingStartDate={modalContent.startdate}
                      onDateUpdate={handleInstantDateUpdate}
                    />
                  </ModalRight>
                </ModalContent>
              </ModalContainer>
            </ModalOverlay>
          )}
        </AnimatePresence>
      </DndProvider>

      {showDeleteCardConfirm && (
        <ModalOverlay onClick={() => setShowDeleteCardConfirm(false)}>
          <ConfirmModalContainer onClick={(e) => e.stopPropagation()}>
            <ConfirmModalHeader>
              <h3>Delete Task</h3>
              <ConfirmCloseButton onClick={() => setShowDeleteCardConfirm(false)}>
                <FaTimes />
              </ConfirmCloseButton>
            </ConfirmModalHeader>
            <ConfirmModalBody>
              Are you sure you want to delete this task? This action cannot be undone.
            </ConfirmModalBody>
            <ConfirmButtonGroup>
              <ConfirmCancelButton onClick={() => setShowDeleteCardConfirm(false)}>Cancel</ConfirmCancelButton>
              <ConfirmDeleteButton
                onClick={() => {
                  if (cardToDelete) {
                    handleRemoveCard(cardToDelete.id, cardToDelete.columnId);
                  }
                  setShowDeleteCardConfirm(false);
                }}
              >
                Delete
              </ConfirmDeleteButton>
            </ConfirmButtonGroup>
          </ConfirmModalContainer>
        </ModalOverlay>
      )}
    </TodolistContainer>
  );
};

const ConfirmModalContainer = styled(motion.div)`
  background-color: white;
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 2100;
`;

const ConfirmModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 700;
    color: #0f172a;
  }
`;

const ConfirmCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    color: var(--text-main);
  }
`;

const ConfirmModalBody = styled.div`
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const ConfirmButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

const ConfirmCancelButton = styled.button`
  background: transparent;
  border: 1px solid #d1d5db;
  color: #4b5563;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const ConfirmDeleteButton = styled.button`
  background: #ef4444;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
  }
`;

export default DragAndDropCards;