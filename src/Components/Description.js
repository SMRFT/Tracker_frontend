import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  FaTimes,
  FaEdit,
  FaBold,
  FaItalic,
  FaLink,
  FaImage,
  FaDownload,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import { GrTextAlignFull, GrAttachment } from "react-icons/gr";
import { BsFiletypeDocx } from "react-icons/bs";
import apiRequest from "./apiRequest";

// Modern UI Colors
const colors = {
  primary: "#4361ee",
  primaryHover: "#3a56d4",
  background: "var(--bg-primary)",
  cardBackground: "var(--bg-secondary)",
  text: "var(--text-main)",
  lightText: "var(--text-muted)",
  border: "var(--border-subtle)",
  success: "#2ecc71",
  danger: "#e74c3c",
  warning: "#f39c12",
  inputBg: "var(--bg-primary)",
};

// Container Components
const Container = styled.div`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, sans-serif;
  color: ${colors.text};
`;

const Section = styled.div`
  margin: 24px 0;
  background: ${colors.cardBackground};
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  overflow: visible;
  position: relative;
`;

const SectionHeader = styled.div`
  padding: 16px 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${colors.border};
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

const SectionTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionContent = styled.div`
  padding: 0;
  overflow: visible;
`;

// Button Components
const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
`;

const PrimaryButton = styled(Button)`
  background-color: ${colors.primary};
  color: white;

  &:hover {
    background-color: ${colors.primaryHover};
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: ${colors.text};

  &:hover {
    background-color: ${colors.border};
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${colors.lightText};
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.border};
    color: ${colors.text};
  }
`;

const ActionIcon = styled(IconButton)`
  margin-left: 8px;
  font-size: 1rem;
  color: ${colors.primary};

  &:hover {
    color: ${colors.primaryHover};
    background-color: rgba(67, 97, 238, 0.1);
  }
`;

// Editor Components
const Toolbar = styled.div`
  display: flex;
  align-items: center;
  background-color: ${colors.cardBackground};
  padding: 8px 16px;
  border-bottom: 1px solid ${colors.border};
  gap: 4px;
  position: relative;
  z-index: 50;
  overflow: visible;
`;

const ToolbarButton = styled(IconButton)`
  position: relative;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${colors.cardBackground};
  border-radius: 8px;
  border: 1px solid ${colors.border};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 220px;
  max-height: 240px;
  overflow-y: auto;
`;

const DropdownItem = styled.div`
  padding: 10px 16px;
  font-size: 14px;
  color: ${colors.text};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: ${colors.background};
  }

  span {
    color: ${colors.lightText};
    font-size: 12px;
  }
`;

const DescriptionInputContainer = styled.div`
  position: relative;
`;

const DescriptionInput = styled.div`
  width: 100%;
  min-height: 120px;
  padding: 16px;
  font-size: 14px;
  background-color: ${colors.inputBg};
  color: ${colors.text};
  line-height: 1.6;
  font-family: inherit;
  overflow-y: auto;
  white-space: pre-wrap;

  &:focus {
    outline: none;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 12px;
    margin-bottom: 12px;
    font-weight: 600;
  }

  h1 {
    font-size: 1.8rem;
  }
  h2 {
    font-size: 1.5rem;
  }
  h3 {
    font-size: 1.3rem;
  }
  h4 {
    font-size: 1.1rem;
  }
  h5 {
    font-size: 1rem;
  }
  h6 {
    font-size: 0.9rem;
  }

  strong {
    font-weight: 600;
  }
`;

const DescriptionView = styled.div`
  flex: 1;
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  color: ${colors.text};
  white-space: pre-wrap;
  word-break: break-word;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 12px;
    margin-bottom: 12px;
    font-weight: 600;
  }

  h1 {
    font-size: 1.8rem;
  }
  h2 {
    font-size: 1.5rem;
  }
  h3 {
    font-size: 1.3rem;
  }
  h4 {
    font-size: 1.1rem;
  }
  h5 {
    font-size: 1rem;
  }
  h6 {
    font-size: 0.9rem;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 12px 16px;
  background-color: ${colors.cardBackground};
  gap: 8px;
`;

