import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import styled from "styled-components";
import { FaTimes, FaEdit, FaBold, FaItalic, FaLink, FaImage, FaDownload, FaTrash } from 'react-icons/fa';
import { RiArrowDropDownLine } from "react-icons/ri";
import { GrTextAlignFull, GrAttachment } from "react-icons/gr";
import { BsFiletypeDocx } from "react-icons/bs";

// Modern UI Colors
const colors = {
  primary: "#4361ee",
  primaryHover: "#3a56d4",
  background: "#f8f9fa",
  cardBackground: "#ffffff",
  text: "#2b2d42",
  lightText: "#6c757d",
  border: "#e9ecef",
  success: "#2ecc71",
  danger: "#e74c3c",
  warning: "#f39c12",
  inputBg: "#f1f3f5"
};

// Container Components
const Container = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  color: ${colors.text};
`;

const Section = styled.div`
  margin: 24px 0;
  background: ${colors.cardBackground};
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 16px 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${colors.border};
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
`;

const ToolbarButton = styled(IconButton)`
  position: relative;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  background-color: ${colors.cardBackground};
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 220px;
  overflow: hidden;
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
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 12px;
    margin-bottom: 12px;
    font-weight: 600;
  }
  
  h1 { font-size: 1.8rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.3rem; }
  h4 { font-size: 1.1rem; }
  h5 { font-size: 1rem; }
  h6 { font-size: 0.9rem; }
  
  strong { font-weight: 600; }
`;

const DescriptionView = styled.div`
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  color: ${colors.text};
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 12px;
    margin-bottom: 12px;
    font-weight: 600;
  }
  
  h1 { font-size: 1.8rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.3rem; }
  h4 { font-size: 1.1rem; }
  h5 { font-size: 1rem; }
  h6 { font-size: 0.9rem; }
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
  background-color: ${props => 
    props.type === 'success' ? colors.success : 
    props.type === 'error' ? colors.danger : 
    props.type === 'warning' ? colors.warning : colors.primary};
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

