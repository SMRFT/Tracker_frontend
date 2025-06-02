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
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJTSDAwNyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJlbXBsb3llZUlkIjoiU0gwMDciLCJuYW1lIjoiZGV2aSIsInJvbGVfbmFtZSI6IkFkbWluIiwiYWxsb3dlZC1hY3Rpb25zIjpbIlNELVAtT0QtUiIsIlNELVAtUkQtUlciLCJTVC1QLUNNVC1SIiwiU1QtUC1ERVMtUlciLCJTVC1QLUFNUy1SIiwiU1QtUC1OVEYtUlciLCJTVC1QLU5URi1SIiwiU0QtUC1JTlYtUiIsIlNULVAtVERMLVIiLCJTVC1QLUJSRC1SIiwiU0QtUC1SQS1SVyIsIlNULVAtQlJELVJXIiwiU1QtUC1SRUctUlciLCJTVC1QLUNNVC1SVyIsIlNULVAtTUJTLVIiLCJTVC1QLUxPRy1SVyIsIlNULVAtQU1TLVJXIiwiU0QtUC1NSVMtUiIsIkdMLVAtRVBNLVJXIiwiU1QtUC1UREwtUlciLCJTVC1QLVNEQi1SVyIsIlNELVAtU1ZELVIiLCJTVC1QLVNOTy1SVyIsIlNELVAtQkJBLVJXIiwiU0QtUC1SRC1SIiwiU1QtUC1EVEUtUlciLCJTVC1QLURFUy1SIiwiU0QtUC1DVC1SIiwiU0QtUC1MRC1SIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDMiLCJTSEIwMDEiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3NDg4MzUzNjUsImV4cCI6MTc0ODkyMTc2NSwianRpIjoiNWEwMjc4MDYtZDJkOS00MzMwLTgzNWItMWMwNGRlYzFmNzY2In0.HFL9tP9W-AQXI1E1TI1mnPEuWqsoqCvDHAVNkmM6Xu37cLofmOP2GEwtshz1SfbeFPUvb4mi1xN6RHTDca2V3R5TaB3vGVewtmLvOXNU_Jo6dxmPuX_isRuBspLmX-zqZyLBnsUOrAXPnVcHFXb8wEzTaOBo0cbOWr5Z2GBkOu8NZ9orRE4-V8bTlMOm8HHrd1N9QrCONDuBG5jT3MTZFL8oEpAdBFcMgCaqDcWiztDb0-_Gwn7pmr44L0-WfoMspB8dFOH64BuIewK9AenJ95aQUnsClyCcPx47LMFdMGPQxqBcJNVdupsYTFWPyfxcmt6MkZXPoLwjvko1wXCSNg";
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
    const userRole = userPayload.role_name;
    const userEmail = userPayload.email;

    console.log("Employee ID:", employeeId);
    console.log("Employee Name:", employeeName);
    console.log("Email:", userEmail);
    console.log("Role:", userRole);

    // Check if we have required data
    const isLoggedIn = !!(employeeId && employeeName);
    console.log("Is logged in:", isLoggedIn);

    if (isLoggedIn) {
      // Store user payload for app usage
      localStorage.setItem("user_payload", JSON.stringify(userPayload));
      localStorage.setItem("employeeId", employeeId);
      localStorage.setItem("employeeName", employeeName);
      localStorage.setItem("userRole", userRole);
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
        localStorage.setItem("userRole", freshPayload.role_name);
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
