"use client"

import React from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle } from "lucide-react"

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
  width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`

const WarningIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(236, 87, 87, 0.1);
  margin-right: 16px;
  
  svg {
    color: #ec5757;
  }
`

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #ec5757;
  margin: 0;
`

const ModalDescription = styled.p`
  margin-bottom: 24px;
  font-size: 15px;
  line-height: 1.6;
  color: #7e88c3;
`

const BoardName = styled.span`
  font-weight: 600;
  color: #333;
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

const DeleteBoardModal = ({ boardName, onDelete, onClose }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

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
          <ModalHeader>
            <WarningIcon>
              <AlertTriangle size={20} />
            </WarningIcon>
            <ModalTitle>Delete Board</ModalTitle>
          </ModalHeader>
          <ModalDescription>
            Are you sure you want to delete <BoardName>"{boardName}"</BoardName>? This action cannot be undone and all
            associated tasks will be permanently removed.
          </ModalDescription>
          <ButtonContainer>
            <ModalButton secondary onClick={onClose}>
              Cancel
            </ModalButton>
            <ModalButton danger onClick={onDelete}>
              Delete Board
            </ModalButton>
          </ButtonContainer>
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  )
}

export default DeleteBoardModal

