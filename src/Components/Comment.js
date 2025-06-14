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

const EditInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 8px;
`;

const EditActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const EditButton = styled(Button)`
  padding: 6px 12px;
  font-size: 12px;
`;

const CancelButton = styled(EditButton)`
  background-color: #95a5a6;
  &:hover {
    background-color: #7f8c8d;
  }
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

  // Function to check if current user can edit/delete a comment
  const canModifyComment = (comment) => {
    // Check if the comment belongs to the current logged-in employee
    // This can be done by comparing employee ID or employee name
    // Using employeeId for more secure comparison
    return (
      String(comment.empid) === String(employeeId) ||
      comment.empname === employeeName
    );
  };

  // Simplified toast functions to avoid complex custom components
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showInfoToast = (message) => {
    toast.info(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
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
          showErrorToast(
            result.error || "Failed to load comments. Please try again later."
          );
        }
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
      showErrorToast("Failed to load comments. Please try again later.");
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
      showErrorToast("Comment cannot be empty!");
      return;
    }

    // Validate required props
    console.log("Props validation:");
    console.log("- cardId:", cardId, typeof cardId);
    console.log("- boardId:", boardId, typeof boardId);
    console.log("- employeeId:", employeeId, typeof employeeId);
    console.log("- employeeName:", employeeName, typeof employeeName);

    if (!cardId || !boardId) {
      showErrorToast("Card ID or Board ID is missing!");
      console.error("Missing cardId or boardId:", { cardId, boardId });
      return;
    }

    if (!employeeId || !employeeName) {
      showErrorToast("Employee information not found. Please log in again.");
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
        showSuccessToast("Your comment has been posted successfully");

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
          showErrorToast("Session expired. Please log in again.");
        } else if (result.status === 400) {
          showErrorToast(result.error || "Invalid data sent to server.");
        } else {
          showErrorToast(
            result.error || "Failed to save comment. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Error saving comment:", error);
      showErrorToast(
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
        showSuccessToast("The comment has been removed successfully");
        fetchComments();
      } else {
        console.error("Delete failed:", result.error);
        showErrorToast(result.error || "Unable to delete the comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      showErrorToast(
        "Failed to connect to the server. Please try again later."
      );
    }
  };

  const handleEditComment = async (originalCommentText) => {
    if (!editCommentText.trim()) {
      showErrorToast("Comment cannot be empty!");
      return;
    }

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
        showInfoToast("Your changes have been saved successfully");
        fetchComments();
        setEditingCommentIndex(null);
        setEditCommentText("");
      } else {
        console.error("Edit failed:", result.error);
        showErrorToast(result.error || "Unable to edit the comment");
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      showErrorToast(
        "Failed to connect to the server. Please try again later."
      );
    }
  };

  const startEditing = (index, commentText) => {
    setEditingCommentIndex(index);
    setEditCommentText(commentText);
  };

  const cancelEditing = () => {
    setEditingCommentIndex(null);
    setEditCommentText("");
  };

  // Add Enter key handler for better UX
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSaveActivity();
    }
  };

  const handleEditKeyPress = (e, originalCommentText) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEditComment(originalCommentText);
    } else if (e.key === "Escape") {
      cancelEditing();
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
            <CommentItem key={`${comment.date}-${comment.time}-${index}`}>
              <Avatar>
                <FaUserCircle />
              </Avatar>
              <CommentContent>
                {editingCommentIndex === index ? (
                  <>
                    <EditInput
                      type="text"
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                      onKeyDown={(e) =>
                        handleEditKeyPress(e, comment.commenttext)
                      }
                      autoFocus
                      placeholder="Edit your comment..."
                    />
                    <EditActions>
                      <EditButton
                        onClick={() => handleEditComment(comment.commenttext)}
                        disabled={!editCommentText.trim()}
                      >
                        Save
                      </EditButton>
                      <CancelButton onClick={cancelEditing}>
                        Cancel
                      </CancelButton>
                    </EditActions>
                  </>
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
                    {/* Only show action icons if the current user can modify this comment */}
                    {canModifyComment(comment) && (
                      <ActionIcons>
                        <ActionIcon
                          onClick={() =>
                            startEditing(index, comment.commenttext)
                          }
                          title="Edit comment"
                        >
                          <FaEdit />
                        </ActionIcon>
                        <ActionIcon
                          className="delete-icon"
                          onClick={() =>
                            handleDeleteComment(comment.commenttext)
                          }
                          title="Delete comment"
                        >
                          <FaTrashAlt />
                        </ActionIcon>
                      </ActionIcons>
                    )}
                  </>
                )}
              </CommentContent>
            </CommentItem>
          ))
        ) : (
          <p>No comments available.</p>
        )}
      </CommentsSection>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Comment;
