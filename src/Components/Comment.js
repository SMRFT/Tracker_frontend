import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { RxActivityLog } from "react-icons/rx";
import { FaUserCircle } from "react-icons/fa";  // For avatars
import "react-datepicker/dist/react-datepicker.css";
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
const Comment = ({ cardId, cardName, boardName, boardId }) => {
  const [comments, setComments] = useState([]);
  const [editingCommentIndex, setEditingCommentIndex] = useState(null); // Track which comment is being edited
  const [editCommentText, setEditCommentText] = useState(""); // Track the edited comment text
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
  const fetchComments = async () => {
    try {
      const queryParams = new URLSearchParams({ cardId, boardId }).toString();
      const response = await fetch(`http://127.0.0.1:8000/get_comments/?${queryParams}`);
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  useEffect(() => {
    fetchComments();
  }, []);
  const handleSaveActivity = async () => {
    const commentText = activityInputRef.current.value.trim();
    if (!commentText) {
      alert("Comment cannot be empty!");
      return;
    }
    const currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];
    const time = currentDate.toTimeString().split(" ")[0];
    try {
      const response = await fetch("http://127.0.0.1:8000/save_comment/", {
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
        console.log("Comment saved:", data);
        fetchComments();
        activityInputRef.current.value = "";
      } else {
        console.error("Failed to save comment. Status:", response.status);
      }
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };
  const handleDeleteComment = async (commentText) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/delete_comment/", {
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
        console.log("Comment deleted:", data.message);
        fetchComments();
      } else {
        console.error("Failed to delete comment. Status:", response.status);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  const handleEditComment = async (originalCommentText) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/edit_comment/", {
        method: "PUT", // Use PUT for updating
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId,
          boardId,
          originalCommentText,
          newCommentText: editCommentText, // Pass the new text for the comment
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Comment edited:", data.message);
        fetchComments();
        setEditingCommentIndex(null); // Close the edit mode after saving
      } else {
        console.error("Failed to edit comment. Status:", response.status);
      }
    } catch (error) {
      console.error("Error editing comment:", error);
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
                  // Display input field when editing
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
                {/* Edit and Delete options */}
                <EditText
                  onClick={() => {
                    setEditingCommentIndex(index);
                    setEditCommentText(comment.commenttext); // Set current comment text to input field
                  }}
                >
                  Edit
                </EditText>
                <DeleteText onClick={() => handleDeleteComment(comment.commenttext)}>
                  Delete
                </DeleteText>
                {/* Save button when editing */}
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
    </div>
  );
};
export default Comment;