// Main Component
const Description = ({ cardId, cardName, boardName, boardId }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [description, setDescription] = useState(null);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const descriptionRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [isEditing, setEditing] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeName, setEmployeeName] = useState(null);
  const [imageArray, setImageArray] = useState([]);
  const imagesFetched = useRef(new Set());
  
  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem('employeeId');
    const name = localStorage.getItem('employeeName');
    if (id && name) {
      setEmployeeId(id);
      setEmployeeName(name);
    }
  }, []);

  // Function to show toast notification
  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    
    // Auto remove toast after duration
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, duration);
  };

  // Function to manually remove a toast
  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const applyHeading = (headingType) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.extractContents();
      const headingElement = document.createElement(headingType);
      headingElement.appendChild(selectedText);
      range.insertNode(headingElement);

      const newRange = document.createRange();
      newRange.selectNodeContents(headingElement);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
    setDropdownOpen(false);
  };

  const applyFormat = (format) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.extractContents();
      let formatElement;

      if (format === "bold") {
        formatElement = document.createElement("strong");
      } else if (format === "italic") {
        formatElement = document.createElement("em");
      }

      if (
        formatElement &&
        range.startContainer.parentNode.tagName.toLowerCase() === formatElement.tagName.toLowerCase()
      ) {
        // If already formatted, remove the format by replacing the node with its contents
        const parentNode = range.startContainer.parentNode;
        const fragment = document.createDocumentFragment();
        while (parentNode.firstChild) {
          fragment.appendChild(parentNode.firstChild);
        }
        parentNode.parentNode.replaceChild(fragment, parentNode);
      } else if (formatElement) {
        formatElement.appendChild(selectedText);
        range.insertNode(formatElement);
        const newRange = document.createRange();
        newRange.setStartAfter(formatElement);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
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
      showToast(`File '${selectedFile.name}' selected and ready to upload`, 'info');
    }
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);
      showToast(`Image '${selectedImage.name}' selected and ready to upload`, 'info');
    }
  };

  const handleSaveDescription = async () => {
    const text = descriptionRef.current.textContent;
  
    try {
      const response = await fetch("https://tracker.shinovadatabase.in/save-description/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId,
          boardId,
          cardName,
          boardName,
          description: text,
        }),
      });
  
      const data = await response.json();
      setEditing(false);
      setDescription(text);
      showToast("Description saved successfully", "success");
      console.log("Description saved successfully:", data);
    } catch (error) {
      console.error("Error saving description:", error);
      showToast("Failed to save description. Please try again.", "error");
    }
  };

  const fetchDescription = async () => {
    try {
      const response = await fetch(
        `https://tracker.shinovadatabase.in/save-description/?cardId=${cardId}&boardId=${boardId}`,
        {
          method: "GET",
        }
      );
  
      const data = await response.json();
      if (response.ok) {
        console.log("Description fetched successfully:", data);
        setDescription(data.description);
      } else {
        console.error("Error fetching description:", data.error);
        showToast("Failed to load description", "error");
      }
    } catch (error) {
      console.error("Error fetching description:", error);
      showToast("Failed to load description", "error");
    }
  };
  
  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.textContent = description;
    }
  }, [description]);

  // Function to fetch the files
  const fetchFiles = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/get-file/${boardId}/${cardId}/`);
      const data = await response.json();
      
      if (response.ok) {
        console.log("Fetched files:", data);
        
        // Filter out duplicates before setting the state
        const uniqueFiles = data.filter(file => 
          !files.some(existingFile => existingFile.filename === file.filename)
        );
        
        setFiles(prevFiles => [
          ...prevFiles,
          ...uniqueFiles
        ]);
        
        if (uniqueFiles.length > 0) {
          showToast(`Loaded ${uniqueFiles.length} attachment(s)`, "info");
        }
      } else {
        console.error('Error fetching files:', data.error);
        showToast("Failed to load attachments", "error");
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      showToast("Failed to load attachments", "error");
    } finally {
      setLoading(false);
    }
  };
  
  // Function to fetch and store image blobs
  const fetchAndStoreImage = async (file) => {
    if (!file || !file.filename) {
      console.error("Invalid file object or missing filename:", file);
      return;
    }
  
    const filename = file.filename.trim();
    if (imagesFetched.current.has(filename)) return;
  
    try {
      const imageResponse = await axios.get(`http://127.0.0.1:8000/get-files/?filename=${encodeURIComponent(filename)}`, {
        responseType: 'blob',
      });
  
      const fileType = imageResponse.headers['content-type'];
  
      setImageArray(prevArray => [
        ...prevArray.filter(image => image.filename !== filename),
        {
          src: URL.createObjectURL(imageResponse.data),
          filename: filename,
          type: fileType,
          employeeName: file.employeeName,
          uploadDate: file.uploadDate
        }
      ]);
  
      imagesFetched.current.add(filename);
  
    } catch (error) {
      console.error(`Error fetching image for ${filename}:`, error);
      showToast(`Failed to load attachment: ${filename}`, "error");
    }
  };
  
  // Fetch images once files are loaded
  useEffect(() => {
    if (files.length > 0) {
      files.forEach(file => fetchAndStoreImage(file));
    }
  }, [files]);
  
  // Fetch files when the component mounts
  useEffect(() => {
    fetchFiles();
  }, []);
  
  // Function to handle file download
  const handleDownload = (filename) => {
    window.open(`http://127.0.0.1:8000/get-files/?filename=${filename}`, '_blank');
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
  
    formData.append("cardId", cardId);
    formData.append("cardName", cardName);
    formData.append("boardId", boardId);
    formData.append("employeeId", employeeId);
    formData.append("employeeName", employeeName);
  
    try {
      const response = await fetch("https://tracker.shinovadatabase.in/upload-content/", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      console.log("Files, images, and card details uploaded successfully:", data);
      showToast(`Successfully uploaded ${uploadedItems.join(" and ")}`, "success");
      
      // Clear the file and image state
      setFile(null);
      setImage(null);
      
      // Refresh the file list
      fetchFiles();
  
    } catch (error) {
      console.error("Error uploading files and images:", error);
      showToast("Failed to upload attachments. Please try again.", "error");
    }
  };
  
  const handleSave = () => {
    handleSaveDescription();
    if (file || image) {
      handleSaveFilesImages();
    }
  };

  // Function to handle file deletion
  const handleDeleteFile = async (filename) => {
    try {
      await axios.delete(`https://tracker.shinovadatabase.in/delete-file/${boardId}/${cardId}/${filename}/`);
      setFiles(prevFiles => prevFiles.filter(file => file.filename !== filename));
      setImageArray(prevImages => prevImages.filter(image => image.filename !== filename));
      showToast(`Successfully deleted ${filename}`, "success");
      console.log(`File ${filename} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting file ${filename}:`, error);
      showToast(`Failed to delete ${filename}`, "error");
    }
  };
  
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
      
      <Section>
        <SectionHeader>
          <SectionTitle>
            <GrTextAlignFull /> Description
          </SectionTitle>
        </SectionHeader>
        
        <SectionContent>
          <DescriptionInputContainer>
            {isEditing ? (
              <>
                <Toolbar>
                  <ToolbarButton onClick={toggleDropdown} title="Text Format">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
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
                  <ToolbarButton onClick={() => applyFormat("italic")} title="Italic">
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
                    {file && <div style={{ fontSize: '12px', color: colors.lightText }}>Selected file: {file.name}</div>}
                    {image && <div style={{ fontSize: '12px', color: colors.lightText }}>Selected image: {image.name}</div>}
                  </div>
                  <div>
                    <SecondaryButton onClick={() => {
                      setEditing(false);
                      setFile(null);
                      setImage(null);
                      showToast("Edit cancelled", "info");
                    }}>
                      Cancel
                    </SecondaryButton>
                    <PrimaryButton onClick={handleSave}>Save</PrimaryButton>
                  </div>
                </Actions>
              </>
            ) : (
              <>
                {description ? (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "16px" }}>
                    <DescriptionView>{description}</DescriptionView>
                    <ActionIcon 
                      onClick={() => {
                        setEditing(true);
                        showToast("Editing description", "info");
                      }} 
                      title="Edit Description"
                    >
                      <FaEdit />
                    </ActionIcon>
                  </div>
                ) : (
                  <div style={{ padding: "16px" }}>
                    <AddDescriptionButton onClick={() => {
                      setEditing(true);
                      showToast("Adding new description", "info");
                    }}>
                      Add description
                    </AddDescriptionButton>
                  </div>
                )}
              </>
            )}
          </DescriptionInputContainer>
        </SectionContent>
      </Section>

      {imageArray.length > 0 && (
        <Section>
          <SectionHeader>
            <SectionTitle>
              <GrAttachment /> Attachments
            </SectionTitle>
          </SectionHeader>
          
          <SectionContent>
            {loading ? (
              <LoadingSpinner>Loading attachments...</LoadingSpinner>
            ) : (
              <AttachmentsList>
                {imageArray.map((image, index) => (
                  <AttachmentItem key={index}>
                    <AttachmentPreview>
                      {image.type.startsWith('image/') ? (
                        <img
                          src={image.src}
                          alt={image.filename}
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      ) : image.filename.endsWith('.docx') ? (
                        <BsFiletypeDocx style={{ fontSize: '3rem', color: '#4285F4' }} />
                      ) : (
                        <GrAttachment style={{ fontSize: '2rem', color: colors.lightText }} />
                      )}
                    </AttachmentPreview>
                    
                    <AttachmentInfo>
                      <AttachmentFileName>{image.filename}</AttachmentFileName>
                      <AttachmentMeta>
                        Uploaded by: {image.employeeName} • {new Date(image.uploadDate).toLocaleString()}
                      </AttachmentMeta>
                      <AttachmentActions>
                        <SecondaryButton onClick={() => handleDownload(image.filename)}>
                          <FaDownload size={12} /> Download
                        </SecondaryButton>
                        <SecondaryButton 
                          onClick={() => handleDeleteFile(image.filename)}
                          style={{ color: colors.danger }}
                        >
                          <FaTrash size={12} /> Delete
                        </SecondaryButton>
                      </AttachmentActions>
                    </AttachmentInfo>
                  </AttachmentItem>
                ))}
              </AttachmentsList>
            )}
          </SectionContent>
        </Section>
      )}
    </Container>
  );
};

export default Description;