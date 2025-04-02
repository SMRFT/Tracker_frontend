"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200;
  backdrop-filter: blur(4px);
`

const ModalContent = styled(motion.div)`
  background: white;
  padding: 28px;
  border-radius: 12px;
  width: 380px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`

const ModalTitle = styled.h2`
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 600;
  color: #333;
`

const ModalInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 24px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 16px;
  transition: border 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #7c5dfa;
    box-shadow: 0 0 0 2px rgba(124, 93, 250, 0.2);
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`

const ModalButton = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.2s ease;
  
  ${(props) =>
    props.primary &&
    `
    background: #7c5dfa;
    color: white;
    
    &:hover {
      background: #6c4ae6;
    }
  `}
  
  ${(props) =>
    props.secondary &&
    `
    background: #f8f8fb;
    color: #7e88c3;
    
    &:hover {
      background: #eef0fa;
    }
  `}
  
  ${(props) =>
    props.danger &&
    `
    background: #ec5757;
    color: white;
    
    &:hover {
      background: #ff9797;
    }
  `}
`

const EditBoardModal = ({ boardName, onSave, onClose }) => {
  const [newTitle, setNewTitle] = useState(boardName)

  useEffect(() => {
    // Focus the input when modal opens
    const timer = setTimeout(() => {
      const input = document.getElementById("board-name-input")
      if (input) input.focus()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleSave = () => {
    if (newTitle.trim()) {
      onSave(newTitle)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <ModalContent
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          <ModalTitle>Edit Board Name</ModalTitle>
          <ModalInput
            id="board-name-input"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter board name"
          />
          <ButtonContainer>
            <ModalButton secondary onClick={onClose}>
              Cancel
            </ModalButton>
            <ModalButton primary onClick={handleSave}>
              Save Changes
            </ModalButton>
          </ButtonContainer>
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  )
}

export default EditBoardModal

