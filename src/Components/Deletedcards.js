import React, { useEffect, useState } from "react";
import styled from "styled-components";
import apiRequest from "./apiRequest";

const Container = styled.div`
  padding: 40px;
  background: var(--bg-primary);
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const ScrollArea = styled.div`
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

const Header = styled.div`
  margin-bottom: 40px;
  text-align: center;
  flex-shrink: 0;
`;

const Title = styled.h1`
  color: var(--text-main);
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const Subtitle = styled.p`
  color: var(--text-muted);
  font-size: 1.1rem;
  margin: 0;
`;

const FilterCard = styled.div`
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-subtle);
  flex-shrink: 0;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-end;
  justify-content: center;
  flex-wrap: wrap;
`;

// Multi-select board filter
const BoardFilterWrapper = styled.div`
  position: relative;
  min-width: 180px;
`;

const BoardFilterButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  background: var(--bg-primary);
  color: var(--text-main);
  font-size: 0.95rem;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-accent);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const BoardDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 200;
  max-height: 220px;
  overflow-y: auto;
  padding: 6px 0;

  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { background: var(--border-subtle); border-radius: 4px; }
`;

const BoardOption = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-main);
  transition: background 0.15s;

  &:hover {
    background: rgba(99, 102, 241, 0.08);
  }

  input[type="checkbox"] {
    accent-color: var(--primary-accent);
    width: 15px;
    height: 15px;
    cursor: pointer;
    flex-shrink: 0;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: var(--text-main);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DateInput = styled.input`
  padding: 12px 16px;
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.3s ease;
  min-width: 180px;
  background: var(--bg-primary);
  color: var(--text-main);
  
  &:focus {
    outline: none;
    border-color: var(--primary-accent);
    background: var(--bg-secondary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: brightness(0.8);
  }
`;

const FilterButton = styled.button`
  padding: 12px 32px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ResetButton = styled.button`
  padding: 12px 32px;
  background: var(--bg-secondary);
  color: var(--primary-accent);
  border: 2px solid var(--primary-accent);
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(99, 102, 241, 0.1);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ResultCount = styled.div`
  text-align: center;
  margin-bottom: 20px;
  font-size: 1rem;
  color: var(--text-muted);
  font-weight: 500;
  flex-shrink: 0;

  span {
    color: var(--primary-accent);
    font-weight: 700;
    font-size: 1.2rem;
  }
`;

const TableCard = styled.div`
  background: var(--bg-secondary);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-subtle);
  overflow: hidden;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--bg-primary);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-subtle);
    border-radius: 4px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
`;

const TableHead = styled.thead`
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
`;

const TableRow = styled.tr`
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(99, 102, 241, 0.1);
    transform: scale(1.01);
  }
`;

const TableHeader = styled.th`
  padding: 20px 16px;
  text-align: left;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
`;

const TableCell = styled.td`
  padding: 20px 16px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-main);
  font-size: 0.95rem;
`;

const ViewButton = styled.button`
  padding: 10px 24px;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const RestoreButton = styled.button`
  padding: 10px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: var(--bg-secondary);
  padding: 0;
  border-radius: 20px;
  max-width: 800px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
  border: 1px solid var(--border-subtle);
  
  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--bg-primary);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-subtle);
    border-radius: 4px;
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
`;

const CloseButton = styled.button`
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: white;
    color: #4f46e5;
  }
`;

const ModalBody = styled.div`
  padding: 30px;
`;

const DetailSection = styled.div`
  margin-bottom: 25px;
`;

const DetailLabel = styled.div`
  font-weight: 600;
  color: var(--primary-accent);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const DetailValue = styled.div`
  color: var(--text-main);
  font-size: 1rem;
  line-height: 1.6;
  padding: 12px;
  background: var(--bg-primary);
  border-radius: 8px;
  border-left: 4px solid var(--primary-accent);
  border-top: 1px solid var(--border-subtle);
  border-right: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
`;

const MemberCard = styled.div`
  padding: 16px;
  background: var(--bg-primary);
  border-radius: 12px;
  margin-bottom: 12px;
  border: 1px solid var(--border-subtle);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }
`;

const MemberName = styled.div`
  font-weight: 600;
  color: var(--text-main);
  font-size: 1rem;
  margin-bottom: 4px;
`;