const AddDescriptionButton = styled.button`
  background-color: transparent;
  border: 1px dashed ${colors.border};
  color: ${colors.primary};
  padding: 12px 16px;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(67, 97, 238, 0.05);
    border-color: ${colors.primary};
  }
`;

// Attachment Components
const AttachmentsList = styled.div`
  padding: 16px;
`;

const AttachmentItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 12px;
  background-color: ${colors.background};
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const AttachmentPreview = styled.div`
  margin-right: 16px;
`;

const AttachmentInfo = styled.div`
  flex: 1;
`;

const AttachmentFileName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const AttachmentMeta = styled.div`
  font-size: 12px;
  color: ${colors.lightText};
  margin-bottom: 8px;
`;

const AttachmentActions = styled.div`
  display: flex;
  gap: 8px;
`;

const LoadingSpinner = styled.div`
  padding: 20px;
  text-align: center;
  color: ${colors.lightText};
`;

// Toast Notification Components
const ToastContainer = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Toast = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: ${(props) =>
    props.type === "success"
      ? colors.success
      : props.type === "error"
      ? colors.danger
      : props.type === "warning"
      ? colors.warning
      : colors.primary};
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  max-width: 450px;
  animation: slideIn 0.3s ease-out forwards;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const ToastMessage = styled.div`
  flex: 1;
  margin-right: 8px;
  font-size: 14px;
  font-weight: 500;
`;

const CloseToast = styled.button`
  background: none;
  border: none;
  color: white;
  opacity: 0.7;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  backdrop-filter: blur(4px);
`;

const PreviewModalContainer = styled.div`
  background-color: ${colors.cardBackground};
  width: 90vw;
  max-width: 900px;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  max-height: 88vh;
`;

const PreviewModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${colors.border};
`;

const PreviewTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
`;

