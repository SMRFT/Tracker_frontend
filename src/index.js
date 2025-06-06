import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";

// Access the redirect URL from environment variables
const REDIRECT_URL = process.env.REACT_APP_LOGIN_REDIRECT_URL;

console.log("=== TRACKER INDEX.JS DEBUG ===");
console.log("REDIRECT_URL:", REDIRECT_URL);

// --- Function to set token for local development ---
function setforlocaldev() {
  const dev_token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJTSDAwNyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJlbXBsb3llZUlkIjoiU0gwMDciLCJuYW1lIjoiZGV2aSIsInJvbGVfbmFtZSI6IkFkbWluIiwiYWxsb3dlZC1hY3Rpb25zIjpbIlNULVAtREVTLVIiLCJTRC1QLVJELVJXIiwiU1QtUC1TTk8tUlciLCJTRC1QLUlOVi1SIiwiU0QtUC1TVkQtUiIsIlNULUFQSS1FTVAtUiIsIlNELVAtQkJBLVJXIiwiU1QtUC1DTVQtUiIsIlNULVAtVERMLVIiLCJTRC1QLUNULVIiLCJTRC1QLU9ELVIiLCJTVC1BUEktQ1JELVJXIiwiU0QtUC1MRC1SIiwiU0QtUC1NSVMtUiIsIlNULVAtVERMLVJXIiwiU1QtQVBJLUFNQy1SVyIsIlNULVAtTlRGLVIiLCJTVC1QLU5URi1SVyIsIlNULVAtREVTLVJXIiwiU1QtUC1CUkQtUiIsIlNULVAtQ01ULVJXIiwiU1QtQVBJLUJSRC1SVyIsIlNELVAtUkQtUiIsIkdMLVAtRVBNLVJXIiwiU0QtUC1SQS1SVyJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAzIiwiU0hCMDAxIl0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzQ5MTgxMDIzLCJleHAiOjE3NDkyNjc0MjMsImp0aSI6IjE3YjBiZjllLTU2MjktNDhmMC1iY2JlLWFhNmRhN2Q3ZmNmMCJ9.VMQdYGm8DUkGsHIUWiv8DDKQjSQzo47gpi56nJ3YQG2NSvHOEJwWskGQEDXkDsk5Qxrz53ZS4sG17hHrYn9vgCtX8DWtXz0_RIPVSEb-NqgmwNL3h5qxAOw0xm4j-KS79hWOPA4NI1d1yRP2k7pT1yZnrfIpgGxiiTsogCkljuTWHNp-a0DW6MzR5unUUONsuXdC-t1VruSqAHx8onCWw3AYAq-Y6IN1veE_6z_mTv7lzPfBVHKyPNUNz4Z8nT8TQy6H9qswoDjAU1HnnJSkNkffqi5yqj79p2wNMxn6kIvv0OwZc6MvuJPiHK9hJMShZzdMBi-i-tW8jsNygwy_Hg";
  console.log("🔧 Using your fresh development token");
  return dev_token;
}

// --- Validate JWT Token Locally (same as main.jsx) ---
function validate(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      throw new Error("Token expired");
    }
    return payload;
  } catch (err) {
    throw new Error("Invalid token");
  }
}

// --- Retrieve token from localStorage ---
let accessToken = localStorage.getItem("access_token");
console.log("Access token from localStorage exists:", !!accessToken);

// If no token found, use your development token
if (!accessToken) {
  console.log(
    "❌ No token found in localStorage, setting your development token"
  );
  accessToken = setforlocaldev();
  localStorage.setItem("access_token", accessToken);
  console.log("✅ Your development token set");
}

// --- Main validation and rendering logic ---
(function main() {
  try {
    console.log("Starting token validation...");

    if (!accessToken) {
      throw new Error("No token found");
    }

    // Validate the token using the same logic as main.jsx
    const userPayload = validate(accessToken);
    console.log("✅ Token validated successfully");
    console.log("Decoded token payload:", userPayload);

    // Extract user information
    const employeeId = userPayload.employeeId;
    const employeeName = userPayload.name;
    const role = userPayload.role_name;
    const userEmail = userPayload.email;

    console.log("Employee ID:", employeeId);
    console.log("Employee Name:", employeeName);
    console.log("Email:", userEmail);
    console.log("role:", role);

    // Check if we have required data
    const isLoggedIn = !!(employeeId && employeeName);
    console.log("Is logged in:", isLoggedIn);

    if (isLoggedIn) {
      // Store user payload for app usage
      localStorage.setItem("user_payload", JSON.stringify(userPayload));
      localStorage.setItem("employeeId", employeeId);
      localStorage.setItem("employeeName", employeeName);
      localStorage.setItem("role", role);
      localStorage.setItem("userEmail", userEmail);
      console.log("✅ User payload stored in localStorage");

      // Token is valid, render app
      console.log("✅ Rendering tracker app...");
      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );

      reportWebVitals();
    } else {
      throw new Error(
        "Missing required user data (employeeId or employeeName)"
      );
    }
  } catch (error) {
    console.error("❌ Token validation failed:", error.message);

    // Try to set fresh development token on validation failure
    try {
      console.log("Attempting to set fresh development token...");
      const freshToken = setforlocaldev();
      localStorage.setItem("access_token", freshToken);

      // Validate the fresh token
      const freshPayload = validate(freshToken);
      const employeeId = freshPayload.employeeId;
      const employeeName = freshPayload.name;
      const isLoggedIn = !!(employeeId && employeeName);

      if (isLoggedIn) {
        localStorage.setItem("user_payload", JSON.stringify(freshPayload));
        localStorage.setItem("employeeId", employeeId);
        localStorage.setItem("employeeName", employeeName);
        localStorage.setItem("role", freshPayload.role_name);
        localStorage.setItem("userEmail", freshPayload.email);

        console.log(
          "✅ Fresh development token set and validated successfully"
        );

        // Render app with fresh token
        const root = ReactDOM.createRoot(document.getElementById("root"));
        root.render(
          <React.StrictMode>
            <App />
          </React.StrictMode>
        );

        reportWebVitals();
        return; // Exit successfully
      }
    } catch (retryError) {
      console.error("❌ Failed to set fresh development token:", retryError);
    }

    // If all else fails, show debug info
    console.log("❌ Cannot render app - showing debug info");
    localStorage.removeItem("access_token"); // Clean up invalid token

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      <React.StrictMode>
        <div
          style={{
            padding: "20px",
            maxWidth: "800px",
            margin: "0 auto",
            fontFamily: "monospace",
          }}
        >
          <h2>🔧 Tracker Debug Information</h2>
          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: "15px",
              marginBottom: "10px",
            }}
          >
            <h3>Token Status:</h3>
            <p>
              <strong>Error:</strong> {error.message}
            </p>
            <p>
              <strong>Token exists:</strong> {accessToken ? "Yes" : "No"}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#e8f4f8",
              padding: "15px",
              marginBottom: "10px",
            }}
          >
            <h3>Environment:</h3>
            <p>
              <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
            </p>
            <p>
              <strong>Redirect URL:</strong> {REDIRECT_URL || "Not set"}
            </p>
            <p>
              <strong>Hostname:</strong> {window.location.hostname}
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            Clear Storage & Retry
          </button>
        </div>
      </React.StrictMode>
    );
  }
})();
