import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import apiRequest from "./apiRequest";
import * as XLSX from "xlsx";

const Trackerbaseurl = process.env.REACT_APP_BACKEND_TRACKER_BASE_URL;

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  min-height: 100vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #0f0c0dff 0%, #181213ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SearchSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const SearchInput = styled.input`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  width: 300px;
  font-size: 1rem;
  background: #f8f9fa;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #eb5679;
    box-shadow: 0 0 0 3px rgba(235, 86, 121, 0.1);
    background: white;
  }

  &::placeholder {
    color: #adb5bd;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DateFilter = styled.input`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  background: #f8f9fa;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #eb5679;
    box-shadow: 0 0 0 3px rgba(235, 86, 121, 0.1);
    background: white;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ClearButton = styled.button`
  padding: 12px 24px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;

  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(108, 117, 125, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 16px;
  }
`;

const ActionSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const ActionButton = styled.button`
  padding: 10px 16px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(235, 86, 121, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 16px;
  }
`;

const TableWrapper = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-top: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
`;

const Th = styled.th`
  padding: 1.2rem 1rem;
  background: linear-gradient(135deg, #ff9a9e 0%, #fca6a9ff 100%);
  color: white;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 10;

  &:first-child {
    border-top-left-radius: 12px;
  }

  &:last-child {
    border-top-right-radius: 12px;
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  vertical-align: top;
`;

const Tr = styled.tr`
  transition: all 0.3s ease;

  &:nth-child(even) {
    background-color: #f8f9fa;
  }

  &:hover {
    background-color: #e3f2fd !important;
  }

  &:last-child td {
    border-bottom: none;
  }
`;

const BoardCell = styled(Td)`
  font-weight: 600;
  color: #f6676eff;
`;

const CardCell = styled(Td)`
  font-weight: 600;
  color: #2c3e50;
`;

const MemberList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const MemberBadge = styled.span`
  display: inline-block;
  background: #fce4ec;
  color: #c2185b;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ViewButton = styled.button`
  padding: 8px 16px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fca6a9ff 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(235, 86, 121, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Modal = styled.div`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;

  @media (max-width: 768px) {
    align-items: flex-end;
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    border-radius: 16px 16px 0 0;
    max-height: 80vh;
  }
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  background: linear-gradient(135deg, #fe9194ff 0%, #fca6a9ff 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const ModalTitle = styled.div`
  flex: 1;
`;

const BoardNameModal = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.9;
  margin-bottom: 0.5rem;
`;

const CardNameModal = styled.h3`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  word-break: break-word;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
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
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6c757d;
`;

const DateContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const DateBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const DateValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #eb5679;
`;

const DescriptionSection = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0.8rem;
  max-height: 150px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #eb5679;
    border-radius: 4px;

    &:hover {
      background: #d6156c;
    }
  }
`;

const DescriptionText = styled.div`
  font-size: 0.9rem;
  color: #495057;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
`;

const CommentSection = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  max-height: 250px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #eb5679;
    border-radius: 4px;

    &:hover {
      background: #d6156c;
    }
  }
`;

const Comment = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }
`;

const CommentAuthor = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: #eb5679;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.3rem;
`;

const CommentText = styled.div`
  font-size: 0.9rem;
  color: #495057;
  line-height: 1.5;
  margin-bottom: 0.3rem;
`;

const CommentTime = styled.div`
  font-size: 0.75rem;
  color: #adb5bd;
`;

const NoDataWrapper = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
`;

const NoDataIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const NoDataMessage = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
  margin: 0;
  font-weight: 500;
`;

const TaskDeadline = () => {
  const [overdueCards, setOverdueCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const role = localStorage.getItem("role");
  const employeeId = localStorage.getItem("employeeId");

  useEffect(() => {
    const fetchOverdueCards = async () => {
      setIsLoading(true);
      try {
        const result = await apiRequest(
          `${Trackerbaseurl}get-overdue-cards/${role}/?auth-user-id=${employeeId}`,
          "GET"
        );
        if (result.success) {
          setOverdueCards(result.data);
          setFilteredCards(result.data);
        } else {
          toast.error("Failed to load overdue cards: " + result.error, {
            autoClose: 2000,
            closeOnClick: true,
            closeButton: true,
          });
        }
      } catch (error) {
        toast.error("Error fetching overdue cards");
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (employeeId && role) {
      fetchOverdueCards();
    } else {
      toast.error("Missing employee ID or role", {
        autoClose: 2000,
        closeOnClick: true,
        closeButton: true,
      });
    }
  }, [employeeId, role]);

  useEffect(() => {
    let filtered = overdueCards;

    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter((card) => {
        const memberMatch = card.members?.some((m) =>
          m.employeeName.toLowerCase().includes(lower)
        );
        return (
          card.cardName.toLowerCase().includes(lower) ||
          card.boardName.toLowerCase().includes(lower) ||
          card.employeeId?.toString().includes(lower) ||
          memberMatch
        );
      });
    }

    if (fromDate) {
      filtered = filtered.filter(
        (card) => new Date(card.enddate) >= new Date(fromDate)
      );
    }

    if (toDate) {
      filtered = filtered.filter(
        (card) => new Date(card.enddate) <= new Date(toDate)
      );
    }

    setFilteredCards(filtered);
  }, [searchQuery, fromDate, toDate, overdueCards]);

  const handleClear = () => {
    setSearchQuery("");
    setFromDate("");
    setToDate("");
    toast.info("Filters cleared", { autoClose: 1500 });
  };

  const handleViewDetails = (card) => {
    setSelectedCard(card);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleString();
    
    const printContent = `
      <html>
        <head>
          <title>Overdue Task Deadlines Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 2rem;
              color: #2c3e50;
            }
            h1 {
              color: #ff9a9e;
              text-align: center;
              margin-bottom: 0.5rem;
            }
            .timestamp {
              text-align: center;
              color: #6c757d;
              margin-bottom: 2rem;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 1rem;
            }
            th {
              background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
              color: white;
              padding: 1rem;
              text-align: left;
            }
            td {
              padding: 1rem;
              border-bottom: 1px solid #e9ecef;
            }
            tr:nth-child(even) {
              background-color: #f8f9fa;
            }
          </style>
        </head>
        <body>
          <h1>Overdue Task Deadlines Report</h1>
          <div class="timestamp">Generated on: ${currentDate}</div>
          <table>
            <thead>
              <tr>
                <th>Board</th>
                <th>Card</th>
                <th>Members</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Description</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              ${filteredCards.map(card => `
                <tr>
                  <td>${card.boardName || '—'}</td>
                  <td>${card.cardName || '—'}</td>
                  <td>${card.members?.map(m => `${m.employeeName} (${m.employeeId})`).join(', ') || '—'}</td>
                  <td>${formatDate(card.startdate)}</td>
                  <td>${formatDate(card.enddate)}</td>
                  <td>${card.description || '—'}</td>
                  <td>
                  ${
                    card.comment?.length
                      ? card.comment
                          .map(
                            (c) => `
                            <div class="comment-box">
                              <strong>${c.empname} (ID: ${c.empid})</strong><br/>
                              ${c.commenttext}<br/>
                              <span class="comment-meta">${c.date} at ${c.time}</span>
                            </div>
                          `
                          )
                          .join("")
                      : "—"
                  }
                </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleExportExcel = () => {
    const exportData = filteredCards.map(card => ({
      Board: card.boardName || '—',
      Card: card.cardName || '—',
      Members: card.members?.map(m => `${m.employeeName} (${m.employeeId})`).join(', ') || '—',
      'Start Date': formatDate(card.startdate),
      'End Date': formatDate(card.enddate),
      Description: card.description || '—'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Overdue Tasks');
    
    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `Overdue_Tasks_${today}.xlsx`);
    
    toast.success("Excel file downloaded successfully", {
      autoClose: 2000,
      closeOnClick: true,
      closeButton: true,
    });
  };

  return (
    <Container>
      <Header>
        <Title>Overdue Task Deadlines</Title>
      </Header>

      <SearchSection>
        <SearchInput
          type="text"
          placeholder="Search by member, card, board, or employee ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <DateFilter
          type="date"
          placeholder="From Date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          title="From Date"
        />

        <DateFilter
          type="date"
          placeholder="To Date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          title="To Date"
        />

        <ClearButton onClick={handleClear}>Clear</ClearButton>
      </SearchSection>

      <ActionSection>
        <ActionButton onClick={handlePrint}>Print</ActionButton>
        <ActionButton onClick={handleExportExcel}>Export Excel</ActionButton>
      </ActionSection>

      {isLoading ? (
        <NoDataWrapper>
          <NoDataMessage>Loading overdue tasks...</NoDataMessage>
        </NoDataWrapper>
      ) : filteredCards.length === 0 ? (
        <NoDataWrapper>
          <NoDataIcon>✓</NoDataIcon>
          <NoDataMessage>No overdue cards found.</NoDataMessage>
        </NoDataWrapper>
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Board Name</Th>
                <Th>Card Name</Th>
                <Th>Members</Th>
                <Th>From Date</Th>
                <Th>Due Date</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((card) => (
                <Tr key={card.cardId}>
                  <BoardCell>{card.boardName}</BoardCell>
                  <CardCell>{card.cardName}</CardCell>
                  <Td>
                    <MemberList>
                      {card.members?.length ? (
                        card.members.map((m) => (
                          <MemberBadge key={m.employeeId}>
                            {m.employeeName} ({m.employeeId})
                          </MemberBadge>
                        ))
                      ) : (
                        <span>—</span>
                      )}
                    </MemberList>
                  </Td>
                  <Td>{formatDate(card.startdate)}</Td>
                  <Td>{formatDate(card.enddate)}</Td>
                  <Td>
                    <ViewButton onClick={() => handleViewDetails(card)}>
                      View
                    </ViewButton>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}

      {/* Modal for Card Details */}
      <Modal isOpen={!!selectedCard} onClick={closeModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          {selectedCard && (
            <>
              <ModalHeader>
                <ModalTitle>
                  <BoardNameModal>{selectedCard.boardName}</BoardNameModal>
                  <CardNameModal>{selectedCard.cardName}</CardNameModal>
                </ModalTitle>
                <CloseButton onClick={closeModal}>✕</CloseButton>
              </ModalHeader>

              <ModalBody>
                {/* Members */}
                <Section>
                  <SectionLabel>Members</SectionLabel>
                  <MemberList>
                    {selectedCard.members?.length ? (
                      selectedCard.members.map((m) => (
                        <MemberBadge key={m.employeeId}>
                          {m.employeeName} ({m.employeeId})
                        </MemberBadge>
                      ))
                    ) : (
                      <span>No members assigned</span>
                    )}
                  </MemberList>
                </Section>

                {/* Dates */}
                <DateContainer>
                  <DateBox>
                    <SectionLabel>Start Date</SectionLabel>
                    <DateValue>{formatDate(selectedCard.startdate)}</DateValue>
                  </DateBox>
                  <DateBox>
                    <SectionLabel>Due Date</SectionLabel>
                    <DateValue>{formatDate(selectedCard.enddate)}</DateValue>
                  </DateBox>
                </DateContainer>

                {/* Description */}
                {selectedCard.description && (
                  <Section>
                    <SectionLabel>Description</SectionLabel>
                    <DescriptionSection>
                      <DescriptionText>{selectedCard.description}</DescriptionText>
                    </DescriptionSection>
                  </Section>
                )}

                {/* Comments */}
                {selectedCard.comment?.length > 0 && (
                  <Section>
                    <SectionLabel>Comments ({selectedCard.comment.length})</SectionLabel>
                    <CommentSection>
                      {selectedCard.comment.map((com, idx) => (
                        <Comment key={idx}>
                          <CommentAuthor>{com.empname} (ID: {com.empid})</CommentAuthor>
                          <CommentText>{com.commenttext}</CommentText>
                          <CommentTime>
                            {com.date} at {com.time}
                          </CommentTime>
                        </Comment>
                      ))}
                    </CommentSection>
                  </Section>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default TaskDeadline;