const PreviewModalBody = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  flex: 1;
`;

// Main Component
const Description = ({ cardId, cardName, boardName, boardId, onDescriptionUpdate }) => {
  const [previewModalItem, setPreviewModalItem] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(true);
  const descriptionRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [isEditing, setEditing] = useState(false);
  const [employeeName, setEmployeeName] = useState();
  const [role, setRole] = useState();
  const [imageArray, setImageArray] = useState([]);
  const imagesFetched = useRef(new Set());

  // Mock base URL for demonstration
  const Trackerbaseurl = process.env.REACT_APP_BACKEND_TRACKER_BASE_URL;

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  const hasAdminAccess = () => {
    return role === "Admin" || role === "HOD";
  };

  useEffect(() => {
    const name = localStorage.getItem("employeeName");
    const role = localStorage.getItem("role");

    setEmployeeName(name);
    setRole(role);
  }, []);

  // Function to show toast notification
  const showToast = (message, type = "success", duration = 3000) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const applyHeading = (headingType) => {
    document.execCommand("formatBlock", false, headingType);
    setDropdownOpen(false);
  };

  const applyFormat = (format) => {
    if (format === "bold") {
      document.execCommand("bold", false, null);
    } else if (format === "italic") {
      document.execCommand("italic", false, null);
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current.click();
  };

  const handleImageAttach = () => {
    imageInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      showToast(
        `File '${selectedFile.name}' selected and ready to upload`,
        "info"
      );
    }
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);
      showToast(
        `Image '${selectedImage.name}' selected and ready to upload`,
        "info"
      );
    }
  };

  const handleSaveDescription = async () => {
    const text = descriptionRef.current ? descriptionRef.current.innerHTML : "";

    try {
      const response = await apiRequest(
        `${Trackerbaseurl}save-description/`,
        "POST",
        {
          cardId,
          boardId,
          cardName,
          boardName,
          description: text,
        }
      );

      if (response.success) {
        setEditing(false);
        setDescription(text);
        if (onDescriptionUpdate) onDescriptionUpdate(text);
        showToast("Description saved successfully", "success");
        console.log("Description saved successfully:", response.data);
      } else {
        console.error("Error saving description:", response.error);
        showToast(
          response.error || "Failed to save description. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error saving description:", error);
      showToast("Failed to save description. Please try again.", "error");
    }
  };

  const fetchDescription = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(
        `${Trackerbaseurl}save-description/?cardId=${cardId}&boardId=${boardId}`,
        "GET"
      );

      if (response.success) {
        console.log("Description fetched successfully:", response.data);

        if (response.data && response.data.description) {
          setDescription(response.data.description);
          if (onDescriptionUpdate) onDescriptionUpdate(response.data.description);
        } else {
          setDescription("");
          if (onDescriptionUpdate) onDescriptionUpdate("");
          console.log("No description found for this card");
        }
      } else {
        console.error("Error fetching description:", response.error);
        setDescription("");
        showToast(response.error || "Failed to load description", "error");
      }
    } catch (error) {
      console.error("Error fetching description:", error);
      setDescription("");
      showToast("Failed to load description", "error");
    } finally {
      setLoading(false);
    }
  };

  // Update the content editable div when description changes
  useEffect(() => {
    if (descriptionRef.current && description !== null) {
      descriptionRef.current.innerHTML = description || "";
    }
  }, [description, isEditing]);

  // Fixed fetchFiles function
  const fetchFiles = async () => {
    setFilesLoading(true);
    try {
      const response = await apiRequest(
        `${Trackerbaseurl}get-file/${boardId}/${cardId}/`,
        "GET"
      );

      if (response.success) {
        console.log("Fetched files:", response.data);

        if (Array.isArray(response.data) && response.data.length > 0) {
          const uniqueFiles = response.data.filter(
            (file) =>
              !files.some(
                (existingFile) => existingFile.filename === file.filename
              )
          );

          setFiles(uniqueFiles);
        } else {
          setFiles([]);
          console.log("No files found for this card");
        }
      } else {
        console.error("Error fetching files:", response.error);
        setFiles([]);
        showToast(response.error || "Failed to load attachments", "error");
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      setFiles([]);
      showToast("Failed to load attachments", "error");
    } finally {
      setFilesLoading(false);
    }
  };

  const fetchAndStoreImage = async (file) => {
    if (!file || !file.filename) return;

    const filename = file.filename.trim();
    if (imagesFetched.current.has(filename)) return;

    imagesFetched.current.add(filename);

    try {
      const imageResponse = await fetch(
        `${Trackerbaseurl}get-files/?filename=${encodeURIComponent(filename)}&cardId=${cardId}&boardId=${boardId}`,
        {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("access_token") || "",
          },
        }
      );

      if (imageResponse.ok) {
        const blob = await imageResponse.blob();
        const fileType =
          imageResponse.headers.get("content-type") ||
          file.contentType ||
          "application/octet-stream";

        setImageArray((prevArray) => [
          ...prevArray.filter((image) => image.filename !== filename),
          {
            src: URL.createObjectURL(blob),
            filename: filename,
            type: fileType,
            employeeName: file.employeeName || "User",
            uploadDate: file.uploadDate,
          },
        ]);
      } else {
        imagesFetched.current.delete(filename);
        console.error(`Failed to fetch attachment ${filename}: HTTP ${imageResponse.status}`);
      }
    } catch (error) {
      imagesFetched.current.delete(filename);
      console.error(`Error fetching image for ${filename}:`, error);
    }
  };

  useEffect(() => {
    if (files.length > 0) {
      files.forEach((file) => fetchAndStoreImage(file));
    } else {
      setImageArray([]);
      imagesFetched.current.clear();
    }
  }, [files]);

  useEffect(() => {
    fetchFiles();
  }, [cardId, boardId]);

  const handleDownload = (filename) => {
    window.open(`${Trackerbaseurl}get-files/?filename=${filename}`, "_blank");
    showToast(`Downloading ${filename}`, "info");
  };

  const handleSaveFilesImages = async () => {
    const formData = new FormData();
    let uploadedItems = [];

    if (file) {
      formData.append("file", file);
      uploadedItems.push(`file '${file.name}'`);
    }
    if (image) {
      formData.append("image", image);
      uploadedItems.push(`image '${image.name}'`);
    }

    if (uploadedItems.length === 0) return;

    const currentEmpId = localStorage.getItem("employeeId") || "";
    const currentEmpName = localStorage.getItem("employeeName") || employeeName || "";

    formData.append("cardId", cardId);
    formData.append("cardName", cardName);
    formData.append("boardId", boardId);
    formData.append("employeeId", currentEmpId);
    formData.append("employeeName", currentEmpName);

    try {
      const token = localStorage.getItem("access_token");
      const headers = {};
      if (token) {
        headers["Authorization"] = token;
      }
      const response = await fetch(`${Trackerbaseurl}upload-content/`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(
          "Files, images, and card details uploaded successfully:",
          data
        );
        showToast(
          `Successfully uploaded ${uploadedItems.join(" and ")}`,
          "success"
        );

        setFile(null);
        setImage(null);
        await fetchFiles();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error uploading files and images:", error);
      showToast("Failed to upload attachments. Please try again.", "error");
    }
  };

  const handleSave = async () => {
    await handleSaveDescription();
    if (file || image) {
      await handleSaveFilesImages();
    }
  };

  const handleDeleteFile = async (filename) => {
    try {
      await apiRequest(
        `${Trackerbaseurl}delete-file/${boardId}/${cardId}/${filename}/`,
        "DELETE"
      );
      setFiles((prevFiles) =>
        prevFiles.filter((file) => file.filename !== filename)
      );
      setImageArray((prevImages) =>
        prevImages.filter((image) => image.filename !== filename)
      );
      imagesFetched.current.delete(filename);
      showToast(`Successfully deleted ${filename}`, "success");
      console.log(`File ${filename} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting file ${filename}:`, error);
      showToast(`Failed to delete ${filename}`, "error");
    }
  };

  // Fetch description on component mount
  useEffect(() => {
    fetchDescription();
  }, [cardId, boardId]);

  return (
    <Container>
      {/* Toast Notifications */}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast key={toast.id} type={toast.type}>
            <ToastMessage>{toast.message}</ToastMessage>
            <CloseToast onClick={() => removeToast(toast.id)}>
              <FaTimes />
            </CloseToast>
          </Toast>
        ))}
      </ToastContainer>

      {/* Description Section */}
      <Section>
        <SectionHeader>
          <SectionTitle>
            <GrTextAlignFull /> Description
          </SectionTitle>
        </SectionHeader>

        <SectionContent>
          {loading ? (
            <LoadingSpinner>Loading description...</LoadingSpinner>
          ) : isEditing && hasAdminAccess() ? (
            // Editing Mode (Only for Admin/HOD)
            <DescriptionInputContainer>
              <Toolbar>
                <ToolbarButton onClick={toggleDropdown} title="Text Format">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    Aa <RiArrowDropDownLine />
                  </div>
                  {isDropdownOpen && (
                    <Dropdown>
                      <DropdownItem onClick={() => applyHeading("p")}>
                        Normal text <span>Ctrl+Alt+0</span>
                      </DropdownItem>
                      <DropdownItem onClick={() => applyHeading("h1")}>
                        Heading 1 <span>Ctrl+Alt+1</span>
                      </DropdownItem>
                      <DropdownItem onClick={() => applyHeading("h2")}>
                        Heading 2 <span>Ctrl+Alt+2</span>
                      </DropdownItem>
                      <DropdownItem onClick={() => applyHeading("h3")}>
                        Heading 3 <span>Ctrl+Alt+3</span>
                      </DropdownItem>
                      <DropdownItem onClick={() => applyHeading("h4")}>
                        Heading 4 <span>Ctrl+Alt+4</span>
                      </DropdownItem>
                      <DropdownItem onClick={() => applyHeading("h5")}>
                        Heading 5 <span>Ctrl+Alt+5</span>
                      </DropdownItem>
                      <DropdownItem onClick={() => applyHeading("h6")}>
                        Heading 6 <span>Ctrl+Alt+6</span>
                      </DropdownItem>
                    </Dropdown>
                  )}
                </ToolbarButton>
                <ToolbarButton onClick={() => applyFormat("bold")} title="Bold">
                  <FaBold />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => applyFormat("italic")}
                  title="Italic"
                >
                  <FaItalic />
                </ToolbarButton>
                <ToolbarButton onClick={handleFileAttach} title="Attach File">
                  <FaLink />
                </ToolbarButton>
                <ToolbarButton onClick={handleImageAttach} title="Attach Image">
                  <FaImage />
                </ToolbarButton>
              </Toolbar>

              <DescriptionInput
                contentEditable
                ref={descriptionRef}
                dangerouslySetInnerHTML={{ __html: description }}
              />

              <Actions>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                  {file && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: colors.lightText,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "4px",
                      }}
                    >
                      <span>Selected file: {file.name}</span>
                      <SecondaryButton
                        style={{ padding: "2px 6px", fontSize: "11px" }}
                        onClick={() =>
                          setPreviewModalItem({
                            src: URL.createObjectURL(file),
                            filename: file.name,
                            type: file.type,
                          })
                        }
                      >
                        <FaEye size={10} /> Preview
                      </SecondaryButton>
                      <IconButton
                        title="Remove file"
                        style={{ width: "20px", height: "20px", color: colors.danger }}
                        onClick={() => setFile(null)}
                      >
                        <FaTimes size={12} />
                      </IconButton>
                    </div>
                  )}
                  {image && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: colors.lightText,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span>Selected image: {image.name}</span>
                      <SecondaryButton
                        style={{ padding: "2px 6px", fontSize: "11px" }}
                        onClick={() =>
                          setPreviewModalItem({
                            src: URL.createObjectURL(image),
                            filename: image.name,
                            type: image.type,
                          })
                        }
                      >
                        <FaEye size={10} /> Preview
                      </SecondaryButton>
                      <IconButton
                        title="Remove image"
                        style={{ width: "20px", height: "20px", color: colors.danger }}
                        onClick={() => setImage(null)}
                      >
                        <FaTimes size={12} />
                      </IconButton>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <SecondaryButton
                    onClick={() => {
                      setEditing(false);
                      setFile(null);
                      setImage(null);
                      showToast("Edit cancelled", "info");
                    }}
                  >
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton onClick={handleSave}>Save</PrimaryButton>
                </div>
              </Actions>
            </DescriptionInputContainer>
          ) : (
            // View Mode
            <>
              {description ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: "16px",
                  }}
                >
                  <DescriptionView
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                  {hasAdminAccess() && (
                    <ActionIcon
                      onClick={() => {
                        setEditing(true);
                        showToast("Editing description", "info");
                      }}
                      title="Edit Description"
                    >
                      <FaEdit />
                    </ActionIcon>
                  )}
                </div>
              ) : (
                // No description - show add button only for Admin/HOD
                hasAdminAccess() && (
                  <div style={{ padding: "16px" }}>
                    <AddDescriptionButton
                      onClick={() => {
                        setEditing(true);
                        showToast("Adding new description", "info");
                      }}
                    >
                      Add description
                    </AddDescriptionButton>
                  </div>
                )
              )}
            </>
          )}
        </SectionContent>
      </Section>

      {/* Attachments Section */}
      {imageArray.length > 0 && (
        <Section>
          <SectionHeader>
            <SectionTitle>
              <GrAttachment /> Attachments
            </SectionTitle>
          </SectionHeader>

          <SectionContent>
            {filesLoading ? (
              <LoadingSpinner>Loading attachments...</LoadingSpinner>
            ) : (
              <AttachmentsList>
                {imageArray.map((imgItem, index) => (
                  <AttachmentItem key={index}>
                    <AttachmentPreview
                      style={{ cursor: "pointer" }}
                      onClick={() => setPreviewModalItem(imgItem)}
                      title="Click to preview attachment"
                    >
                      {imgItem.type?.startsWith("image/") || imgItem.filename?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                        <img
                          src={imgItem.src}
                          alt={imgItem.filename}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      ) : imgItem.filename?.endsWith(".docx") ? (
                        <BsFiletypeDocx
                          style={{ fontSize: "3rem", color: "#4285F4" }}
                        />
                      ) : (
                        <GrAttachment
                          style={{ fontSize: "2rem", color: colors.lightText }}
                        />
                      )}
                    </AttachmentPreview>

                    <AttachmentInfo>
                      <AttachmentFileName
                        style={{ cursor: "pointer" }}
                        onClick={() => setPreviewModalItem(imgItem)}
                        title="Click to preview attachment"
                      >
                        {imgItem.filename}
                      </AttachmentFileName>
                      <AttachmentMeta>
                        Uploaded by: {imgItem.employeeName} •{" "}
                        {new Date(imgItem.uploadDate).toLocaleString()}
                      </AttachmentMeta>
                      <AttachmentActions>
                        <SecondaryButton
                          onClick={() => setPreviewModalItem(imgItem)}
                        >
                          <FaEye size={12} /> Preview
                        </SecondaryButton>
                        {hasAdminAccess() && (
                          <SecondaryButton
                            onClick={() => handleDeleteFile(imgItem.filename)}
                            style={{ color: colors.danger }}
                          >
                            <FaTrash size={12} /> Delete
                          </SecondaryButton>
                        )}
                      </AttachmentActions>
                    </AttachmentInfo>
                  </AttachmentItem>
                ))}
              </AttachmentsList>
            )}
          </SectionContent>
        </Section>
      )}

      {/* Attachment Preview Modal */}
      {previewModalItem && (
        <ModalOverlay onClick={() => setPreviewModalItem(null)}>
          <PreviewModalContainer onClick={(e) => e.stopPropagation()}>
            <PreviewModalHeader>
              <PreviewTitle>{previewModalItem.filename || previewModalItem.name}</PreviewTitle>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {previewModalItem.filename && (
                  <SecondaryButton
                    onClick={() => handleDownload(previewModalItem.filename)}
                    style={{
                      background: colors.primary,
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      border: "none",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <FaDownload size={11} /> Download
                  </SecondaryButton>
                )}
                <IconButton onClick={() => setPreviewModalItem(null)} style={{ color: colors.text }}>
                  <FaTimes size={16} />
                </IconButton>
              </div>
            </PreviewModalHeader>
            <PreviewModalBody>
              {previewModalItem.type?.startsWith("image/") || previewModalItem.filename?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                <img
                  src={previewModalItem.src}
                  alt={previewModalItem.filename || previewModalItem.name}
                  style={{ maxWidth: "100%", maxHeight: "75vh", objectFit: "contain", borderRadius: "8px" }}
                />
              ) : previewModalItem.type === "application/pdf" || previewModalItem.filename?.endsWith(".pdf") ? (
                <iframe
                  src={previewModalItem.src}
                  title={previewModalItem.filename || previewModalItem.name}
                  style={{ width: "100%", height: "75vh", border: "none", borderRadius: "8px" }}
                />
              ) : (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <GrAttachment size={48} style={{ color: colors.lightText, marginBottom: "16px" }} />
                  <h4 style={{ margin: "0 0 8px 0" }}>{previewModalItem.filename || previewModalItem.name}</h4>
                  <p style={{ color: colors.lightText, fontSize: "14px" }}>
                    Direct inline preview is not available for this file type. Click download to view.
                  </p>
                </div>
              )}
            </PreviewModalBody>
          </PreviewModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Description;
