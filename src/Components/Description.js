import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import styled from "styled-components";
import { FaTimes ,FaEdit} from 'react-icons/fa';
import { RiArrowDropDownLine } from "react-icons/ri";
import { GrTextAlignFull } from "react-icons/gr";
import { GrAttachment } from "react-icons/gr";
import { hasPointerEvents } from "@testing-library/user-event/dist/utils";
import { BsFiletypeDocx } from "react-icons/bs";
const Section = styled.div`
margin: 20px 0;
`;
const SectionTitle = styled.div`
font-size: 1.2rem;
margin-bottom: 10px;
`;

const Toolbar = styled.div`
display: flex;
align-items: center;
background-color: white;
padding: 8px;
border-radius: 4px 4px 0 0;
border-bottom: 1px solid #7F8C8D;
`;
const ToolbarButton = styled.button`
background: none;
border: none;
color: #000000;
margin-right: 8px;
cursor: pointer;
font-size: 16px;
position: relative;
`;
const Dropdown = styled.div`
position: absolute;
top: 24px;
left: 0;
background-color: #2C3E50;
border-radius: 4px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
z-index: 10;
`;
const DropdownItem = styled.div`
padding: 8px 16px;
font-size: 14px;
color: #ECF0F1;
cursor: pointer;
display: flex;
justify-content: space-between;
&:hover {
  background-color: #34495E;
}
`;
const DescriptionInputContainer = styled.div`
position: relative;
`;
const DescriptionInput = styled.div`
width: 100%;
height: 100px;
padding: 12px;
border-radius: 0 0 4px 4px;
border: none;
font-size: 14px;
background-color: white;
color: #000000;
resize: none;
line-height: 1.5;
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
overflow-y: auto;
white-space: pre-wrap;
`;

const Actions = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
margin-top: 16px;
`;

const DeleteButton = styled.button`
background: none;
border: none;
color: red;
cursor: pointer;
font-size: 1.2rem;
`;

const SaveButton = styled.button`
background-color: #3498DB;
color: white;
padding: 6px 12px;
border-radius: 4px;
border: none;
cursor: pointer;
font-size: 12px;
margin-right: 8px;
&:hover {
  background-color: #2980B9;
}
`;
const CancelButton = styled.button`
background-color: transparent;
color: black;
padding: 6px 12px;
border-radius: 4px;
border: none;
cursor: pointer;
font-size: 12px;
`;
const Description = ({ cardId, cardName, boardName,boardId}) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [description,setDescription]=useState(null);
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

    useEffect(() => {
      const id = localStorage.getItem('employeeId');
      const name = localStorage.getItem('employeeName');
      if (id && name) {
          setEmployeeId(id);
          setEmployeeName(name);
      }
  }, []);

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
    }
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);
    }
  };

  const handleSaveDescription = async () => {
    const text = descriptionRef.current.textContent;
  
    try {
      const response = await fetch("http://127.0.0.1:8000/save-description/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId,
          boardId, // Ensure boardId is included in the request
          cardName,
          boardName,
          description: text, // Ensure you're passing the updated description
        }),
      });
  
      const data = await response.json();
      setEditing(false);
      setDescription(text); // Update description with saved text
      console.log("Description saved successfully:", data);
    } catch (error) {
      console.error("Error saving description:", error);
    }
  };

  const fetchDescription = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/save-description/?cardId=${cardId}&boardId=${boardId}`,
        {
          method: "GET",
        }
      );
  
      const data = await response.json();
      if (response.ok) {
        console.log("Description fetched successfully:", data);
        // Update the state with the fetched description
        setDescription(data.description); // Set the description state
      } else {
        console.error("Error fetching description:", data.error);
      }
    } catch (error) {
      console.error("Error fetching description:", error);
    }
  };
  
  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.textContent = description;
    }
  }, [description]);

  // Function to fetch the files
  const [imageArray, setImageArray] = useState([]);
  const loadedFiles = new Set();  // To track files already processed
  const imagesFetched = useRef(new Set());  // Use ref to track filenames
  
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
      } else {
        console.error('Error fetching files:', data.error);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
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
  
    const filename = file.filename;
    if (imagesFetched.current.has(filename)) return;  // Skip if already fetched
  
    try {
      const imageResponse = await axios.get(`http://127.0.0.1:8000/get-files/?filename=${filename}`, {
        responseType: 'blob',
      });
  
      const fileType = imageResponse.headers['content-type'];
  
      // Only add unique images to imageArray
      setImageArray(prevArray => [
        ...prevArray.filter(image => image.filename !== filename),
        {
          src: URL.createObjectURL(imageResponse.data),
          filename: filename,
          type: fileType,
          employeeName: file.employeeName,  // Assuming employeeName is available in the file object
          uploadDate: file.uploadDate       // Assuming uploadDate is available in the file object
        }
      ]);
  
      imagesFetched.current.add(filename);
  
    } catch (error) {
      console.error(`Error fetching image for ${filename}:`, error);
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
    fetchFiles();  // Fetch files when the component mounts
  }, []);
  
  // Function to handle file download
  const handleDownload = (filename) => {
    window.open(`http://127.0.0.1:8000/get-files/?filename=${filename}`, '_blank');
  };
  const handleSaveFilesImages = async () => {
    const formData = new FormData();
  
    if (file) {
      formData.append("file", file);
    }
    if (image) {
      formData.append("image", image);
    }
  
    formData.append("cardId", cardId);
    formData.append("cardName", cardName);
    formData.append("boardId", boardId);
    formData.append("employeeId", employeeId);
    formData.append("employeeName", employeeName);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/upload-content/", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      console.log("Files, images, and card details uploaded successfully:", data);
  
     
    } catch (error) {
      console.error("Error uploading files and images:", error);
    }
  };
  
  const handleSave = () => {
    handleSaveDescription(); // Save description text with additional fields
    handleSaveFilesImages();
    fetchAndStoreImage();  // Save files and images
  };

   // Function to handle file deletion
