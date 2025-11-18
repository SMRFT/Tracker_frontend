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
  const dev_token ="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDM4MCIsImVtYWlsIjoibWFuaWJhbGFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6Ik1hbmliYWxhbiIsImFsbG93ZWQtYWN0aW9ucyI6WyJTSEktUC1ERUxSQVctUlciLCJTSEktUC1SRUMtUlciLCJTSEktUC1FWFAtUlciLCJTVC1SLUNEUiIsIlNULUFQSS1FTVAtUiIsIk1EQy1BUEktQVQtUlciLCJNREMtQVBJLVBBVC1SIiwiU0hJLVAtRjJTUi1SVyIsIk1EQy1QLVBOUC1SIiwiU0hJLVAtU0lDVS1SVyIsIlNISS1QLUYxU1ItUlciLCJTSEktUC1VUERSQVctUlciLCJTSEktUC1NT0NLLVJXIiwiU0hJLVAtTUlDVS1SVyIsIlNULVAtQlJELVIiLCJHTC1QLUFORC1SVyIsIlNULVAtQ01ULVJXIiwiU0hJLVAtWFJBWS1SVyIsIlNISS1QLUZPUk0tUlciLCJTSEktUC1BVkFJTC1SVyIsIlNISS1QLVRSQUlOLVJXIiwiU1QtUC1OVEYtUiIsIlNISS1QLUxBQi1SVyIsIlNISS1QLUYzLVJXIiwiTURDLVAtU09SLVIiLCJTSEktUC1DVC1SVyIsIlNISS1QLUYyLVJXIiwiU0hJLVAtRjFTLVJXIiwiU1QtUC1ERVMtUlciLCJHTC1QLUVQLVJXIiwiTURDLUFQSS1HQVMtUiIsIlNISS1QLVRSQUlOUi1SVyIsIlNISS1QLVVQRC1SVyIsIkdMLVAtUC1SVyIsIlNISS1QLUYyUy1SVyIsIlNISS1QLUYzUi1SVyIsIlNISS1QLVBIWS1SVyIsIlNISS1QLUhBTkRSLVJXIiwiU0hJLVAtRjFSLVJXIiwiTURDLUFQSS1USFItUiIsIlNISS1QLUNIRU1PUi1SVyIsIk1EQy1BUEktUlRTLVIiLCJTSEktUC1OSUNVLVJXIiwiTURDLVAtQVNNLVJXIiwiU0hJLVAtSU5DIiwiR0wtUC1FQlQtUlciLCJTVC1BUEktQU1DLVJXIiwiTURDLVAtUkVHLVIiLCJTVC1BUEktQlJELVJXIiwiTURDLVAtUE5QLVJXIiwiR0wtUC1FQUQtUlciLCJNREMtUC1QTlBSLVIiLCJTSEktUC1ERUwtUlciLCJTSEktUC1PVC1SVyIsIkdMLVAtRUwtUlciLCJNREMtQVBJLUFULVIiLCJTSEktUC1PUEQtUlciLCJTSEktUC1FTVItUlciLCJHTC1QLU5EQy1SVyIsIk1EQy1BUEktTEJOLVIiLCJTSEktUC1NSUNVUi1SVyIsIlNISS1QLUYxLVJXIiwiU0hJLVAtSEFORC1SVyIsIlNISS1QLUYyUi1SVyIsIlNISS1QLUdFVFJBVy1SVyIsIlNJLVItSU5EIiwiTURDLVAtT1NCLVJXIiwiU1QtUC1UREwtUlciLCJTVC1QLU5URi1SVyIsIlNISS1QLUZSTlQtUlciLCJTSEktUC1OSUNVUi1SVyIsIkdMLVAtUlNFLVJXIiwiU0hJLVAtRElBLVJXIiwiTURDLVItUkVDIiwiU1QtUC1TTk8tUlciLCJTVC1QLURFUy1SIiwiTURDLUFQSS1QQVQiLCJTSEktUC1NUkQtUlciLCJTSEktUC1QSEFSTS1SVyIsIlNISS1QLUVNUlItUlciLCJTVC1SLUEiLCJTVC1QLUNNVC1SIiwiU1QtQVBJLUNSRC1SVyIsIkdMLVAtRUQtUlciLCJTSEktUC1NUkktUlciLCJTSEktUC1SRUNSLVJXIiwiTURDLUFQSS1DRFItUiIsIlNISS1QLUNIRU1PLVJXIiwiTURDLVAtVFJCLVJXIiwiTURDLVAtUkVHLVJXIiwiU1QtUC1UREwtUiIsIlNISS1QLVNJQ1VSLVJXIiwiTURDLUFQSS1SREwtUlciLCJTSEktUC1IUi1SVyJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDA1Il0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzYzNDQ3NzA0LCJleHAiOjE3NjM1MzQ3MDQsImp0aSI6ImRjYTFkMGUwLTc3Y2EtNDRkMS1hNjQwLTViMGQyOTRhM2U0OCJ9.S6ax7hhM5GS9TXH7C3EBWTE1UCtghBKHo2l02nsC_V1U95tgOgYlX5yJdoc5zvLj0t7_iVBxfviS5EFCI8XqCkzfpv0Ezf2g8AAY7QtE_9tjsYKwbYVJVHqg2V-f2_TL323gF5_-1ffMBYT2TapeIuGsd_cqwvts2JkVaUtW_4dayOjT-4vNRvFTw9FInwI4RA6m2jqKqB_qug29CYPC4Y8ONs1EoMcdqVMOjvVJSWwp_wxQaBARZstAhpOc1PXRBY1nfFxSxFYm4Kktuubd0JXutlJsoMsyLAhJ50ABs8Ci6FBYrBv7WvzNNriIzhmrRkC3LeEo0TBl_z1Xa8f1OQ";
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

