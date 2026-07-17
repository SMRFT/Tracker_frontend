import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Access the redirect URL from environment variables
const REDIRECT_URL = process.env.REACT_APP_LOGIN_REDIRECT_URL;

console.log("=== TRACKER INDEX.JS DEBUG ===");
console.log("REDIRECT_URL:", REDIRECT_URL);

// --- Function to set token for local development ---
function setforlocaldev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg2NyIsImVtYWlsIjoicGFydGhpYmFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6Ik0uUGFydGhpYmFuIiwiYWxsb3dlZC1hY3Rpb25zIjpbIlNJTi1QLUNIRS1SVyIsIkhNUy1QLUFJTi1SVyIsIkhNUy1QLUdSTiIsIkhNUy1QLUlQSCIsIkhNUy1QLVBBQ0siLCJTVC1QLVRETC1SVyIsIlNELVAtSE1TVEQtUiIsIkhNUy1QLUJMSyIsIlNJTi1BUEktT1JSLVIiLCJITVMtUC1JUC1SIiwiU0QtUC1ITVNHQy1SIiwiU1QtUC1DTVQtUlciLCJTRC1QLUhNU1NQLVIiLCJNREMtUC1HUFAtUiIsIkhNUy1QLUdSTkEiLCJTVC1QLUJSRC1SIiwiU0QtUC1ITVNHUC1SIiwiTURDLVAtR0NQLVIiLCJITVMtUC1WVi1SVyIsIkhNUy1QLUlQRS1SVyIsIk1EQy1BUEktTC1SVyIsIkhNUy1QLUFETS1SVyIsIlNELVItTFQiLCJTRC1QLVJHLVJXIiwiU0lOLUFQSS1HSUMtUiIsIlNELVAtSE1TUEItUlciLCJITVMtUC1WSU4tUiIsIkhNUy1QLU9UTSIsIkhNUy1QLUhNU1BTLVJXIiwiU0lOLVAtQ0hFQS1SVyIsIlNELVAtTUJQRC1SIiwiSE1TLUFQSS1WTSIsIkhNUy1QLVZJTlIiLCJITVMtUC1DQ0MiLCJITVMtUC1WSU5BLVJXIiwiSE1TLVAtQlQiLCJNREMtUC1HT1AtUiIsIlNJTi1BUEktRlUtUlciLCJTVC1BUEktQlJELVJXIiwiTURDLVAtQUQtUiIsIlNELUFQSS1UTS1SVyIsIk1EQy1SLVBEQyIsIkhNUy1QLUhNU0lOUyIsIkhNUy1QLVNSTSIsIlNULUFQSS1BTUMtUlciLCJITVMtUC1PVEFNIiwiU1QtUC1UREwtUiIsIkhNUy1QLVZJTi1SVyIsIkhNUy1QLVJFRy1SVyIsIkhNUy1BUEktSUNUIiwiTURDLUFQSS1TR1AtUlciLCJTVC1BUEktQ1JELVJXIiwiTURDLUFQSS1QR1AtUlciLCJITVMtUC1JUEtHLVJXIiwiU0lOLVAtUlQtUlciLCJITVMtQVBJLUlCIiwiU0QtUC1ITVNMRC1SIiwiU0QtUC1NSVMtUiIsIkhNUy1QLURCVURSLVIiLCJTRC1BUEktVE0tUiIsIkhNUy1BUEktSUNULVJXIiwiU0lOLVAtUlRBLVJXIiwiSE1TLVAtSE1TIiwiU0QtUC1SRC1SVyIsIlNELVAtSE1TUFMtUlciLCJITVMtUC1BREFTSCIsIk1EQy1BUEktT0dQLVJXIiwiU0QtQVBJLUdELVIiLCJITVMtUC1STSIsIkhNUy1QLUlQS0dELVJXIiwiU0QtUC1TU1UtUlciLCJITVMtUC1JUEQtUlciLCJTRC1QLVNBLVJXIiwiSE1TLVAtT1BIIiwiSE1TLVAtSVQiLCJITVMtUC1TQU1UIiwiU1QtUC1OVEYtUlciLCJITVMtUC1WVkQtUlciLCJITVMtUC1CVEQtUlciLCJTRC1BUEktUkItUiIsIlNULVAtTlRGLVIiLCJNREMtQVBJLUFULVIiLCJNREMtQVBJLVBEQy1SVyIsIlNULVItQSIsIkhNUy1QLVZJRC1SVyIsIlNELVAtU1NVLVIiLCJITVMtUC1WSU5SLVIiLCJTRC1QLVBPVi1SVyIsIkhNUy1BUEktSVVTRyIsIk1EQy1BUEktQUdQLVJXIiwiU1QtUC1DTVQtUiIsIkdQLVAtR0NOLVIiLCJTRC1QLVNTLVIiLCJITVMtUC1JTkEiLCJTRC1BUEktTUlTLVJXIiwiSE1TLUFQSS1JWFJBWS1SVyIsIkhNUy1BUEktREFTSCIsIkhNUy1QLVNJTlRFTlQiLCJITVMtQVBJLUlNUkktUlciLCJTRC1BUEktTUJURC1SVyIsIlNJTi1QLUdETC1SVyIsIk1EQy1QLUFBVS1SVyIsIkhNUy1QLVJDQVQiLCJITVMtUC1WSS1SVyIsIlNULUFQSS1FTVAtUiIsIkhNUy1QLVJCSUxMIiwiSE1TLVAtU0dSTiIsIlNELVAtVERFLVJXIiwiSE1TLVAtRERBU0giLCJITVMtUC1WSS1SIiwiSE1TLVAtQlVEIiwiU0lOLVItQURNIiwiU0lOLUFQSS1PUi1SVyIsIlNELVAtTUJUVi1SIiwiSE1TLUFQSS1EU1VNIiwiSE1TLVAtT1RTUyIsIlNELVAtSE1TVUMtUlciLCJNREMtUC1HU1AtUiIsIkhNUy1QLVJFTlEiLCJITVMtUC1SU0hGVCIsIlNELUFQSS1UVi1SIiwiU0QtQVBJLUNOLVIiLCJITVMtUC1JTlZQIiwiSE1TLVAtSVBLR0UtUlciLCJITVMtUC1WSUUtUlciLCJTRC1QLVRELVJXIiwiSE1TLVAtREIiLCJITVMtUC1CVC1SVyIsIkhNUy1QLUlQS0ctUiIsIlNELVAtU1MtUlciLCJTVC1QLVNOTy1SVyIsIlNELVAtSE1TU0QtUiIsIk1EQy1BUEktQ0RSLVJXIiwiU0QtUC1NQkRGLVJXIiwiU1QtUC1ERVMtUlciLCJITVMtUC1BRE0iLCJITVMtUC1XUiIsIkhNUy1QLVZWLVIiLCJTRC1QLUhNU0NTLVIiLCJTRC1QLURGLVJXIiwiU0lOLUFQSS1JRi1SVyIsIlNELVAtSE1TQkQtUlciLCJITVMtQVBJLUlNUkkiLCJITVMtUC1CVC1SIiwiSE1TLUFQSS1JVVNHLVJXIiwiTURDLVAtUE5QUi1SIiwiSE1TLVAtSVAtUlciLCJITVMtQVBJLUlYUkFZIiwiTURDLUFQSS1DR1AtUlciLCJTSU4tQVBJLVNGLVIiLCJTRC1QLUhNU1NTLVJXIiwiTURDLVAtR09BLVJXIiwiU0lOLVAtQ0YtUiIsIkhNUy1QLVZWRS1SVyIsIlNELVAtVEUtUlciLCJITVMtUC1TQU0iLCJTVC1QLURFUy1SIiwiU0lOLVAtRU5RLVJXIiwiSE1TLVAtSE1TUFMiLCJITVMtUC1TSURFQkFSIiwiU0QtUC1QRC1SVyIsIk1EQy1QLUdBUC1SIiwiTURDLVAtR0FULVIiLCJITVMtQVBJLURSTSIsIlNELVAtUE9WLVIiLCJITVMtUC1WSU5FLVJXIiwiSE1TLVAtQlRFLVJXIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiLCJTSEIwMDIiXSwiaG9zcGl0YWxfY29kZSI6IlNIMDAxIiwiaG1zX3BhZ2VzIjpbMSwyLDMsNCw1LDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTUsMTYsMTcsMTksMjAsMjEsMjIsMjMsMjQsMjUsMjYsMjcsMjgsMjksMzAsMzEsMzIsMzMsMzQsMzUsMzYsMzcsMzgsMzksNDAsNDEsNDIsNDMsNDQsNDUsNDYsNDcsNDgsNDksMThdLCJhbGxvd2VkLW91dGxldHMiOlsiT0xFVDAwMSIsIk9MRVQwMDIiLCJPTEVUMDA1Il0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzg0MjYxMzYxLCJleHAiOjE3ODQzNDgzNjF9.LfskS4NbVmrhdx8_Rp41DDv4bPs3jeG-rqRCIdecDgNSUyU4UWn9wYnETixunWJvw4B0HFhpR3crwGFhclxnf6Jd7WRzzYlRBG9K18EC9MWUcDRHHRhQaUjhOlpI4wAn0BGyir6un11bxQhD8JcEa0CGkGX_qeo7MJ6QRnChR9Jju7iHU9HEe939HxBLWiMJEQylxOykISACdvkOtqsdkycV8Ehk3MFdJPWIUE5WKUcEBLoECpAihbjIWg-tW16keD7MyuuXkZAS5Kf6gKUa3lAVN3l_UqbLzDaWdgGjXFGUfpqLZgx96QXElZStTBd1BWh5M7";
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