const handleDeleteFile = async (filename) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/delete-file/${boardId}/${cardId}/${filename}/`);
      setFiles(prevFiles => prevFiles.filter(file => file.filename !== filename));
      setImageArray(prevImages => prevImages.filter(image => image.filename !== filename));
      console.log(`File ${filename} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting file ${filename}:`, error);
    }
  };
  
    useEffect(() => {
      fetchDescription(); // Fetch files and images on component mount
      
    }, [cardId, boardId]);

  return (
    <div>
  <Section>
  <SectionTitle><GrTextAlignFull style={{fontSize:'1rem',marginRight:'10px'}}/>Description</SectionTitle>
  <DescriptionInputContainer>
          {isEditing ? (
            <>
              <Toolbar>
                <ToolbarButton onClick={toggleDropdown}>
                  Aa <RiArrowDropDownLine />
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
                <ToolbarButton onClick={() => applyFormat("bold")}>B</ToolbarButton>
      <ToolbarButton onClick={() => applyFormat("italic")}>I</ToolbarButton>
      <ToolbarButton onClick={handleFileAttach}>🔗</ToolbarButton>
      <ToolbarButton onClick={handleImageAttach}>🖼️</ToolbarButton>
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
                </div>
                <div>
                  <CancelButton onClick={() => setEditing(false)}>Cancel</CancelButton>
                  <SaveButton onClick={handleSave}>Save</SaveButton>
                </div>
              </Actions>
            </>
          ) : (
            <>
              {description ? (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>{description}</div>
                  <button
                    style={{ cursor: "pointer",border:'none' }}
                    onClick={() => setEditing(true)}
                  >Edit</button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  style={{ backgroundColor: "white", border: "none", cursor: "pointer" }}
                >
                  Add description
                </button>
              )}
            </>
          )}
        </DescriptionInputContainer>

  {/* <Actions>
    <SaveButton onClick={handleSave}>Save</SaveButton>
    <CancelButton>Cancel</CancelButton>
  </Actions> */}
  </Section>

  {imageArray.length > 0 && (
  <Section>
    <SectionTitle>
      <GrAttachment style={{ fontSize: '1rem', marginRight: '10px' }} />
      Attachments
    </SectionTitle>
    <div>
      {loading ? (
        <p>Loading files...</p>
      ) : (
        <div>
          {imageArray.map((image, index) => (
            <div
              key={index}
              style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}
            >
              {image.type.startsWith('image/') ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={image.src}
                    alt={image.filename}
                    width="70"
                    style={{ marginRight: '10px' }}
                  />
                  <div>
                    <span style={{ marginRight: '10px' }}>{image.filename}</span>
                    <p>
                      Uploaded by: {image.employeeName} &nbsp; Uploaded on: {new Date(image.uploadDate).toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleDownload(image.filename)}
                      style={{ border: 'none', marginRight: '5px' }}
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDeleteFile(image.filename)}
                      aria-label="Delete"
                      style={{ border: 'none' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : image.filename.endsWith('.docx') ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                <BsFiletypeDocx style={{fontSize:'5rem'}}/> 
                  <div>
                    <span style={{ marginRight: '10px' }}>{image.filename}</span>
                    <p>
                      Uploaded by: {image.employeeName} &nbsp; Uploaded on: {new Date(image.uploadDate).toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleDownload(image.filename)}
                      style={{ border: 'none', marginRight: '5px' }}
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDeleteFile(image.filename)}
                      aria-label="Delete"
                      style={{ border: 'none' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <span style={{ marginRight: '10px' }}>{image.filename}</span>
                  <p>
                    Uploaded by: {image.employeeName} &nbsp; Uploaded on: {new Date(image.uploadDate).toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleDownload(image.filename)}
                    style={{ border: 'none', marginRight: '5px' }}
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDeleteFile(image.filename)}
                    aria-label="Delete"
                    style={{ border: 'none' }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </Section>
)}


</div>
);
};
 export default Description;