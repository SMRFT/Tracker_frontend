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
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJTSDAwNyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiZGV2aSIsImFsbG93ZWQtYWN0aW9ucyI6WyJTVC1QLU5URi1SIiwiU0QtUC1MRC1SIiwiU1QtQVBJLUVNUC1SIiwiU1QtUC1CUkQtUiIsIlNULUFQSS1DUkQtUlciLCJTVC1QLUNNVC1SVyIsIlNELVAtT0QtUiIsIlNELVAtUkQtUiIsIlNULVAtQ01ULVIiLCJTVC1QLVNOTy1SVyIsIlNULVAtVERMLVJXIiwiU0QtUC1JTlYtUiIsIlNELVAtU1ZELVIiLCJTRC1QLUNULVIiLCJTRC1QLVJBLVJXIiwiU0QtUC1CQkEtUlciLCJTRC1QLVJELVJXIiwiU1QtQVBJLUJSRC1SVyIsIlNULVAtREVTLVIiLCJTRC1QLU1JUy1SIiwiU1QtUC1ERVMtUlciLCJTVC1UT0RPLUFETUlOIiwiU1QtQVBJLUFNQy1SVyIsIkdMLVAtRVBNLVJXIiwiU1QtUC1UREwtUiIsIlNULVAtTlRGLVJXIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDMiLCJTSEIwMDEiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3NDk2MjI1MTcsImV4cCI6MTc0OTcwODkxNywianRpIjoiZTk1ZmY2OWEtNjEwNC00ZTM1LWIzOTItMTM4MWI5ZTRkOGJkIn0.ds3vXiVzi_1ycNDttfPV6xRYPV_X5Oakv3H47DUm-Yg2F9aG-Oc3Bj2dkF25IYy5Ai11cI_E8b7NWjgG6cGf8tdZaDAtxDqfc_n_mbegCGCV-t7bA7m28ixhzzZjdHLjzl-zzxtHzFB4MYfcxfom2OUdzQAJld-vGz8p6JIOwBcHWGxY5TCQjYEuhc8VGpf06zzlmR0qOSuhZ8Oy0k-HoBfW8XlNegKdTekN3zeZk6ywzUx5X5nGocaGC9dOtl7s6azekUdLbA-DScRZQYbIbJ2tKqeD6ZGk8R4P9gSnwWiCc2ChcHf4pG-a1-OR_EH8kS9D33iWXxyj2Sc_tGWUnw";
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

// --- Function to determine user role based on allowed-actions ---
function getUserRole(allowedActions) {
  if (!allowedActions || !Array.isArray(allowedActions)) {
    return "Employee"; // Default role
  }

  if (allowedActions.includes("ST-TODO-ADMIN")) {
    return "Admin";
  } else if (allowedActions.includes("ST-TODO-HOD")) {
    return "HOD";
  } else if (allowedActions.includes("ST-TODO-EMPLOYEE")) {
    return "Employee";
  } else {
    return "Employee"; // Default role if none of the specific roles are found
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

    // Extract user information from token payload
    const employeeId = userPayload.aud; // Using 'aud' field as ID
    const employeeName = userPayload.name;
    const userEmail = userPayload.email;
    const userRole = getUserRole(userPayload["allowed-actions"]);

    console.log("Employee ID:", employeeId);
    console.log("Employee Name:", employeeName);
    console.log("Email:", userEmail);
    console.log("User Role:", userRole);

    // Check if we have required data
    const isLoggedIn = !!(employeeId && employeeName);
    console.log("Is logged in:", isLoggedIn);

    if (isLoggedIn) {
      // Store user payload and extracted information for app usage
      localStorage.setItem("user_payload", JSON.stringify(userPayload));
      localStorage.setItem("employeeId", employeeId);
      localStorage.setItem("employeeName", employeeName);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("role", userRole);

      console.log("✅ User payload and extracted data stored in localStorage");
      console.log("Stored data:", {
        employeeId,
        employeeName,
        userEmail,
        role: userRole,
      });

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
      const employeeId = freshPayload.aud; // Using 'aud' field as ID
      const employeeName = freshPayload.name;
      const userEmail = freshPayload.email;
      const userRole = getUserRole(freshPayload["allowed-actions"]);

      const isLoggedIn = !!(employeeId && employeeName);

      if (isLoggedIn) {
        localStorage.setItem("user_payload", JSON.stringify(freshPayload));
        localStorage.setItem("employeeId", employeeId);
        localStorage.setItem("employeeName", employeeName);
        localStorage.setItem("userEmail", userEmail);
        localStorage.setItem("role", userRole);

        console.log(
          "✅ Fresh development token set and validated successfully"
        );
        console.log("Fresh token data:", {
          employeeId,
          employeeName,
          userEmail,
          role: userRole,
        });

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
