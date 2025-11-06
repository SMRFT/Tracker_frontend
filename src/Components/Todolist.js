import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaCalendarAlt } from "react-icons/fa";
import Notification from "./Notification";
import { FaTimes, FaPlus } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa";
import DateComponent from "./Dates";
import Addmembers from "./Addmembers";
import Description from "./Description";
import Comment from "./Comment";
import { isBefore, format, parseISO } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "./apiRequest";

const DragAndDropCards = ({ boards, setBoards }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeId, employeeName, boardId, boardName, boardColor } =
    location.state || {};
  const [modalContent, setModalContent] = useState({
    cardName: "",
    cardId: "",
    boardName: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedCardName, setEditedCardName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [cardMembers, setCardMembers] = useState([]);
  const [cardAdded, setCardAdded] = useState(false);
  const Trackerbaseurl = process.env.REACT_APP_BACKEND_TRACKER_BASE_URL;

  const ItemType = {
    CARD: "card",
  };
  const localizer = momentLocalizer(moment);

const Card = ({ id, index, columnId, text, createdByName, moveCard, openModal }) => {
  const [, drag] = useDrag({
    type: ItemType.CARD,
    item: { id, index, columnId },
  });

  return (
    <div ref={drag} style={styles.card} onClick={() => openModal(text)}>
      <div style={styles.cardContent}>
        <div>
          <strong>{text || "No Name"}</strong>
          {createdByName && (
            <p style={{ fontSize: "12px", color: "#777", marginTop: "4px" }}>
              Created by: {createdByName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


  const Column = ({
    id,
    title,
    cards = [],
    moveCard,
    openModal,
    addCard,
    columns,
    setColumns,
    backgroundColor,
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

    const handleRemoveCard = async (cardId) => {
      console.log("Deleting card with ID:", cardId);
      const userRole = localStorage.getItem("role");

      try {
        const result = await apiRequest(
          `${Trackerbaseurl}cards/${cardId}/${boardId}/${userRole}/`,
          "DELETE"
        );

        if (result.success) {
          const successMessage =
            result.data?.message || "Card deleted successfully!";
          toast.success(successMessage, {
            autoClose: 3000,
            position: "top-right",
          });

          setColumns((prevColumns) => {
            const updatedCards = prevColumns[id].filter(
              (card) => card.cardId !== cardId
            );
            return { ...prevColumns, [id]: updatedCards };
          });
        } else {
          const errorMessage =
            result.data?.error || result.error || "Failed to delete the card.";
          toast.error(errorMessage, {
            autoClose: 3000,
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("Error deleting card:", error);
        toast.error("Error deleting card. Please try again later.", {
          autoClose: 3000,
          position: "top-right",
        });
      }
    };

    const getBackgroundColor = (name) => {
      const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FF8C33"];
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % colors.length;
      return colors[index];
    };

    return (
      <ColumnWrapper ref={drop} backgroundColor={backgroundColor}>
        <ColumnTitle>{title}</ColumnTitle>
        {cards.map((card, index) => (
          <CardContainer key={card.cardId}>
            <CardRow>
<Card
  id={card.cardId}
  index={index}
  columnId={id}
  text={card.cardName}
  createdByName={card.created_by_name}  // 👈 new prop
  moveCard={moveCard}
  openModal={() => openModal(card.cardName, card.cardId)}
/>
              <RemoveButton onClick={() => handleRemoveCard(card.cardId)}>
                ×
              </RemoveButton>
            </CardRow>
            <ToastContainer />
            <MemberList>
              {cardMembers[card.cardId]?.length > 0 ? (
                cardMembers[card.cardId].map((member, idx) => (
                  <MemberItem key={idx}>
                    {member.profilePicture ? (
                      <MemberImage
                        src={member.profilePicture}
                        alt={member.employeeName}
                        title={member.employeeName}
                      />
                    ) : (
                      <MemberInitial
                        bgColor={getBackgroundColor(member.employeeName)}
                        title={member.employeeName}
                      >
                        {member.employeeName.charAt(0).toUpperCase()}
                      </MemberInitial>
                    )}
                  </MemberItem>
                ))
              ) : (
                <NoMembers>No members</NoMembers>
              )}
            </MemberList>
          </CardContainer>
        ))}
        {showAddCardButton &&
          (localStorage.getItem("role") === "Admin" ||
            localStorage.getItem("role") === "HOD") && (
            <AddCardContainer>
              {isAddingCard ? (
                <>
                  <AddCardInput
                    type="text"
                    placeholder="Enter a name for this card..."
                    value={inputValue}
                    onChange={handleInputChange}
                  />
                  <AddCardActions>
                    <AddCardButton onClick={handleAddCard}>
                      Add card
                    </AddCardButton>
                    <CancelButton onClick={() => setIsAddingCard(false)}>
                      ×
                    </CancelButton>
                  </AddCardActions>
                </>
              ) : (
                <AddInitialCardButton onClick={() => setIsAddingCard(true)}>
                  + Add a card
                </AddInitialCardButton>
              )}
            </AddCardContainer>
          )}
      </ColumnWrapper>
    );
  };

  console.log("employeename", employeeId);

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
        console.log("columns:", columns);
        console.log("modalContent.boardName:", modalContent.boardName);
        console.log(
          "updatedColumns[modalContent.boardName]:",
          columns[modalContent.boardName]
        );

        if (
          columns &&
          modalContent.boardName &&
          columns[modalContent.boardName]
        ) {
          const updatedColumns = { ...columns };
          const updatedCards = updatedColumns[modalContent.boardName].map(
            (card) =>
              card.cardId === modalContent.cardId
                ? { ...card, cardName: editedCardName }
                : card
          );
          setColumns({
            ...updatedColumns,
            [modalContent.boardName]: updatedCards,
          });
        } else {
          console.log("Skipping local state update due to missing data");
        }

        console.log("About to call fetchCardsWithMembers");
        await fetchCardsWithMembers(boardId);
        console.log("fetchCardsWithMembers completed");
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
      }));

      const updatedColumns = {
        do: parsedData.filter((card) => card.columnId === "do"),
        doing: parsedData.filter((card) => card.columnId === "doing"),
        done: parsedData.filter((card) => card.columnId === "done"),
        hold: parsedData.filter((card) => card.columnId === "hold"),
      };

      setColumns(updatedColumns);
      setCards(parsedData);

      const memberRequests = parsedData.map(async (card) => {
        const memberResult = await apiRequest(
          `${Trackerbaseurl}add_member_to_card/?cardId=${card.cardId}&boardId=${boardId}&cardName=${card.cardName}`
        );
        return {
          cardId: card.cardId,
          data: memberResult.success ? memberResult.data : [],
        };
      });

      const memberResponses = await Promise.all(memberRequests);

      const membersData = {};
      memberResponses.forEach(({ cardId, data }) => {
        membersData[cardId] = data;
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
        console.log("Card added:", data);

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

  const openModal = (cardName, cardId, boardName) => {
    const selectedCard = cards.find((card) => card.cardId === cardId);

    const defaultStartDate = selectedCard?.startdate || null;
    const defaultEndDate = selectedCard?.enddate || null;

    setCardName(cardName || "No Card Name");
    setCardId(cardId || null);
    setModalContent({
      cardName: cardName || "No Card Name",
      cardId: cardId || null,
      boardName: boardName || "No Board Name",
      boardId: boardId || null,
      startdate: defaultStartDate,
      enddate: defaultEndDate,
      columnId: selectedCard?.columnId || null,
    });

    setEditedCardName(cardName || "");
    setIsModalOpen(true);
    setIsOpen(true);
  };

  const fetchMembers = async (targetCardId, targetBoardId, targetCardName) => {
    try {
      const result = await apiRequest(
        `${Trackerbaseurl}add_member_to_card/?cardId=${targetCardId}&boardId=${targetBoardId}&cardName=${targetCardName}`
      );

      if (result.success) {
        console.log("Fetched members:", result.data);
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
      "#FF9A9E",
      "#FFC93C",
      "#84FAB0",
      "#8FD3F4",
      "#5E3EC8",
      "#FF6F61",
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
        if (result.rawResponse) {
          console.error("Server returned:", result.rawResponse);
        }
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

  const fetchEmployeeCards = (employeeId, boardId) => {
    apiRequest(`${Trackerbaseurl}cards/${employeeId}/${boardId}/`)
      .then((response) => {
        const data = response.data;
        if (data.cards) {
          setEmployeeCards(data.cards);
        } else {
          console.error("Failed to fetch cards:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching cards:", error);
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

  return (
    <TodolistContainer style={{ background: boardColor }}>
      <DndProvider backend={HTML5Backend}>
        <IconWrapper>
          <EmployeeAvatars>
            {members1.map((member) => (
              <EmployeeAvatar
                key={member.employeeId}
                title={member.employeeName}
                onClick={() => {
                  setSelectedEmployee(member);
                  fetchEmployeeCards(member.employeeId, boardId);
                }}
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${member.employeeName}&background=random`}
                  alt={member.employeeName}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                  }}
                />
              </EmployeeAvatar>
            ))}
          </EmployeeAvatars>

          <IconGroup>
            <CalendarIcon
              onClick={() => setIsCalendarVisible(!isCalendarVisible)}
            />
            <Notification employeeId={employeeId} />
          </IconGroup>
        </IconWrapper>

        {selectedEmployee && (
          <EmployeeCardsWrapper>
            <EmployeeCardsContainer>
              <EmployeeCardsHeader>
                <h3>{selectedEmployee.employeeName}'s Cards</h3>
                <FaTimes
                  style={{
                    color: "white",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                  }}
                  onClick={() => setSelectedEmployee(null)}
                />
              </EmployeeCardsHeader>

              <EmployeeCardsList>
                {employeeCards.length > 0 ? (
                  employeeCards.map((card) => (
                    <EmployeeCardItem key={card.cardId}>
                      <strong>{card.cardName}</strong> (Board: {card.boardName})
                    </EmployeeCardItem>
                  ))
                ) : (
                  <EmployeeCardItem>No cards found</EmployeeCardItem>
                )}
              </EmployeeCardsList>
            </EmployeeCardsContainer>
          </EmployeeCardsWrapper>
        )}

        {isCalendarVisible && (
          <CalendarContainer>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%", width: "100%" }}
            />
          </CalendarContainer>
        )}

        <Board>
          <Column
            id="do"
            title="Do"
            cards={columns.do}
            moveCard={moveCard}
            openModal={openModal}
            addCard={addCard}
            columns={columns}
            setColumns={setColumns}
            backgroundColor="#F1F2F4"
            showAddCardButton={true}
          />
          <Column
            id="doing"
            title="Doing"
            cards={columns.doing}
            moveCard={moveCard}
            openModal={openModal}
            columns={columns}
            setColumns={setColumns}
            backgroundColor="#F1F2F4"
          />
          <Column
            id="done"
            title="Done"
            cards={columns.done}
            moveCard={moveCard}
            openModal={openModal}
            columns={columns}
            setColumns={setColumns}
            backgroundColor="#F1F2F4"
          />
          <Column
            id="hold"
            title="Hold"
            cards={columns.hold}
            moveCard={moveCard}
            openModal={openModal}
            columns={columns}
            setColumns={setColumns}
            backgroundColor="#F1F2F4"
          />
        </Board>

        {isOpen && (
          <ModalOverlay>
            <ModalContainer>
              <ModalContent>
                <ModalLeft>
                  <CardNameSection>
                    <FaRegCreditCard style={{ fontSize: "1.2rem", marginRight: "10px" }} />
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
                      />
                    ) : (
                      <CardNameText onClick={() => setIsEditing(true)}>
                        {editedCardName}
                      </CardNameText>
                    )}
                  </CardNameSection>

                  <MembersAndDates>
                    <MembersSection>
                      <Label>Members</Label>
                      <MembersContainer>
                        {members.length > 0 ? (
                          members.map((member, idx) => (
                            <MemberCircle
                              key={idx}
                              bgColor={getBackgroundColor(member.employeeName)}
                            >
                              {member.employeeName.charAt(0)}
                            </MemberCircle>
                          ))
                        ) : (
                          <p>No members found.</p>
                        )}
                      </MembersContainer>
                    </MembersSection>

                    <DatesSection>
                      <Label>Due Date</Label>
                      <DatesWrapper>
                        <DateItem>
                          <strong>Start: </strong>
                          <DateValue
                            isOverdue={
                              modalContent.enddate &&
                              isOverdue(modalContent.enddate, modalContent.columnId)
                            }
                          >
                            {modalContent.startdate
                              ? modalContent.startdate.toLocaleDateString()
                              : "N/A"}
                          </DateValue>
                        </DateItem>
                        <DateItem>
                          <strong>End: </strong>
                          <DateValue
                            isOverdue={
                              modalContent.enddate &&
                              isOverdue(modalContent.enddate, modalContent.columnId)
                            }
                          >
                            {modalContent.enddate
                              ? modalContent.enddate.toLocaleDateString()
                              : "N/A"}
                          </DateValue>
                        </DateItem>
                      </DatesWrapper>
                    </DatesSection>
                  </MembersAndDates>

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
                  <Addmembers
                    cardId={cardId}
                    boardId={boardId}
                    cardName={cardName}
                    onMemberUpdate={() => fetchMembers(cardId, boardId, cardName)}
                  />
                  <DateComponent
                    cardId={cardId}
                    boardId={boardId}
                    employeeId={employeeId}
                    onDateUpdate={() => fetchCardsWithMembers(boardId)}
                  />
                  <ToastContainer />
                </ModalRight>
              </ModalContent>

              <CloseIcon onClick={closeModal}>
                <FaTimes />
              </CloseIcon>
            </ModalContainer>
          </ModalOverlay>
        )}
      </DndProvider>
    </TodolistContainer>
  );
};

// Styled Components
const TodolistContainer = styled.div`
  background-color: ${(props) => props.bgColor || "#FFFFFF"};
  min-height: 100vh;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 10px 15px;
  border-radius: 10px;
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 8px;
    gap: 10px;
  }
`;

const EmployeeAvatars = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const EmployeeAvatar = styled.div`
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 480px) {
    width: 25px;
    height: 25px;
  }
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const CalendarIcon = styled(FaCalendarAlt)`
  color: white;
  font-size: 1.6rem;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const EmployeeCardsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const EmployeeCardsContainer = styled.div`
  padding: 15px;
  background: #333;
  border-radius: 10px;
  width: 300px;
  max-width: 100%;

  @media (max-width: 480px) {
    width: 100%;
    padding: 10px;
  }
`;

const EmployeeCardsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  h3 {
    color: white;
    margin: 0;
    font-size: 1rem;

    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }
`;

const EmployeeCardsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const EmployeeCardItem = styled.li`
  color: white;
  padding: 8px 0;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 6px 0;
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
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 10;
  overflow: hidden;
  padding: 10px;

  @media (max-width: 768px) {
    width: 95vw;
    height: 70vh;
    top: 80px;
    padding: 5px;
  }

  @media (max-width: 480px) {
    width: 98vw;
    height: 65vh;
    top: 70px;
  }
`;

const Board = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px;
  gap: 15px;
  overflow-x: auto;

  @media (max-width: 1024px) {
    padding: 15px;
    gap: 10px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

const ColumnWrapper = styled.div`
  width: 250px;
  min-width: 250px;
  padding: 10px;
  border-radius: 8px;
  min-height: 400px;
  background-color: ${(props) => props.backgroundColor || "#F1F2F4"};
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 1024px) {
    width: 220px;
    min-width: 220px;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
    min-height: auto;
    margin-bottom: 15px;
  }
`;

const ColumnTitle = styled.h3`
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.1rem;
  color: #333;

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 10px;
  }
`;

const CardContainer = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;

  @media (max-width: 480px) {
    padding: 8px;
    margin-bottom: 12px;
  }
`;

const CardRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #888;
  padding: 0;
  min-width: 20px;
  flex-shrink: 0;

  &:hover {
    color: #ff0000;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const MemberList = styled.div`
  display: flex;
  margin-top: 8px;
  cursor: pointer;
  flex-wrap: wrap;
  gap: 5px;
`;

const MemberItem = styled.div`
  position: relative;
  display: inline-block;
`;

const MemberImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid white;
  object-fit: cover;
  cursor: pointer;

  @media (max-width: 480px) {
    width: 25px;
    height: 25px;
  }
`;

const MemberInitial = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${(props) => props.bgColor || "#4a90e2"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #fff;

  @media (max-width: 480px) {
    width: 25px;
    height: 25px;
    font-size: 12px;
  }
`;

const NoMembers = styled.p`
  font-size: 12px;
  color: #888;
  margin: 0;
`;

const AddCardContainer = styled.div`
  margin-top: 10px;
`;

const AddCardInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  @media (max-width: 480px) {
    padding: 6px;
    font-size: 13px;
  }
`;

const AddCardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AddCardButton = styled.button`
  padding: 8px 15px;
  background-color: #5cb85c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #4cae4c;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 13px;
  }
`;

const AddInitialCardButton = styled.button`
  width: 100%;
  padding: 8px;
  background-color: #5cb85c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #4cae4c;
  }

  @media (max-width: 480px) {
    padding: 6px;
    font-size: 13px;
  }
`;

const CancelButton = styled.button`
  background: transparent;
  border: none;
  color: red;
  font-size: 20px;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: darkred;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ModalContainer = styled.div`
  background-color: #f0f1f4;
  width: 90%;
  max-width: 900px;
  padding: 20px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 15px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 95%;
    padding: 15px;
    max-height: 85vh;
  }

  @media (max-width: 480px) {
    width: 98%;
    padding: 10px;
    border-radius: 10px;
  }
`;

const ModalContent = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const ModalLeft = styled.div`
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ModalRight = styled.div`
  flex: 0 0 250px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 768px) {
    flex: unset;
    width: 100%;
  }
`;

const CardNameSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 480px) {
    margin-bottom: 10px;
  }
`;

const CardNameInput = styled.input`
  flex: 1;
  font-size: 1.5rem;
  padding: 5px;
  border: 2px solid #4a90e2;
  border-radius: 4px;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    width: 100%;
  }
`;

const CardNameText = styled.span`
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const MembersAndDates = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const MembersSection = styled.div`
  flex: 1;
`;

const DatesSection = styled.div`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const MembersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const MemberCircle = styled.div`
  width: 35px;
  height: 35px;
  background-color: ${(props) => props.bgColor || "#4a90e2"};
  color: white;
  font-weight: bold;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  text-transform: uppercase;

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
`;

const DatesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const DateItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const DateValue = styled.span`
  color: ${(props) => (props.isOverdue ? "red" : "inherit")};
  font-weight: ${(props) => (props.isOverdue ? "bold" : "normal")};
`;

const CloseIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: red;
  z-index: 10;

  &:hover {
    color: darkred;
  }

  @media (max-width: 480px) {
    top: 8px;
    right: 8px;
    font-size: 20px;
  }
`;

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: "5px",
    padding: "10px",
    textAlign: "left",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    flex: 1,
  },
  cardContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};

export default DragAndDropCards;