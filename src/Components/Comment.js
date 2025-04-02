import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { RxActivityLog } from "react-icons/rx";
import { FaUserCircle, FaEdit, FaTrashAlt, FaCheck, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// All existing styled components remain the same...
const Section = styled.div`
  margin: 20px 0;
`;

const SectionTitle = styled.div`
  font-size: 1.2rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

const ActivityInput = styled.textarea`
  width: 100%;
  height: 60px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 14px;
  background-color: white;
  color: #000000;
  resize: none;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
`;

const Button = styled.button`
  background-color: #3498DB;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #2980B9;
  }
`;

const CommentsSection = styled.div`
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
`;

const CommentItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  position: relative;
`;

const Avatar = styled.div`
  margin-right: 15px;
  font-size: 2rem;
  color: #3498DB;
`;

const CommentContent = styled.div`
  background-color: #fff;
  padding: 10px;
  border-radius: 6px;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CommentText = styled.p`
  margin: 0;
  font-size: 1rem;
`;

const CommentAuthor = styled.span`
  font-weight: bold;
  margin-right: 5px;
`;

const CommentDate = styled.small`
  color: gray;
  font-size: 0.8rem;
  margin-left: 10px;
`;

const EditText = styled.span`
  color: blue;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 10px;
  font-size: 0.9rem;
`;

const DeleteText = styled.span`
  color: red;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 10px;
  font-size: 0.9rem;
`;

const ActionIcons = styled.div`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const ActionIcon = styled.div`
  margin-left: 10px;
  cursor: pointer;
  font-size: 1.2rem;
  color: #3498DB;
  &:hover {
    color: #2980B9;
  }

  &.delete-icon {
    color: red;
    &:hover {
      color: darkred;
    }
  }
`;