const MemberInfo = styled.div`
  font-size: 0.9rem;
  color: var(--text-muted);
`;

const CommentCard = styled.div`
  padding: 16px;
  background: var(--bg-primary);
  border-radius: 12px;
  margin-bottom: 12px;
  border: 1px solid var(--border-subtle);
  border-left: 4px solid #ff9800;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(255, 152, 0, 0.15);
  }
`;

const CommentHeader = styled.div`
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CommentText = styled.div`
  color: var(--text-main);
  margin: 10px 0;
  line-height: 1.6;
`;

const CommentDate = styled.div`
  font-size: 0.85rem;
  color: var(--text-muted);
`;

const Badge = styled.span`
  display: inline-block;
  padding: 6px 14px;
  background: ${props => props.color || 'var(--primary-accent)'};
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-right: 10px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: var(--text-main);
  font-size: 1.2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
  
  svg {
    width: 120px;
    height: 120px;
    margin-bottom: 20px;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.5rem;
    margin: 0 0 10px 0;
    color: var(--text-main);
  }
  
  p {
    font-size: 1.1rem;
    opacity: 0.8;
  }
`;

const ConfirmModalContainer = styled.div`
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 2100;
  animation: slideUp 0.3s ease;
`;

const ConfirmModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-main);
  }
`;

const ConfirmCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  color: var(--text-muted);
  font-weight: 600;
  
  &:hover {
    color: var(--text-main);
  }
`;

const ConfirmModalBody = styled.div`
  color: var(--text-muted);
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
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--bg-primary);
    color: var(--text-main);
  }
`;

const ConfirmRestoreButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);

  &:hover {
    background: #059669;
    box-shadow: 0 6px 15px rgba(16, 185, 129, 0.3);
  }
`;

