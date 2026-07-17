import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { RxActivityLog } from "react-icons/rx";
import {
  FaUserCircle,
  FaEdit,
  FaTrashAlt,
  FaPaperclip,
  FaFileAlt,
  FaTimes,
  FaDownload,
  FaEye 
} from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "./apiRequest";

// --- Styled Components ---
const Section = styled.div`
  margin: 20px 0;
  position: relative;
`;

const SectionTitle = styled.div`
  font-size: 1.2rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  color: var(--text-main);
`;

const ActivityInput = styled.textarea`
  width: 100%;
  height: 60px;
  padding: 10px;
  padding-right: 90px; /* Space for attachment and save buttons */
  border-radius: 4px;
  border: 1px solid var(--border-subtle);
  font-size: 14px;
  background-color: var(--bg-secondary);
  color: var(--text-main);
  resize: none;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
`;

const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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

const InlineSaveButton = styled(Button)`
  position: absolute;
  right: 6px;
  bottom: 8px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  z-index: 10;
  background-color: var(--primary-accent, #4f46e5);

  &:hover {
    background-color: var(--primary-hover, #4338ca);
  }
`;

const AttachButton = styled.button`
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 50%;
  position: absolute;
  right: 60px;
  bottom: 7px;
  z-index: 10;
  transition: all 0.2s ease;
  &:hover {
    background-color: var(--bg-primary);
    color: var(--text-main);
  }
`;

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  background-color: #f1f2f6;
  padding: 5px 10px;
  border-radius: 4px;
  margin-top: 10px;
  font-size: 0.9rem;
  color: #2c3e50;
  width: fit-content;
  max-width: 100%;
`;

const RemoveFileIcon = styled.span`
  margin-left: 10px;
  color: #e74c3c;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    color: #c0392b;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const CommentsSection = styled.div`
  margin-top: 16px;
  border-radius: 8px;
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border-subtle);
    border-radius: 4px;
  }
`;

const CommentItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  position: relative;
`;

const Avatar = styled.div`
  margin-right: 12px;
  font-size: 2.2rem;
  color: var(--primary-accent, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--bg-secondary);
`;

const CommentContent = styled.div`
  background-color: var(--bg-secondary);
  color: var(--text-main);
  padding: 14px 16px;
  border-radius: 0 16px 16px 16px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CommentText = styled.div`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  white-space: pre-wrap;
  color: var(--text-main);

  .mention-tag {
    color: var(--primary-accent);
    font-weight: 600;
    background-color: var(--bg-primary);
    padding: 2px 6px;
    border-radius: 6px;
    font-size: 0.9rem;
  }
`;

const CommentAuthor = styled.span`
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-main);
`;

const CommentDate = styled.small`
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 500;
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
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 8px;
  background-color: var(--bg-secondary);
  color: var(--text-main);
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

const AttachedFile = styled.div`
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
`;

const ImageThumbnail = styled.img`
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #ddd;
  margin-bottom: 5px;
`;

const FileActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 5px;
`;

const ActionLink = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

// --- Preview Modal Styles ---
const PreviewOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const PreviewContainer = styled.div`
  background-color: white;
  width: 90%;
  height: 90%;
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PreviewHeader = styled.div`
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
`;

const PreviewBody = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e9ecef;
  overflow: auto;
  padding: 10px;
`;

const ClosePreviewButton = styled.div`
  cursor: pointer;
  font-size: 1.5rem;
  color: #333;
  &:hover { color: red; }
`;

const FullPreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
`;

const FullPreviewFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  background-color: white;
`;

// --- Confirmation Modal Styles ---
const ConfirmOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ConfirmContainer = styled.div`
  background-color: white;
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ConfirmTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #1e293b;
  font-weight: 700;
`;

const ConfirmText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.5;
`;

const ConfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

const ConfirmDeleteButton = styled(Button)`
  background-color: #ef4444;
  &:hover {
    background-color: #dc2626;
  }
`;

// --- Mentions Dropdown Styles ---
const MentionsList = styled.ul`
  position: absolute;
  top: 75px; 
  left: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 150px;
  overflow-y: auto;
  width: 250px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  z-index: 100;
`;

const MentionItem = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-main);
  
  &:hover {
    background-color: var(--bg-primary);
  }
  &:last-child {
    border-bottom: none;
  }
`;

const MemberInitial = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
`;

