import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useLocation, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaCalendarAlt } from 'react-icons/fa';
import Notification from './Notification';
import { FaTimes,FaPlus } from 'react-icons/fa'; // Close Icon
import { FaRegCreditCard } from "react-icons/fa";
import Date from './Dates';
import Addmembers from './Addmembers';
import Description from './Description';
import Comment from './Comment';
import { format, parseISO } from 'date-fns';

import { VscWhitespace } from "react-icons/vsc";
const ItemType = {
  CARD: "card",
};
const localizer = momentLocalizer(moment);
const Card = ({ id, index, columnId, text, moveCard, openModal }) => {
  const [, drag] = useDrag({
    type: ItemType.CARD,
    item: { id, index, columnId },
  });

  return (
    <div ref={drag} style={styles.card} onClick={() => openModal(text)}>
      <div style={styles.cardContent}>
        <span>{text || "No Name"}</span>
        {/* Pen icon on the right */}
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
      const toIndex = cards.findIndex(card => card.id === cardId);

      if (fromColumnId === id) {
        // Moving within the same column
        if (toIndex !== -1 && fromIndex !== toIndex) {
          moveCard(fromIndex, id, toIndex, id);
          item.index = toIndex; // Update item index to reflect new position
        }
      } else {
        // Moving to a different column
        const toIndex = cards.length; // Place at the end of the column
        moveCard(fromIndex, fromColumnId, toIndex, id);
        item.columnId = id; // Update item columnId to reflect new column
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

  const handleRemoveCard = (cardId) => {
    console.log("Deleting card with ID:", cardId);  // Log the cardId
    fetch(`http://127.0.0.1:8000/cards/${cardId}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (response.ok) {
            const updatedCards = cards.filter((card) => card.cardId !== cardId);
            const updatedColumns = { ...columns, [id]: updatedCards };
            setColumns(updatedColumns);
        } else {
            console.error("Failed to delete the card.");
        }
    })
    .catch((error) => {
        console.error("Error deleting card:", error);
    });
  };

  return (
    <div ref={drop} style={{ ...styles.column, backgroundColor }}>
      <h3 style={styles.columnTitle}>{title}</h3>
      {cards.map((card, index) => (
        <div key={card.cardId} style={styles.cardContainer}>
          <Card
            id={card.cardId}
            index={index}
            columnId={id}
            text={card.cardName}
            moveCard={moveCard}
            openModal={(cardName) => openModal(card.cardName, card.cardId)} // Pass the required parameters
          />
          <button
            onClick={() => handleRemoveCard(card.cardId)}
            style={styles.removeCardButton}
          >
            ×
          </button>
        </div>
      ))}
      {showAddCardButton && (
        <div style={styles.addCardContainer}>
          {isAddingCard ? (
            <>
              <input
                type="text"
                placeholder="Enter a name for this card..."
                value={inputValue}
                onChange={handleInputChange}
                style={styles.input}
              />
              <div style={styles.addCardActions}>
                <button onClick={handleAddCard} style={styles.addCardButton}>
                  Add card
                </button>
                <button
                  onClick={() => setIsAddingCard(false)}
                  style={styles.cancelButton}
                >
                  ×
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setIsAddingCard(true)}
              style={styles.addInitialCardButton}
            >
              + Add a card
            </button>
          )}
        </div>
      )}
    </div>
  );
};
const DragAndDropCards = ({ boards, setBoards }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {employeeId, employeeName,boardId, boardName,boardColor } = location.state || {};
  const [modalContent, setModalContent] = useState({ cardName: "", cardId: "", boardName: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editedCardName, setEditedCardName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState([]);
  console.log('employeename',employeeId)
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
 

   // Handle saving the edited card name
   const handleEditCardName = () => {
    fetch(`http://127.0.0.1:8000/cards/${modalContent.cardId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardName: editedCardName }),
    })
      .then((response) => {
        if (response.ok) {
          // Update the card name in the columns
          const updatedColumns = { ...columns };
          const updatedCards = updatedColumns[modalContent.boardName].map((card) =>
            card.cardId === modalContent.cardId ? { ...card, cardName: editedCardName } : card
          );
          setColumns({ ...updatedColumns, [modalContent.boardName]: updatedCards });
        }
      })
      .catch((error) => console.error("Error updating card name:", error));
  };


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardId, setCardId] = useState(""); // State for current cardId
  const [cardName, setCardName] = useState(""); // State for current cardName
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [events, setEvents] = useState([]); // State for calendar events
  const [cards, setCards] = useState([]);
  useEffect(() => {
    // const boardId = "1";  // Example board ID
    // const employeeId = "10555";  // Logged-in employee ID
    fetchCards(boardId, employeeId);
  }, []);
  

  const fetchCards = (boardId, employeeId) => {
    fetch(`http://127.0.0.1:8000/cards/?boardId=${boardId}&employeeId=${employeeId}`)
      .then((response) => response.json())
      .then((data) => {
        // Update the card data with parsed startdate and enddate
        const parsedData = data.map(card => ({
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
  
        // Map the parsed data to calendar events
        const calendarEvents = parsedData.map(card => ({
          title: card.cardName,
          start: card.startdate || new Date(),  
          end: card.enddate || new Date(),
          allDay: true,
        }));
  
        setEvents(calendarEvents);
      })
      .catch((error) => console.error("Error fetching cards:", error));
  };
  
  
  
  
  

  const moveCard = (fromIndex, fromColumnId, toIndex, toColumnId) => {
    const updatedColumns = { ...columns };
  
    if (!updatedColumns[fromColumnId] || !updatedColumns[toColumnId]) {
      console.error('Invalid column IDs:', fromColumnId, toColumnId);
      return;
    }
  
    const [movedCard] = updatedColumns[fromColumnId].splice(fromIndex, 1);
  
    if (!movedCard) {
      console.error('Card not found:', { fromIndex, fromColumnId });
      return;
    }
  
    updatedColumns[toColumnId].splice(toIndex, 0, movedCard);
  
    setColumns(updatedColumns);
  
    fetch(`http://127.0.0.1:8000/cards/${movedCard.cardId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ columnId: toColumnId }),
    }).catch((error) => {
      console.error("Error updating card column:", error);
    });
  };



  const addCard = async (columnId, text) => {
    const newCard = {
      cardId,
      cardName: text || `Task ${Date.now()}`,
      boardId,
      columnId,
      employeeId,
      employeeName,
      boardName,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/cards/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCard),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Card added:", data);

        // Store cardId and cardName in localStorage
        localStorage.setItem('cardId', data.cardId);
        localStorage.setItem('cardName', data.cardName);

        const updatedColumns = { ...columns };
        updatedColumns[columnId].push({
          cardId: data.cardId,
          cardName: data.cardName,
        });
        setColumns(updatedColumns);
      } else {
        console.error("Error adding card:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving card:", error);
    }
  };

  const openModal = (cardName, cardId, boardName,employeeId) => {
    const selectedCard = cards.find((card) => card.cardId === cardId);
    if (selectedCard) {
      setCardName(cardName);
      setCardId(cardId);
      setModalContent({ 
        cardName, 
        cardId, 
        boardName, 
        boardId, 
        employeeId,
        startdate: selectedCard.startdate ? selectedCard.startdate : null, 
        enddate: selectedCard.enddate ? selectedCard.enddate : null 
      });
      setEditedCardName(cardName); // Initialize with the card name
      setIsModalOpen(true);
      setIsOpen(true);
    }
  };
  
  


  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/add_member_to_card/?cardId=${cardId}&boardId=${boardId}&cardName=${cardName}`);
        const data = await response.json();
        if (response.ok) {
          console.log('Fetched members:', data);
          setMembers(data); // Ensure data is an array
        } else {
          console.error('Error fetching members:', data.error);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, [cardId, boardId, cardName]);

  return (
    <TodolistContainer style={{ background: boardColor, minHeight: '100vh' }}>
    <DndProvider backend={HTML5Backend}>
    <Notification employeeId={employeeId}/>
  <div>
      <FaCalendarAlt
        style={{color:"white",fontSize:"1.6rem",float:"right",marginRight:"40px"}}
        onClick={() => setIsCalendarVisible(!isCalendarVisible)}
      />
    </div>
    {isCalendarVisible && (
      <div style={styles.calendarContainer}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={styles.calendar}
          // Add a custom `eventPropGetter` if needed to customize event styles
          // eventPropGetter={(event) => ({ style: { backgroundColor: 'lightblue' } })}
        />
      </div>
    )}
      <div style={styles.board}>
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
      </div>
      {isOpen && (
  <ModalOverlay>
    <ModalContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        
        {/* Left Section */}
        <div style={{ flex: '1', marginRight: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <FaRegCreditCard style={{ fontSize: '1.2rem', marginRight: '10px' }} />
            {isEditing ? (
              <input
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
              <span
                style={{ cursor: 'pointer', fontSize: '1.5rem'}}
                onClick={() => setIsEditing(true)}
              >
                {editedCardName}
              </span>
            )}
          </div>

      {/* Members and Dates Wrapper */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        
        {/* Members */}
        <div style={{ flex: 1, marginRight: '20px' }}>
          <Label>Members</Label>
          <Container>
            {members.length > 0 ? (
              members.map((member) => (
                <MemberCircle key={member.employeeId}>
                  {member.employeeName.charAt(0)} {/* First letter of the member's name */}
                </MemberCircle>
              ))
            ) : (
              <p>No members found.</p>
            )}
          </Container>
        </div>
        
        {/* Dates */}
        <div style={{ flex: 1 }}>
          <Label>Due Date</Label>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', whiteSpace: 'nowrap',gap:"10px" }}>
          <div>
            <strong>Start Date: </strong>
            <span>{modalContent.startdate ? modalContent.startdate.toLocaleDateString() : 'N/A'}</span>
          </div>
          <div>
            <strong>End Date: </strong>
            <span>{modalContent.enddate ? modalContent.enddate.toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
        </div>  
      </div>

          {/* Description */}
          <Description boardId={boardId} boardName={boardName} cardId={cardId} cardName={cardName} />

          {/* Comments */}
          <Comment boardId={boardId} boardName={boardName} cardId={cardId} />
        </div>

        {/* Right Section */}
        <div style={{ flex: '0.3', marginRight: '20px',marginTop:"20px",display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          
          {/* Add Members and Date Components */}
          <Addmembers cardId={cardId} />
          <Date cardId={cardId} />
        </div>
      </div>

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

const TodolistContainer = styled.div`
    background-color: ${(props) => props.bgColor || '#FFFFFF'};
    min-height: 100vh;
    padding: 20px;
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
`;
const ModalContainer = styled.div`
  background-color: #F0F1F4;
  width: 55%;
  padding: 20px;
  position: relative;
  max-height: 80vh; /* Adjust this based on your needs */
  overflow-y: auto; /* Enables scrolling when content exceeds max-height */
  scrollbar-width: thin;
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)";
  border-radius:15px;
`;
const CloseIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: grey;
`;

const Label = styled.label`
  flex-shrink: 0;
  width: 100px;  /* Adjust this value as per your requirement */
  font-size: 16px;
  color: black;
  border: single;
`;

const Container = styled.div`
  color: black;
  display: flex;
  align-items: center;
  gap: 10px;
`;
const MemberCircle = styled.div`
  width: 40px;
  height: 40px;
  background-color: #5E3EC8; /* Purple color */
  color: white;
  font-weight: bold;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  text-transform: uppercase;
`;

const styles = {
  board: {
    display: "flex",
    justifyContent: "space-around",
    padding: "20px",
    marginTop: '80px',
  },
  column: {
    width: "250px",
    padding: "10px",
    borderRadius: "5px",
    minHeight: "400px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    gap:"10px",
  },
  columnTitle: {
    textAlign: "center",
    marginBottom: "10px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
    textAlign: 'left', // Align text to the left
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    width: "200px",
  },
  cardContent: {
    display: "flex", // Flexbox to align text and icon
    justifyContent: "space-between", // Space between text and icon
    alignItems: "center", // Vertically align items
  },
  penIcon: {
    color: "#6C757D", // Grey color for the pen icon
    cursor: "pointer",
    marginLeft: "10px", // Add space between text and icon
  },
  cardContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  removeCardButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "red",
    fontSize: "18px",
    cursor: "pointer",
  },
  addCardContainer: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  addCardActions: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '10px', // Adjust space between button and icon
  },
  input: {
    padding: "5px",
    width: "50%",
    marginBottom: "5px",
    marginRight: "15px",
  },
  addCardButton: {
    padding: "5px 10px",
    backgroundColor: "#5CB85C",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
    marginBottom: "5px",
  },
  addInitialCardButton: {
    padding: "5px 10px",
    backgroundColor: "#5CB85C",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "red",
    fontSize: "18px",
    cursor: "pointer",
  },
  calendarContainer: {
    position: 'fixed',
    top: 50,
    left: 260,
    width: '80vw',
    height: '90vh',
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '15px',
    boxShadow: 'none',
    zIndex: 10, // Lower z-index to keep it below the modal
    overflow: 'hidden', // Prevent scrollbars if needed
    padding: '10px',
  },
};



export default DragAndDropCards;