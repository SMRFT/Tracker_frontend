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
  const dev_token ="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDM4MCIsImVtYWlsIjoibWFuaWJhbGFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6Ik1hbmliYWxhbiIsImFsbG93ZWQtYWN0aW9ucyI6WyJTVC1QLUNNVC1SVyIsIlNULVAtQ01ULVIiLCJNREMtQVBJLVBBVC1SIiwiTURDLVAtUkRFLVJXIiwiTURDLVAtQVNNLVJXIiwiTURDLVAtUE5QLVJXIiwiTURDLVAtUkVHLVJXIiwiU1QtUC1CUkQtUiIsIlNULVAtVERMLVJXIiwiU1QtUC1ERVMtUlciLCJTVC1SLUEiLCJNREMtUC1QTlAtUiIsIk1EQy1QLUNERS1SVyIsIk1EQy1BUEktVEhSLVIiLCJTVC1QLURFUy1SIiwiU1QtQVBJLUVNUC1SIiwiTURDLUFQSS1SREwtUiIsIlNULVAtTlRGLVJXIiwiTURDLUFQSS1BVC1SIiwiTURDLVAtUFRFLVJXIiwiTURDLVAtUE5QUi1SIiwiTURDLUFQSS1SVFMtUiIsIk1EQy1QLVRSQi1SVyIsIlNULVAtVERMLVIiLCJNREMtUC1TT1ItUiIsIk1EQy1QLVJFRy1SIiwiTURDLVAtT1NCLVJXIiwiU1QtQVBJLUNSRC1SVyIsIk1EQy1BUEktR0FTLVIiLCJTVC1QLU5URi1SIiwiTURDLUFQSS1BVC1SVyIsIlNULUFQSS1CUkQtUlciLCJNREMtQVBJLUNEUi1SIiwiU1QtQVBJLUFNQy1SVyIsIlNULVAtU05PLVJXIiwiTURDLUFQSS1MQk4tUiJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzYyMzk5MTkwLCJleHAiOjE3NjI0ODYxOTAsImp0aSI6IjQ5NTQ2YThiLTA4NjgtNDg4NC1iODFmLTZlYWJlZTNkOTQ0YyJ9.WFjGejU36-olxgtr6eLC7_f_g2j57GBbJg836hgOOWJR9bXUIhvw2P9ymdBIV1IPZ3AJRAmPbOkXgbujj2q7MCYMtaUwijuTrWmpQnLsgGhskFv3ucTw1w9Uy8FYz2APlCpmHlZFFtQSeKmX8aEqdzVlWtgAwpiNCkhvv9MNKIwvUgneC2ApRC45jE19ElPH0BKdAkLE2N8UbNrvTd7iPpMvIYQlqnwVOl97ntM8idh79m_F2uxlkia4IRyKWEkEjK5pAVBWOcUkcIDKUKoUpRKOQFEWirxfY40Phq0WEP6lpC58Ipl-kF22F8oQpEpfMkJARX1skeKpk3SPSNm8eg";
  console.log("🔧 Development token is empty - will redirect to login");
  return dev_token;
}

// --- Function to redirect to login ---
function redirectToLogin() {
  if (REDIRECT_URL) {
    console.log("🔄 Redirecting to login URL:", REDIRECT_URL);
    window.location.href = REDIRECT_URL;
  } else {
    console.error("❌ REDIRECT_URL not configured");
    // Even if REDIRECT_URL is not configured, don't show error - just redirect to a fallback
    window.location.href = "/login";
  }
}

// --- Validate JWT Token Locally ---
function validate(token) {
  if (!token || token.trim() === "") {
    throw new Error("Token is empty");
  }

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

  if (allowedActions.includes("ST-R-A")) {
    return "Admin";
  } else if (allowedActions.includes("ST-R-HOD")) {
    return "HOD";
  } else if (allowedActions.includes("ST-R-EMP")) {
    return "Employee";
  } else {
    return "Employee"; // Default role if none of the specific roles are found
  }
}

// --- Function to render the app ---
function renderApp(userPayload) {
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

  if (!isLoggedIn) {
    throw new Error("Missing required user data (employeeId or employeeName)");
  }

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
}

// --- Main execution ---
(function main() {
  try {
    console.log("Starting token validation...");

    // Retrieve token from localStorage
    let accessToken = localStorage.getItem("access_token");
    console.log("Access token from localStorage exists:", !!accessToken);

    // If no token found, try development token
    if (!accessToken) {
      console.log(
        "❌ No token found in localStorage, trying development token"
      );
      accessToken = setforlocaldev();
    }

    // If still no token (development token is empty), redirect to login
    if (!accessToken || accessToken.trim() === "") {
      console.log("❌ No valid token available, redirecting to login");
      localStorage.removeItem("access_token"); // Clean up
      redirectToLogin();
      return; // Stop execution here
    }

    // Validate the token
    const userPayload = validate(accessToken);
    console.log("✅ Token validated successfully");
    console.log("Decoded token payload:", userPayload);

    // Store the valid token
    localStorage.setItem("access_token", accessToken);

    // Render the app
    renderApp(userPayload);
  } catch (error) {
    console.error("❌ Token validation failed:", error.message);

    // Clean up invalid token
    localStorage.removeItem("access_token");

    // If validation fails, redirect to login instead of showing debug page
    console.log("❌ Redirecting to login due to validation failure");
    redirectToLogin();
  }
})();