const Comment = ({ cardId, cardName, boardName, boardId }) => {
  const [comments, setComments] = useState([]);
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [commentText, setCommentText] = useState(""); 
  const [boardMembers, setBoardMembers] = useState([]); 
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState({ url: null, type: null, name: "" });
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const activityInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const [employeeId, setEmployeeId] = useState(null);
  const [employeeName, setEmployeeName] = useState(null);
  const Trackerbaseurl = process.env.REACT_APP_BACKEND_TRACKER_BASE_URL;

  useEffect(() => {
    if (!Trackerbaseurl) {
      console.error("Warning: REACT_APP_BACKEND_TRACKER_BASE_URL is missing in .env!");
    }
  }, [Trackerbaseurl]);

  useEffect(() => {
    const id = localStorage.getItem("employeeId");
    const name = localStorage.getItem("employeeName");
    if (id && name) {
      setEmployeeId(id);
      setEmployeeName(name);
    }
  }, []);

  useEffect(() => {
    if (boardId) {
      const fetchMembers = async () => {
        try {
          const result = await apiRequest(`${Trackerbaseurl}employees/${boardId}/`);
          if (result.success && result.data?.employees) {
            setBoardMembers(result.data.employees);
          }
        } catch (error) {
          console.error("Error fetching board members:", error);
        }
      };
      fetchMembers();
    }
  }, [boardId, Trackerbaseurl]);

  const canModifyComment = (comment) => {
    const userRole = localStorage.getItem("role");
    const isAdminOrHOD = userRole === "Admin" || userRole === "HOD";
    return (
      isAdminOrHOD ||
      String(comment.empid) === String(employeeId) ||
      comment.empname === employeeName
    );
  };

  const showSuccessToast = (message) => toast.success(message);
  const showErrorToast = (message) => toast.error(message);
  const showInfoToast = (message) => toast.info(message);

  const fetchComments = async () => {
    try {
      const queryParams = new URLSearchParams({ cardId, boardId }).toString();
      const result = await apiRequest(
        `${Trackerbaseurl}get_comments/?${queryParams}`,
        "GET"
      );

      if (result.success && result.data) {
        if (result.data.comments && Array.isArray(result.data.comments)) {
          setComments(result.data.comments);
        } else if (Array.isArray(result.data)) {
          setComments(result.data);
        } else {
          setComments([]);
        }
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [cardId, boardId]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCommentText(value);

    const match = value.match(/@([\w.]*)$/);
    if (match) {
        setMentionQuery(match[1].toLowerCase());
        setShowMentions(true);
    } else {
        setShowMentions(false);
    }
  };

  const handleSelectMember = (memberName) => {
    const newText = commentText.replace(/@([\w.]*)$/, `@${memberName} `);
    setCommentText(newText);
    setShowMentions(false);
    
    if (activityInputRef.current) {
        activityInputRef.current.focus();
    }
  };

  const filteredMembers = boardMembers.filter(m => 
    m.employeeName.toLowerCase().includes(mentionQuery)
  );

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        showErrorToast("File is too large. Max size is 5MB.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePreview = async (e, fileUrl, fileName) => {
    e.preventDefault();
    e.stopPropagation();

    setIsPreviewLoading(true);
    setShowPreviewModal(true); 

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(fileUrl, {
        method: 'GET',
        headers: {
           // UPDATED: Removed "Bearer" prefix
            Authorization: token ,
        },
      });

      if (!response.ok) throw new Error("Preview failed");

      const blob = await response.blob();
      const mimeType = blob.type || 'application/pdf';
      const objectUrl = window.URL.createObjectURL(blob);

      setPreviewData({
        url: objectUrl,
        type: mimeType,
        name: fileName
      });

    } catch (error) {
      console.error("Preview Error:", error);
      showErrorToast("Failed to load preview.");
      setShowPreviewModal(false);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const closePreview = () => {
    setShowPreviewModal(false);
    if (previewData.url) {
      window.URL.revokeObjectURL(previewData.url); 
    }
    setPreviewData({ url: null, type: null, name: "" });
  };

  const handleDownload = async (e, fileUrl, fileName) => {
    e.preventDefault();
    e.stopPropagation();

    try {
        const token = localStorage.getItem("token"); 
        
        const response = await fetch(fileUrl, {
            method: 'GET',
            headers: {
               // UPDATED: Removed "Bearer" prefix
            Authorization: token ,

            },
        });

        if (!response.ok) throw new Error("Download failed");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); 
        document.body.appendChild(link);
        link.click();
        
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Download Error:", error);
        showErrorToast("Failed to download file. Please check connection.");
    }
  };
  
const handleSaveActivity = async () => {
  if (isSubmitting) return;

  if (!commentText.trim() && !selectedFile) {
    showErrorToast("Please enter a comment or attach a file.");
    return;
  }

  setIsSubmitting(true);

  try {
    const currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];
    const time = currentDate.toTimeString().split(" ")[0];

    const formData = new FormData();
    formData.append("text", commentText.trim());
    formData.append("cardId", String(cardId));
    formData.append("boardId", String(boardId));
    formData.append("employeeId", String(employeeId));
    formData.append("employeeName", String(employeeName));
    formData.append("date", date);
    formData.append("time", time);

    const mentionedEmployees = [];
    boardMembers.forEach(member => {
      if (commentText.includes(`@${member.employeeName}`)) {
        mentionedEmployees.push(member);
      }
    });
    formData.append("mentionedEmployees", JSON.stringify(mentionedEmployees));

    if (selectedFile) {
      formData.append("file", selectedFile); // ✅ binary
    }

    const response = await fetch(
      `${Trackerbaseurl}save_comment/`,
      {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("access_token"),
          // ❌ DO NOT SET Content-Type
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {
      showSuccessToast("Comment posted successfully");
      removeSelectedFile();
      setCommentText("");
      await fetchComments();
    } else {
      showErrorToast(result.error || "Failed to save comment");
    }

  } catch (err) {
    console.error(err);
    showErrorToast("Server connection failed");
  } finally {
    setIsSubmitting(false);
  }
};


  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      const payload = {
        cardId: String(cardId),
        boardId: String(boardId),
        commentId: commentToDelete.commentId,
        commenttext: commentToDelete.commenttext,
      };

      const result = await apiRequest(
        `${Trackerbaseurl}delete_comment/`,
        "DELETE",
        payload
      );

      if (result.success) {
        showSuccessToast("Comment removed successfully");
        fetchComments();
      } else {
        showErrorToast(result.error || "Unable to delete");
      }
    } catch (error) {
      showErrorToast("Connection failed.");
    } finally {
      setCommentToDelete(null);
    }
  };

  const handleEditComment = async (comment) => {
    if (!editCommentText.trim()) {
      showErrorToast("Comment cannot be empty!");
      return;
    }

    try {
      const payload = {
        cardId: String(cardId),
        boardId: String(boardId),
        commentId: comment.commentId,
        originalCommentText: comment.commenttext,
        newCommentText: editCommentText,
      };

      const result = await apiRequest(
        `${Trackerbaseurl}edit_comment/`,
        "PUT",
        payload
      );

      if (result.success) {
        showInfoToast("Changes saved");
        fetchComments();
        setEditingCommentIndex(null);
        setEditCommentText("");
      } else {
        showErrorToast(result.error || "Unable to edit");
      }
    } catch (error) {
      showErrorToast("Connection failed.");
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

  const handleKeyPress = (e) => {
    if (showMentions) return;

    if (e.key === "Enter" && e.ctrlKey) {
      handleSaveActivity();
    }
  };

  const isImage = (filename) => {
    if (!filename) return false;
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
  };

  const joinUrl = (base, path) => {
  if (!path) return "";

  // Absolute URL → return as-is
  if (path.startsWith("http")) return path;

  const cleanBase = base.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");

  return `${cleanBase}/${cleanPath}`;
};

const getFileUrl = (comment) => {
  if (!comment) return "";

  // Preferred: GridFS file_id (BEST)
  if (comment.file?.file_id) {
    return `${Trackerbaseurl.replace(/\/$/, "")}/download_file/${comment.file.file_id}/`;
  }

  // Legacy stored file_url (strip /tracker/)
  if (comment.file_url) {
    let path = comment.file_url;

    // 🔥 CRITICAL FIX
    path = path.replace(/^\/?tracker\//i, "");

    return `${Trackerbaseurl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  }

  return "";
};

  const renderCommentWithTags = (text) => {
    if (!text) return null;
    const parts = text.split(/(@[\w.]+)/g);

    return parts.map((part, i) => {
        if (part.match(/^@[\w.]+/)) {
            return <span key={i} className="mention-tag">{part}</span>;
        }
        return part;
    });
  };

  return (
    <div>
      <Section>
        <SectionTitle>
          <RxActivityLog style={{ fontSize: "1rem", marginRight: "10px", fontWeight: "bold" }} />
          Activity
        </SectionTitle>
        
        <InputWrapper>
          <ActivityInput
            placeholder="Add a comment... Type '@' to tag a member (Ctrl+Enter to submit)"
            ref={activityInputRef}
            value={commentText} 
            onChange={handleInputChange} 
            onKeyDown={handleKeyPress}
          />
          <AttachButton 
            onClick={() => fileInputRef.current.click()} 
            title="Attach a file"
          >
            <FaPaperclip />
          </AttachButton>
          <HiddenInput 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
          />
          <InlineSaveButton onClick={handleSaveActivity} disabled={isSubmitting}>
            {isSubmitting ? "..." : "Save"}
          </InlineSaveButton>
        </InputWrapper>

        {showMentions && filteredMembers.length > 0 && (
            <MentionsList>
                {filteredMembers.map((member) => (
                    <MentionItem 
                        key={member.employeeId} 
                        onClick={() => handleSelectMember(member.employeeName)}
                    >
                        <MemberInitial>{member.employeeName.charAt(0)}</MemberInitial>
                        {member.employeeName}
                    </MentionItem>
                ))}
            </MentionsList>
        )}

        {selectedFile && (
          <FilePreview>
            <FaFileAlt style={{ marginRight: "5px" }} />
            {selectedFile.name}
            <RemoveFileIcon onClick={removeSelectedFile} title="Remove file">
              <FaTimes />
            </RemoveFileIcon>
          </FilePreview>
        )}

      </Section>

      <CommentsSection>
        {comments.length > 0 ? (
          comments.map((comment, index) => {
            const fileUrl = getFileUrl(comment);
            const fileName = comment.file_name || comment.filename || "downloaded_file";
            return (
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
                        autoFocus
                      />
                      <EditActions>
                        <EditButton
                          onClick={() => handleEditComment(comment)}
                          disabled={!editCommentText.trim()}
                        >
                          Save
                        </EditButton>
                        <CancelButton onClick={cancelEditing}>Cancel</CancelButton>
                      </EditActions>
                    </>
                  ) : (
                    <>
                      <div style={{ margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CommentAuthor>{comment.empname || "Anonymous"}</CommentAuthor>
                        <CommentDate>{comment.date} at {comment.time}</CommentDate>
                      </div>
                      
                      <CommentText>{renderCommentWithTags(comment.commenttext)}</CommentText>

                      {fileUrl && (comment.file_url || comment.file_id) && (
                        <AttachedFile>
                          <div style={{fontSize: '0.9rem', marginBottom: '5px', fontWeight: '500', color: '#555'}}>
                             {fileName}
                          </div>

                          {isImage(fileName) && (
                             <div 
                                onClick={(e) => handlePreview(e, fileUrl, fileName)} 
                                style={{cursor: 'pointer'}} 
                                title="Click to Preview"
                             >
                                <ImageThumbnail src={fileUrl} alt="attachment" />
                             </div>
                          )}

                          <FileActions>
                            <ActionLink onClick={(e) => handlePreview(e, fileUrl, fileName)} title="Preview File">
                               <FaEye /> Preview
                            </ActionLink>
                            <ActionLink onClick={(e) => handleDownload(e, fileUrl, fileName)} title="Download File">
                               <FaDownload /> Download
                            </ActionLink>
                          </FileActions>
                        </AttachedFile>
                      )}

                      {canModifyComment(comment) && (
                        <ActionIcons>
                          <ActionIcon
                            onClick={() => startEditing(index, comment.commenttext)}
                            title="Edit comment"
                          >
                            <FaEdit />
                          </ActionIcon>
                          <ActionIcon
                            className="delete-icon"
                            onClick={() => setCommentToDelete(comment)}
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
            );
          })
        ) : (
          <p>No comments available.</p>
        )}
      </CommentsSection>

      {commentToDelete && (
        <ConfirmOverlay onClick={() => setCommentToDelete(null)}>
          <ConfirmContainer onClick={(e) => e.stopPropagation()}>
            <ConfirmTitle>Delete Comment</ConfirmTitle>
            <ConfirmText>Are you sure you want to delete this comment? This action cannot be undone.</ConfirmText>
            <ConfirmActions>
              <CancelButton onClick={() => setCommentToDelete(null)}>Cancel</CancelButton>
              <ConfirmDeleteButton onClick={handleDeleteComment}>Delete</ConfirmDeleteButton>
            </ConfirmActions>
          </ConfirmContainer>
        </ConfirmOverlay>
      )}

      {showPreviewModal && (
        <PreviewOverlay onClick={closePreview}>
          <PreviewContainer onClick={(e) => e.stopPropagation()}>
            <PreviewHeader>
                <span>{previewData.name || "File Preview"}</span>
                <ClosePreviewButton onClick={closePreview}>
                    <FaTimes />
                </ClosePreviewButton>
            </PreviewHeader>
            
            <PreviewBody>
                {isPreviewLoading ? (
                    <div style={{color: '#666', fontSize: '1.2rem'}}>Loading file...</div>
                ) : (
                    previewData.type && previewData.type.startsWith('image/') ? (
                        <FullPreviewImage src={previewData.url} alt="Preview" />
                    ) : (
                        <FullPreviewFrame src={previewData.url} title="File Preview" />
                    )
                )}
            </PreviewBody>
          </PreviewContainer>
        </PreviewOverlay>
      )}
    </div>
  );
};

export default Comment;