export default function DeletedCards() {
  const [deletedCards, setDeletedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [cardToRestore, setCardToRestore] = useState(null);
  const [filteredCards, setFilteredCards] = useState([]);
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [boardDropdownOpen, setBoardDropdownOpen] = useState(false);

  useEffect(() => {
    loadDeletedCards();
    setDefaultDates();
  }, []);

  const setDefaultDates = () => {
    const today = new Date();
    
    // Set to date as today
    const end = today.toISOString().slice(0, 10);
    
    // Set from date as 30 days ago
    const start = new Date(today);
    start.setDate(start.getDate() - 30);
    const startStr = start.toISOString().slice(0, 10);
    
    setFromDate(startStr);
    setToDate(end);
  };

  const loadDeletedCards = async () => {
    try {
      const url = process.env.REACT_APP_BACKEND_TRACKER_BASE_URL + "deleted_cards/";
      const response = await apiRequest(url, "GET");

      if (response.success) {
        setDeletedCards(response.data);
        setFilteredCards(response.data);
      } else {
        console.error("Failed to load deleted cards:", response.error);
      }
    } catch (error) {
      console.error("Error loading deleted cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const triggerRestore = (cardId) => {
    setCardToRestore(cardId);
    setShowRestoreConfirm(true);
  };

  const confirmRestore = async () => {
    if (!cardToRestore) return;
    try {
      const url = `${process.env.REACT_APP_BACKEND_TRACKER_BASE_URL}cards/${cardToRestore}/restore/`;
      const response = await apiRequest(url, "POST", {});

      if (response.success) {
        alert("Card restored successfully!");
        setSelectedCard(null);
        loadDeletedCards();
      } else {
        alert(response.error || "Failed to restore card.");
      }
    } catch (error) {
      console.error("Error restoring card:", error);
      alert("An error occurred while restoring the card.");
    } finally {
      setShowRestoreConfirm(false);
      setCardToRestore(null);
    }
  };

  const applyFilter = () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates");
      return;
    }

    const from = new Date(fromDate);
    from.setHours(0, 0, 0, 0);
    
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    if (from > to) {
      alert("From Date cannot be later than To Date");
      return;
    }

    let filtered = deletedCards.filter((card) => {
      if (!card.lastmodified_date) return false;
      const deletedDate = new Date(card.lastmodified_date);
      return deletedDate >= from && deletedDate <= to;
    });

    if (selectedBoards.length > 0) {
      filtered = filtered.filter((card) =>
        selectedBoards.includes(card.boardName)
      );
    }

    setFilteredCards(filtered);
  };

  const resetFilter = () => {
    setDefaultDates();
    setSelectedBoards([]);
    setFilteredCards(deletedCards);
  };

  const uniqueBoards = [...new Set(deletedCards.map((c) => c.boardName).filter(Boolean))];

  const toggleBoard = (boardName) => {
    setSelectedBoards((prev) =>
      prev.includes(boardName)
        ? prev.filter((b) => b !== boardName)
        : [...prev, boardName]
    );
  };

  const boardFilterLabel =
    selectedBoards.length === 0
      ? "All Boards"
      : selectedBoards.length === 1
      ? selectedBoards[0]
      : `${selectedBoards.length} Boards`;

  useEffect(() => {
    if (deletedCards.length > 0 && fromDate && toDate) {
      applyFilter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "—";
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      return "—";
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <div>⏳ Loading deleted cards…</div>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <Title>
             Deleted Cards
          </Title>
          <Subtitle>View and manage all deleted task cards</Subtitle>
        </Header>
        
        <FilterCard>
          <FilterRow>
            <FilterGroup>
              <FilterLabel>📅 From Date</FilterLabel>
              <DateInput
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>📅 To Date</FilterLabel>
              <DateInput
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </FilterGroup>

            {/* Board multi-select */}
            <FilterGroup>
              <FilterLabel>🏢 Board</FilterLabel>
              <BoardFilterWrapper>
                <BoardFilterButton
                  onClick={() => setBoardDropdownOpen((o) => !o)}
                  title="Filter by Board"
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {boardFilterLabel}
                  </span>
                  <span style={{ marginLeft: 6, flexShrink: 0 }}>{boardDropdownOpen ? "▲" : "▼"}</span>
                </BoardFilterButton>
                {boardDropdownOpen && (
                  <BoardDropdown>
                    {uniqueBoards.length === 0 ? (
                      <BoardOption style={{ color: "var(--text-muted)", cursor: "default" }}>
                        No boards available
                      </BoardOption>
                    ) : (
                      uniqueBoards.map((board) => (
                        <BoardOption key={board}>
                          <input
                            type="checkbox"
                            checked={selectedBoards.includes(board)}
                            onChange={() => toggleBoard(board)}
                          />
                          {board}
                        </BoardOption>
                      ))
                    )}
                  </BoardDropdown>
                )}
              </BoardFilterWrapper>
            </FilterGroup>

            <FilterButton onClick={applyFilter}>
              Apply Filter
            </FilterButton>

            <ResetButton onClick={resetFilter}>
              Reset
            </ResetButton>
          </FilterRow>
        </FilterCard>

        <ResultCount>
          Showing <span>{filteredCards.length}</span> of {deletedCards.length} deleted cards
        </ResultCount>

        <ScrollArea>
        {filteredCards.length === 0 ? (
          <EmptyState>
            <h3>No Deleted Cards Found</h3>
            <p>No cards were deleted in the selected date range</p>
          </EmptyState>
        ) : (
          <TableCard>
            <TableWrapper>
              <Table>
                <TableHead>
                  <tr>
                    <TableHeader>Card Name</TableHeader>
                    <TableHeader>Board</TableHeader>
                    <TableHeader>Column</TableHeader>
                    <TableHeader>Created By</TableHeader>
                    <TableHeader>Deleted By</TableHeader>
                    <TableHeader>Deleted On</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </tr>
                </TableHead>
                <tbody>
                  {filteredCards.map((card) => (
                    <TableRow key={card.cardId}>
                      <TableCell>
                        <strong>{card.cardName}</strong>
                      </TableCell>
                      <TableCell>{card.boardName}</TableCell>
                      <TableCell>
                        <Badge color="#ff9800">{card.columnId}</Badge>
                      </TableCell>
                      <TableCell>{card.created_by_name || "Unknown"}</TableCell>
                      <TableCell>{card.lastmodified_by_name || "Unknown"}</TableCell>
                      <TableCell>{formatDate(card.lastmodified_date)}</TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <ViewButton onClick={() => setSelectedCard(card)}>
                            View Details
                          </ViewButton>
                          <RestoreButton onClick={() => triggerRestore(card.cardId)}>
                            Restore
                          </RestoreButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          </TableCard>
        )}
        </ScrollArea>

        {selectedCard && (
          <ModalOverlay onClick={() => setSelectedCard(null)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>{selectedCard.cardName}</ModalTitle>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <RestoreButton onClick={() => triggerRestore(selectedCard.cardId)}>
                    Restore Card
                  </RestoreButton>
                  <CloseButton onClick={() => setSelectedCard(null)}>
                    Close
                  </CloseButton>
                </div>
              </ModalHeader>

              <ModalBody>
                <DetailSection>
                  <DetailLabel>Board</DetailLabel>
                  <DetailValue>{selectedCard.boardName}</DetailValue>
                </DetailSection>

                <DetailSection>
                  <DetailLabel>Column Status</DetailLabel>
                  <DetailValue>
                    <Badge color="#ff9800">{selectedCard.columnId}</Badge>
                  </DetailValue>
                </DetailSection>

                {selectedCard.description && (
                  <DetailSection>
                    <DetailLabel>Description</DetailLabel>
                    <DetailValue>{selectedCard.description}</DetailValue>
                  </DetailSection>
                )}

                <DetailSection>
                  <DetailLabel>Timeline</DetailLabel>
                  <DetailValue>
                    <div><strong>Start:</strong> {selectedCard.startdate || "—"}</div>
                    <div><strong>End:</strong> {selectedCard.enddate || "—"}</div>
                  </DetailValue>
                </DetailSection>

                <DetailSection>
                  <DetailLabel>Created By</DetailLabel>
                  <DetailValue>
                    {selectedCard.created_by_name} ({selectedCard.created_by})
                    <br />
                    <small>{formatDate(selectedCard.created_date)}</small>
                  </DetailValue>
                </DetailSection>

                <DetailSection>
                  <DetailLabel>Deleted By</DetailLabel>
                  <DetailValue>
                    {selectedCard.lastmodified_by_name} ({selectedCard.lastmodified_by})
                    <br />
                    <small>{formatDate(selectedCard.lastmodified_date)}</small>
                  </DetailValue>
                </DetailSection>

                {selectedCard.members && selectedCard.members.length > 0 && (
                  <DetailSection>
                    <DetailLabel>Team Members ({selectedCard.members.length})</DetailLabel>
                    {selectedCard.members.map((member, index) => (
                      <MemberCard key={index}>
                        <MemberName>
                          {member.employeeName}
                        </MemberName>
                        <MemberInfo>
                          ID: {member.employeeId} • {member.department}
                        </MemberInfo>
                      </MemberCard>
                    ))}
                  </DetailSection>
                )}

                {selectedCard.comment && selectedCard.comment.length > 0 && (
                  <DetailSection>
                    <DetailLabel>Comments ({selectedCard.comment.length})</DetailLabel>
                    {selectedCard.comment.map((c, index) => (
                      <CommentCard key={index}>
                        <CommentHeader>
                          <span>{c.empname} ({c.empid})</span>
                          <CommentDate>{c.date} {c.time}</CommentDate>
                        </CommentHeader>
                        <CommentText>{c.commenttext}</CommentText>
                      </CommentCard>
                    ))}
                  </DetailSection>
                )}
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}
        {showRestoreConfirm && (
          <ModalOverlay onClick={() => setShowRestoreConfirm(false)}>
            <ConfirmModalContainer onClick={(e) => e.stopPropagation()}>
              <ConfirmModalHeader>
                <h3>Restore Task</h3>
                <ConfirmCloseButton onClick={() => setShowRestoreConfirm(false)}>
                  Close
                </ConfirmCloseButton>
              </ConfirmModalHeader>
              <ConfirmModalBody>
                Are you sure you want to restore/revert this deleted card back to its active board column?
              </ConfirmModalBody>
              <ConfirmButtonGroup>
                <ConfirmCancelButton onClick={() => setShowRestoreConfirm(false)}>
                  Cancel
                </ConfirmCancelButton>
                <ConfirmRestoreButton onClick={confirmRestore}>
                  Restore
                </ConfirmRestoreButton>
              </ConfirmButtonGroup>
            </ConfirmModalContainer>
          </ModalOverlay>
        )}
      </ContentWrapper>
    </Container>
  );
}