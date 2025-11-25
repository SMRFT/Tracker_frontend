import React, { useEffect, useState } from "react";
import styled from "styled-components";
import apiRequest from "./apiRequest";

const Container = styled.div`
  padding: 40px;
  background: linear-gradient(135deg, rgba(248, 152, 157, 1) 0%, rgba(253, 128, 128, 1) 100%);
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin: 0;
`;

const TableCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
`;

const TableHead = styled.thead`
  background: linear-gradient(135deg, #ff8086ff 0%rgba(249, 100, 100, 1)79 100%);
`;

const TableRow = styled.tr`
  transition: all 0.3s ease;
  
  &:hover {
    background: #f8f9ff;
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
`;

const TableCell = styled.td`
  padding: 20px 16px;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
  font-size: 0.95rem;
`;

const ViewButton = styled.button`
  padding: 10px 24px;
  background: linear-gradient(135deg, #ef777dff 0%, #ff6363ff 100%);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(254, 119, 119, 0.88);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(250, 110, 110, 0.97);
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
  background: white;
  padding: 0;
  border-radius: 20px;
  max-width: 800px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;
  
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
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #fc9197ff 0%, #fa6a6dff 100%);
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
    color: #fd777eff;
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
  color: #f57178ff;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const DetailValue = styled.div`
  color: #333;
  font-size: 1rem;
  line-height: 1.6;
  padding: 12px;
  background: #f8f9ff;
  border-radius: 8px;
  border-left: 4px solid #fc7178ff;
`;

const MemberCard = styled.div`
  padding: 16px;
  background: linear-gradient(135deg, #f8f9ff 0%, #e9ecff 100%);
  border-radius: 12px;
  margin-bottom: 12px;
  border: 1px solid #e0e5ff;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }
`;

const MemberName = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 1rem;
  margin-bottom: 4px;
`;

const MemberInfo = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const CommentCard = styled.div`
  padding: 16px;
  background: #fff8f0;
  border-radius: 12px;
  margin-bottom: 12px;
  border-left: 4px solid #ff9800;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(255, 152, 0, 0.2);
  }
`;

const CommentHeader = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CommentText = styled.div`
  color: #555;
  margin: 10px 0;
  line-height: 1.6;
`;

const CommentDate = styled.div`
  font-size: 0.85rem;
  color: #999;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 6px 14px;
  background: ${props => props.color || '#f87373ff'};
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
  color: white;
  font-size: 1.2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: white;
  
  svg {
    width: 120px;
    height: 120px;
    margin-bottom: 20px;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.5rem;
    margin: 0 0 10px 0;
  }
  
  p {
    font-size: 1.1rem;
    opacity: 0.8;
  }
`;

export default function DeletedCards() {
  const [deletedCards, setDeletedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    loadDeletedCards();
  }, []);

  const loadDeletedCards = async () => {
    const url =
      process.env.REACT_APP_BACKEND_TRACKER_BASE_URL + "deleted_cards/";

    const response = await apiRequest(url, "GET");

    if (response.success) {
      setDeletedCards(response.data);
    } else {
      console.error("Failed to load deleted cards:", response.error);
    }

    setLoading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
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
            🗑️ Deleted Cards
          </Title>
          <Subtitle>View and manage all deleted task cards</Subtitle>
        </Header>

        {deletedCards.length === 0 ? (
          <EmptyState>
            <h3>No Deleted Cards</h3>
            <p>You haven't deleted any cards yet</p>
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
                  {deletedCards.map((card) => (
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
                        <ViewButton onClick={() => setSelectedCard(card)}>
                          View Details
                        </ViewButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          </TableCard>
        )}

        {selectedCard && (
          <ModalOverlay onClick={() => setSelectedCard(null)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>{selectedCard.cardName}</ModalTitle>
                <CloseButton onClick={() => setSelectedCard(null)}>
                  Close
                </CloseButton>
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
      </ContentWrapper>
    </Container>
  );
}