// Custom Toast Container styling
const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .Toastify__toast-body {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
  }

  .Toastify__toast--success {
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
  }

  .Toastify__toast--error {
    background: linear-gradient(135deg, #dc3545, #ff6b6b);
    color: white;
  }

  .Toastify__toast--info {
    background: linear-gradient(135deg, #0dcaf0, #0d6efd);
    color: white;
  }

  .Toastify__toast--warning {
    background: linear-gradient(135deg, #ffc107, #fd7e14);
    color: white;
  }

  .Toastify__progress-bar {
    height: 4px;
    opacity: 0.7;
  }

  .Toastify__close-button {
    color: rgba(255, 255, 255, 0.7);
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }
  }
`;

// Custom toast message components
const ToastMessage = styled.div`
  display: flex;
  align-items: center;
`;

const ToastIcon = styled.div`
  margin-right: 12px;
  font-size: 20px;
  display: flex;
  align-items: center;
`;

const ToastContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ToastTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const ToastDescription = styled.div`
  font-weight: 400;
  opacity: 0.9;
`;

const Comment = ({ cardId, cardName, boardName, boardId }) => {
  const [comments, setComments] = useState([]);
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const activityInputRef = useRef(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeName, setEmployeeName] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("employeeId");
    const name = localStorage.getItem("employeeName");
    if (id && name) {
      setEmployeeId(id);
      setEmployeeName(name);
    }
  }, []);

  // Configure toast options
  const toastConfig = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  // Custom toast notification functions
  const successToast = (title, message) => {
    toast.success(
      <ToastMessage>
        <ToastIcon><FaCheck /></ToastIcon>
        <ToastContent>
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{message}</ToastDescription>
        </ToastContent>
      </ToastMessage>,
      toastConfig
    );
  };

  const errorToast = (title, message) => {
    toast.error(
      <ToastMessage>
        <ToastIcon><FaExclamationTriangle /></ToastIcon>
        <ToastContent>
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{message}</ToastDescription>
        </ToastContent>
      </ToastMessage>,
      toastConfig
    );
  };

  const infoToast = (title, message) => {
    toast.info(
      <ToastMessage>
        <ToastIcon><FaInfoCircle /></ToastIcon>
        <ToastContent>
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{message}</ToastDescription>
        </ToastContent>
      </ToastMessage>,
      toastConfig
    );
  };

  const fetchComments = async () => {
    try {
      const queryParams = new URLSearchParams({ cardId, boardId }).toString();
      const response = await fetch(`https://tracker.shinovadatabase.in/get_comments/?${queryParams}`);
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      errorToast("Network Error", "Failed to load comments. Please try again later.");
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSaveActivity = async () => {
    const commentText = activityInputRef.current.value.trim();
    if (!commentText) {
      errorToast("Empty Comment", "Comment cannot be empty!");
      return;
    }
    const currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];
    const time = currentDate.toTimeString().split(" ")[0];
    try {
      const response = await fetch("https://tracker.shinovadatabase.in/save_comment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: commentText,
          cardId,
          boardId,
          employeeId,
          employeeName,
          date,
          time,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        successToast("Comment Added", "Your comment has been posted successfully");
        fetchComments();
        activityInputRef.current.value = "";
      } else {
        errorToast("Submission Failed", "Could not save your comment. Please try again.");
      }
    } catch (error) {
      console.error("Error saving comment:", error);
      errorToast("Network Error", "Failed to connect to the server. Please check your connection.");
    }
  };

  const handleDeleteComment = async (commentText) => {
    try {
      const response = await fetch("https://tracker.shinovadatabase.in/delete_comment/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId,
          boardId,
          commenttext: commentText,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        errorToast("Comment Deleted", "The comment has been removed successfully");
        fetchComments();
      } else {
        const errorData = await response.json();
        errorToast("Deletion Failed", errorData.error || "Unable to delete the comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      errorToast("Network Error", "Failed to connect to the server. Please try again later.");
    }
  };

  const handleEditComment = async (originalCommentText) => {
    try {
      const response = await fetch("https://tracker.shinovadatabase.in/edit_comment/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId,
          boardId,
          originalCommentText,
          newCommentText: editCommentText,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        infoToast("Comment Updated", "Your changes have been saved successfully");
        fetchComments();
        setEditingCommentIndex(null);
      } else {
        const errorData = await response.json();
        errorToast("Update Failed", errorData.error || "Unable to edit the comment");
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      errorToast("Network Error", "Failed to connect to the server. Please try again later.");
    }
  };

  return (
    <div>
      <Section>
        <SectionTitle>
          <RxActivityLog style={{ fontSize: "1rem", marginRight: "10px", fontWeight: "bold" }} />
          Activity
        </SectionTitle>
        <ActivityInput placeholder="Add a comment or activity..." ref={activityInputRef} />
        <Actions>
          <Button onClick={handleSaveActivity}>Comment</Button>
        </Actions>
      </Section>
      <CommentsSection>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <CommentItem key={index}>
              <Avatar>
                <FaUserCircle />
              </Avatar>
              <CommentContent>
                {editingCommentIndex === index ? (
                  <input
                    type="text"
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                  />
                ) : (
                  <>
                    <p>
                      <CommentAuthor>{comment.empname || "Anonymous"}</CommentAuthor>
                      <CommentDate>{comment.date} at {comment.time}</CommentDate>
                    </p>
                    <CommentText>{comment.commenttext}</CommentText>
                  </>
                )}
                <ActionIcons>
                  <ActionIcon onClick={() => {
                    setEditingCommentIndex(index);
                    setEditCommentText(comment.commenttext);
                  }}>
                    <FaEdit />
                  </ActionIcon>
                  <ActionIcon className="delete-icon" onClick={() => handleDeleteComment(comment.commenttext)}>
                    <FaTrashAlt />
                  </ActionIcon>
                </ActionIcons>
                {editingCommentIndex === index && (
                  <Button onClick={() => handleEditComment(comment.commenttext)}>
                    Save
                  </Button>
                )}
              </CommentContent>
            </CommentItem>
          ))
        ) : (
          <p>No comments available.</p>
        )}
      </CommentsSection>
      {/* Custom styled toast container */}
      <StyledToastContainer />
    </div>
  );
};

export default Comment;