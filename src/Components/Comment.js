import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { RxActivityLog } from "react-icons/rx";
import {
  FaUserCircle,
  FaEdit,
  FaTrashAlt,
  FaCheck,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "./apiRequest"; // Import your apiRequest helper

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
  background-color: #3498db;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #2980b9;
  }
  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
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
  color: #3498db;
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
  color: #3498db;
  &:hover {
    color: #2980b9;
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
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const activityInputRef = useRef(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeName, setEmployeeName] = useState(null);
  const Trackerbaseurl = process.env.REACT_APP_BACKEND_TRACKER_BASE_URL;

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
        <ToastIcon>
          <FaCheck />
        </ToastIcon>
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
        <ToastIcon>
          <FaExclamationTriangle />
        </ToastIcon>
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
        <ToastIcon>
          <FaInfoCircle />
        </ToastIcon>
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
      const result = await apiRequest(
        `${Trackerbaseurl}get_comments/?${queryParams}`,
        "GET"
      );

      console.log("Fetch comments result:", result);

      if (result.success && result.data) {
        // Handle different response structures
        if (result.data.comments && Array.isArray(result.data.comments)) {
          setComments(result.data.comments);
        } else if (Array.isArray(result.data)) {
          setComments(result.data);
        } else {
          console.warn("Unexpected comments data structure:", result.data);
          setComments([]);
        }
      } else {
        console.error("Failed to fetch comments:", result.error);
        setComments([]);
        if (result.status !== 404) {
          // Don't show error for no comments found
          errorToast(
            "Network Error",
            result.error || "Failed to load comments. Please try again later."
          );
        }
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
      errorToast(
        "Network Error",
        "Failed to load comments. Please try again later."
      );
    }
  };

  useEffect(() => {
    fetchComments();
  }, [cardId, boardId]);

  const handleSaveActivity = async () => {
    console.log("=== SAVE ACTIVITY DEBUG START ===");

    if (isSubmitting) {
      console.log("Already submitting, returning early");
      return;
    }

    const commentText = activityInputRef.current?.value?.trim();
    console.log("Comment Text:", commentText);

    if (!commentText) {
      console.log("Comment text is empty");
      errorToast("Empty Comment", "Comment cannot be empty!");
      return;
    }

    // Validate required props
    console.log("Props validation:");
    console.log("- cardId:", cardId, typeof cardId);
    console.log("- boardId:", boardId, typeof boardId);
    console.log("- employeeId:", employeeId, typeof employeeId);
    console.log("- employeeName:", employeeName, typeof employeeName);

    if (!cardId || !boardId) {
      errorToast("Missing Information", "Card ID or Board ID is missing!");
      console.error("Missing cardId or boardId:", { cardId, boardId });
      return;
    }

    if (!employeeId || !employeeName) {
      errorToast(
        "Authentication Error",
        "Employee information not found. Please log in again."
      );
      console.error("Missing employee info:", { employeeId, employeeName });
      return;
    }

    setIsSubmitting(true);
    console.log("Starting API request...");

    try {
      const currentDate = new Date();
      const date = currentDate.toISOString().split("T")[0];
      const time = currentDate.toTimeString().split(" ")[0];

      const payload = {
        text: commentText,
        cardId: String(cardId),
        boardId: String(boardId),
        employeeId: String(employeeId),
        employeeName: String(employeeName),
        date,
        time,
      };

      console.log(
        "Final payload being sent:",
        JSON.stringify(payload, null, 2)
      );
      console.log("API URL:", `${Trackerbaseurl}save_comment/`);

      // Use apiRequest helper instead of fetch
      const result = await apiRequest(
        `${Trackerbaseurl}save_comment/`,
        "POST",
        payload
      );

      console.log("API Response received:", result);

      if (result.success) {
        console.log("API call successful");
        successToast(
          "Comment Added",
          "Your comment has been posted successfully"
        );

        // Clear the input and refresh comments
        if (activityInputRef.current) {
          activityInputRef.current.value = "";
          console.log("Input cleared");
        }

        console.log("Refreshing comments...");
        await fetchComments();
        console.log("Comments refreshed");
      } else {
        console.log("API call failed:", result.error);

        // Handle different error types
        if (result.status === 401) {
          errorToast(
            "Authentication Error",
            "Session expired. Please log in again."
          );
        } else if (result.status === 400) {
          errorToast(
            "Validation Error",
            result.error || "Invalid data sent to server."
          );
        } else {
          errorToast(
            "Save Failed",
            result.error || "Failed to save comment. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Error saving comment:", error);
      errorToast(
        "Network Error",
        "Failed to connect to the server. Please check your connection."
      );
    } finally {
      setIsSubmitting(false);
      console.log("=== SAVE ACTIVITY DEBUG END ===");
    }
  };

  const handleDeleteComment = async (commentText) => {
    try {
      const payload = {
        cardId: String(cardId),
        boardId: String(boardId),
        commenttext: commentText,
      };

      const result = await apiRequest(
        `${Trackerbaseurl}delete_comment/`,
        "DELETE",
        payload
      );

      if (result.success) {
        errorToast(
          "Comment Deleted",
          "The comment has been removed successfully"
        );
        fetchComments();
      } else {
        console.error("Delete failed:", result.error);
        errorToast(
          "Deletion Failed",
          result.error || "Unable to delete the comment"
        );
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      errorToast(
        "Network Error",
        "Failed to connect to the server. Please try again later."
      );
    }
  };

  const handleEditComment = async (originalCommentText) => {
    try {
      const payload = {
        cardId: String(cardId),
        boardId: String(boardId),
        originalCommentText,
        newCommentText: editCommentText,
      };

      const result = await apiRequest(
        `${Trackerbaseurl}edit_comment/`,
        "PUT",
        payload
      );

      if (result.success) {
        infoToast(
          "Comment Updated",
          "Your changes have been saved successfully"
        );
        fetchComments();
        setEditingCommentIndex(null);
      } else {
        console.error("Edit failed:", result.error);
        errorToast(
          "Update Failed",
          result.error || "Unable to edit the comment"
        );
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      errorToast(
        "Network Error",
        "Failed to connect to the server. Please try again later."
      );
    }
  };

  // Add Enter key handler for better UX
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSaveActivity();
    }
  };

  return (
    <div>
      <Section>
        <SectionTitle>
          <RxActivityLog
            style={{
              fontSize: "1rem",
              marginRight: "10px",
              fontWeight: "bold",
            }}
          />
          Activity
        </SectionTitle>
        <ActivityInput
          placeholder="Add a comment or activity... (Ctrl+Enter to submit)"
          ref={activityInputRef}
          onKeyDown={handleKeyPress}
        />
        <Actions>
          <Button onClick={handleSaveActivity} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Comment"}
          </Button>
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
                      <CommentAuthor>
                        {comment.empname || "Anonymous"}
                      </CommentAuthor>
                      <CommentDate>
                        {comment.date} at {comment.time}
                      </CommentDate>
                    </p>
                    <CommentText>{comment.commenttext}</CommentText>
                  </>
                )}
                <ActionIcons>
                  <ActionIcon
                    onClick={() => {
                      setEditingCommentIndex(index);
                      setEditCommentText(comment.commenttext);
                    }}
                  >
                    <FaEdit />
                  </ActionIcon>
                  <ActionIcon
                    className="delete-icon"
                    onClick={() => handleDeleteComment(comment.commenttext)}
                  >
                    <FaTrashAlt />
                  </ActionIcon>
                </ActionIcons>
                {editingCommentIndex === index && (
                  <Button
                    onClick={() => handleEditComment(comment.commenttext)}
                  >
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
      <StyledToastContainer />
    </div>
  );
};

export default Comment;
