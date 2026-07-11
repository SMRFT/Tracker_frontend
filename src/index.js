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
  const dev_token ="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDM4MCIsImVtYWlsIjoibWFuaWJhbGFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6Ik1hbmliYWxhbiIsImFsbG93ZWQtYWN0aW9ucyI6WyJTSEktUC1GM1ItUlciLCJTSEktUC1PVC1SVyIsIk1EQy1QLUNERS1SVyIsIkVSLVAtRVJWQi1SVyIsIlNULVAtTlRGLVIiLCJTVC1BUEktQ1JELVJXIiwiU0hJLVAtTVJELVJXIiwiRVItUC1FUkItUlciLCJTSEktUC1SRUNSLVJXIiwiU0hJLVAtU0lDVVItUlciLCJTSS1SLUlORElOIiwiTURDLVAtUFRFLVJXIiwiTURDLVAtU09SLVIiLCJITVMtUC1JUEgiLCJFUi1QLUVSUkVQLVJXIiwiRVItQVBJLUVSVUItUlciLCJNREMtQVBJLVBBVCIsIlNULVAtREVTLVIiLCJNREMtUC1QTlAtUlciLCJTSEktUC1GMVNSLVJXIiwiU0hJLVAtRU1SUi1SVyIsIlNISS1QLVBIWS1SVyIsIk1EQy1BUEktQVQtUiIsIkdMLVAtRUwtUlciLCJTSEktUC1BVkFJTC1SVyIsIk1EQy1BUEktUlRTLVIiLCJTSEktUC1GMi1SVyIsIkdMLVAtRUJULVJXIiwiU0hJLVAtRjJTLVJXIiwiU0hJLVAtTUlDVVItUlciLCJFUi1QLUVSQVMtUlciLCJTSEktUC1NSUNVLVJXIiwiU1QtUC1UREwtUiIsIkhNUy1QLVNJREVCQVIiLCJTVC1QLUJSRC1SIiwiU0hJLVAtUkVDLVJXIiwiU0hJLVAtWFJBWS1SVyIsIk1EQy1QLVBOUC1SIiwiU1QtQVBJLUFNQy1SVyIsIkdMLVAtQU5ELVJXIiwiTURDLVAtQVNNLVJXIiwiU0hJLVAtR0VUUkFXLVJXIiwiU0hJLVAtRjJSLVJXIiwiU0hJLVAtRjMtUlciLCJTVC1QLVNOTy1SVyIsIlNISS1QLUYxLVJXIiwiU0hJLVAtRjFSLVJXIiwiU1QtUi1IT0QiLCJNREMtQVBJLVBBVC1SIiwiTURDLUFQSS1USFItUiIsIkdMLVAtUlNFLVJXIiwiU0hJLVAtSEFORC1SVyIsIk1EQy1BUEktUkRMLVJXIiwiU0hJLVAtQ1QtUlciLCJTSEktUC1NUkktUlciLCJTSEktUC1VUEQtUlciLCJTSEktUC1OSUNVLVJXIiwiU1QtUC1ERVMtUlciLCJITVMtUC1ITVMiLCJTSEktUC1DSEVNT1ItUlciLCJTSEktUC1ERUwtUlciLCJTSEktUC1UUkFJTi1SVyIsIlNULVAtVERMLVJXIiwiU0hJLVAtRk9STS1SVyIsIkdMLVAtTkRDLVJXIiwiRVItUi1FUlNBIiwiU0hJLVAtRjFTLVJXIiwiU1QtUC1DTVQtUlciLCJTSEktUC1ESUEtUlciLCJNREMtQVBJLUNEUi1SIiwiU0hJLVAtSFItUlciLCJTSEktUC1IQU5EUi1SVyIsIlNULUFQSS1CUkQtUlciLCJNREMtUC1QTlBSLVIiLCJHTC1QLVAtUlciLCJITVMtQVBJLVNSTS1SVyIsIlNISS1QLUVYUC1SVyIsIlNISS1QLVVQRFJBVy1SVyIsIkhNUy1BUEktU0FNVC1SVyIsIkVSLVAtRVJHQVMtUlciLCJTSEktUC1JTkMiLCJTSEktUC1MQUItUlciLCJNREMtUC1SREUtUlciLCJTSEktUC1GMlNSLVJXIiwiU0hJLVAtU0lDVS1SVyIsIk1EQy1QLU9TQi1SVyIsIlNISS1QLUVNUi1SVyIsIkhNUy1QLVNHUk4tUlciLCJFUi1QLUVSR1BSLVJXIiwiSE1TLUFQSS1TQU0tUlciLCJTSEktUC1UUkFJTlItUlciLCJHUC1QLUdDTi1SIiwiU0hJLVAtREVMUkFXLVJXIiwiU1QtQVBJLUVNUC1SIiwiU0hJLVAtTU9DSy1SVyIsIlNISS1QLUNIRU1PLVJXIiwiTURDLVAtVFJCLVJXIiwiR0wtUC1FRC1SVyIsIkhNUy1BUEktU0lOVEVOVC1SVyIsIlNULVAtTlRGLVJXIiwiSE1TLUFQSS1TSU5URU5UQS1SVyIsIlNISS1QLVBIQVJNLVJXIiwiR0wtUC1FQUQtUlciLCJNREMtQVBJLUFULVJXIiwiR0wtUC1FUC1SVyIsIlNISS1QLU9QRC1SVyIsIk1EQy1SLVJFQyIsIlNISS1QLUZSTlQtUlciLCJNREMtUC1SRUctUlciLCJNREMtQVBJLUxCTi1SIiwiTURDLVAtUkVHLVIiLCJITVMtQVBJLUlULVJXIiwiU0hJLVAtTklDVVItUlciLCJNREMtQVBJLUdBUy1SIiwiU1QtUC1DTVQtUiJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDA1Il0sImhvc3BpdGFsX2NvZGUiOiJTSDAwMSIsImhtc19wYWdlcyI6WzMyLDMzLDM0LDM1LDM2LDUsMzcsMzgsMzksMTAsMThdLCJhbGxvd2VkLW91dGxldHMiOlsiT0xFVDAwMiIsIk9MRVQwMDMiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3NzY0MDcxOTksImV4cCI6MTc3NjQ5NDE5OX0.DTvtl83TNX70nxwOoN8T33gW5QZaRlzhp3IF_BQ7rC4eKaFOrKi_9YdUvxf3G5He-jsVQzFF9Ac_XFJzttnLnQNOUuRHtRur_5rDa0OVE4cV--b6i6_CN1QIZwKp7nTXPgeI1AUOblMkzkDr0FiqakACUxP1SMC1CrRJi_zdzny11dwfq5as6uUQaoO820neVDX2PJL2xdhl-iWlpuTW3WVWgEuZNukcOSz3z4w6ErZR0k1wsUsGWEANcVDmdxd2tpCxR_wf0A1XFo2YlI47brtpAZVxiKvl1l4J2bPBNipnkKB6gFN99w0n2aI1KxLotsTgvEju2sOvy9iB6og8cw";
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

