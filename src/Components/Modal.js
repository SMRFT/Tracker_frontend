import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa'; // Close Icon
import { FaRegCreditCard } from "react-icons/fa";
import Date from './Dates';
import Addmembers from './Addmembers';
import Description from './Description';
import Comment from './Comment';

const Modal = () => {
  const [modalContent, setModalContent] = useState({ cardName: "", cardId: "", boardName: "" ,boardId:""});
  const [isOpen, setIsOpen] = useState(false);
  const [editedCardName, setEditedCardName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [columns, setColumns] = useState({
    do: [],
    doing: [],
    done: [],
    hold: [],
  });

  const handleEditCardName = () => {
    fetch(`https://tracker.shinovadatabase.in/cards/${modalContent.cardId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardName: editedCardName }),
    })
      .then((response) => {
        if (response.ok) {
          const updatedColumns = { ...columns };
          const updatedCards = updatedColumns[modalContent.boardName].map((card) =>
            card.cardId === modalContent.cardId ? { ...card, cardName: editedCardName } : card
          );
          setColumns({ ...updatedColumns, [modalContent.boardName]: updatedCards });
          setIsModalOpen(false);
        }
      })
      .catch((error) => console.error("Error updating card name:", error));
  };

  return (
    <>
      <OpenButton onClick={openModal}>Open Modal</OpenButton>

      {isOpen && (
        <ModalOverlay>
          <ModalContainer >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaRegCreditCard style={{ fontSize: '1.2rem', marginRight: '10px' }} />
            <div style={{ fontSize: '1.5rem' }}>Task 1</div>
        </div>

          <input
              type="text"
              value={editedCardName}
              onChange={(e) => setEditedCardName(e.target.value)}
              style={styles.input}
              placeholder={modalContent.cardName}
            />
            <CloseIcon onClick={closeModal}>
              <FaTimes />
            </CloseIcon>
            <ModalContent>
            {/* <Date/>
            <Addmembers/> */}
            <Description/>
            <Comment/>
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </>
  );
};

const styles = {
input: {
    padding: "5px",
    width: "50%",
    marginBottom: "5px",
    marginRight: "15px",
    display: 'none',
  },
  addCardButton: {
    padding: "5px 10px",
    backgroundColor: "#5cb85c",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
    marginBottom: "5px",
  },
}

// Styled components for the modal

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  position: relative;
  background-color: white;
  padding: 20px;
  width: 700px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const CloseIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #333;

  &:hover {
    color: red;
  }
`;

const ModalContent = styled.div`
  h2 {
    margin-bottom: 10px;
  }
  p {
    margin-bottom: 20px;
  }
`;

const OpenButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
`;

export default Modal;
