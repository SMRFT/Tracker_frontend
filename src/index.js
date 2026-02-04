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
  const dev_token ="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDM4MCIsImVtYWlsIjoibWFuaWJhbGFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6Ik1hbmliYWxhbiIsImFsbG93ZWQtYWN0aW9ucyI6WyJTSEktUC1GT1JNLVJXIiwiTURDLVAtT1NCLVJXIiwiU1QtUC1TTk8tUlciLCJTVC1QLUNNVC1SIiwiTURDLUFQSS1SREwtUlciLCJTSEktUC1SRUNSLVJXIiwiU0hJLVAtQ1QtUlciLCJHTC1QLVAtUlciLCJTSEktUC1UUkFJTi1SVyIsIkVSLVAtRVJTRC1SVyIsIk1EQy1QLVJERS1SVyIsIkdMLVAtRUFELVJXIiwiU1QtUi1DRFIiLCJTVC1BUEktQlJELVJXIiwiU0hJLVAtTklDVS1SVyIsIk1EQy1QLVRSQi1SVyIsIk1EQy1QLVBOUC1SVyIsIlNULVAtTlRGLVIiLCJTSEktUC1GMlMtUlciLCJTSEktUC1VUEQtUlciLCJNREMtUC1QTlAtUiIsIk1EQy1BUEktQVQtUiIsIlNISS1QLU1JQ1VSLVJXIiwiU0hJLVAtSU5DIiwiU0hJLVAtTU9DSy1SVyIsIk1EQy1BUEktVEhSLVIiLCJNREMtQVBJLUNEUi1SIiwiTURDLVAtUFRFLVJXIiwiRVItUC1FUkdQUi1SVyIsIk1EQy1BUEktTEJOLVIiLCJTVC1QLU5URi1SVyIsIlNISS1QLU1SRC1SVyIsIkVSLVItRVJQIiwiTURDLVItUkVDIiwiU0hJLVAtREVMUkFXLVJXIiwiU0hJLVAtQVZBSUwtUlciLCJTSEktUC1IUi1SVyIsIlNISS1QLVNJQ1UtUlciLCJNREMtQVBJLVJUUy1SIiwiU0hJLVAtUEhBUk0tUlciLCJTSEktUC1GMVMtUlciLCJNREMtUC1SRUctUlciLCJTVC1BUEktQ1JELVJXIiwiU1QtQVBJLUVNUC1SIiwiU0ktUi1JTkQiLCJTSEktUC1UUkFJTlItUlciLCJHTC1QLUVELVJXIiwiRVItUC1FUlVTLVJXIiwiU0hJLVAtRjNSLVJXIiwiTURDLVAtUkVHLVIiLCJTSEktUC1IQU5ELVJXIiwiU1QtUC1ERVMtUlciLCJHUC1QLUdDTi1SIiwiU0hJLVAtRVhQLVJXIiwiU1QtUi1BIiwiRVItUC1FUlAtUiIsIk1EQy1BUEktR0FTLVIiLCJTVC1QLUNNVC1SVyIsIlNISS1QLUNIRU1PLVJXIiwiU0hJLVAtRjJTUi1SVyIsIlNISS1QLUVNUlItUlciLCJNREMtQVBJLVBBVC1SIiwiU0hJLVAtRjItUlciLCJHTC1QLUVMLVJXIiwiTURDLVAtQVNNLVJXIiwiU0hJLVAtTUlDVS1SVyIsIkdMLVAtRVAtUlciLCJTSEktUC1TSUNVUi1SVyIsIlNISS1QLUhBTkRSLVJXIiwiU0hJLVAtTklDVVItUlciLCJTSEktUC1DSEVNT1ItUlciLCJTSEktUC1GMVItUlciLCJHTC1QLU5EQy1SVyIsIlNISS1QLVVQRFJBVy1SVyIsIlNISS1QLU9QRC1SVyIsIlNISS1QLVBIWS1SVyIsIlNISS1QLUYyUi1SVyIsIlNULUFQSS1BTUMtUlciLCJTSEktUC1ESUEtUlciLCJTSEktUC1ERUwtUlciLCJTSEktUC1FTVItUlciLCJHTC1QLVJTRS1SVyIsIlNULVAtREVTLVIiLCJHTC1QLUVCVC1SVyIsIk1EQy1QLVNPUi1SIiwiU0hJLVAtWFJBWS1SVyIsIlNISS1QLU9ULVJXIiwiU0hJLVAtRlJOVC1SVyIsIk1EQy1QLVBOUFItUiIsIlNISS1QLUYxU1ItUlciLCJTSEktUC1NUkktUlciLCJTSEktUC1SRUMtUlciLCJTSEktUC1GMy1SVyIsIk1EQy1BUEktUEFUIiwiU1QtUC1UREwtUiIsIlNULVAtVERMLVJXIiwiU0hJLVAtR0VUUkFXLVJXIiwiR0wtUC1BTkQtUlciLCJTSEktUC1GMS1SVyIsIlNISS1QLUxBQi1SVyIsIk1EQy1BUEktQVQtUlciLCJTVC1QLUJSRC1SIiwiTURDLVAtQ0RFLVJXIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDUiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3NzAxNzgzMjQsImV4cCI6MTc3MDI2NTMyNCwianRpIjoiMjFjYmMyNTItNTg4Yi00Y2U3LWEzNjktMGJlNDhkMThhMDY5In0.dvD01qYTda9H6QRH6VHDmbFifNxligIARX2w6B8fw0e5N5P6bJXy9ujYnpZARBpeZDypNB6uUQzk3gViAELQaIqMRYBqMvcFEf8LRCy57CGmVdoGd7wZBMqy1jki6EuOhA88DYAeiYCDzknEiBa5oPEqyAsmXFAITa_2l3Qplv4qC9i3jxsRwIaZE1siQFiwvfXfbItGddNKQoxw4Th7txpbR_yhWbPZXITLfWe2CJBArFUYwsM_Ap7lNJ8IrQnVUBXEENfOvUkDdryN2ohUHTgFyeJTaPfBmQI6f338hzOMmjdWZD0MWRWTCbAfW6uvQtSmNV3JVeTNASqRTNAw0A";
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

