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
  const dev_token ="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDM4MCIsImVtYWlsIjoibWFuaWJhbGFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6Ik1hbmliYWxhbiIsImFsbG93ZWQtYWN0aW9ucyI6WyJTSEktUC1BVkFJTC1SVyIsIlNISS1QLU1JQ1VSLVJXIiwiU0hJLVAtTVJJLVJXIiwiU0hJLVAtR0VUUkFXLVJXIiwiTURDLVAtVFJCLVJXIiwiU0hJLVAtR0ktUiIsIlNULVAtVERMLVJXIiwiU0lOLUFQSS1PUlItUiIsIlNUUi1SLUEiLCJTSEktUC1PUEQtUlciLCJNREMtUC1QVEUtUlciLCJTVC1QLUNNVC1SVyIsIlNULVAtQlJELVIiLCJTSEktUC1QSEFSTS1SVyIsIk1EQy1QLUNBLVJXIiwiU1RSLUFQSS1UUkwtUiIsIlNISS1QLUlOQyIsIkdMLVAtRUQtUlciLCJTVFItQVBJLVRSTFItUiIsIlNISS1QLUhBTkQtUlciLCJHTC1QLVJTRS1SVyIsIk1EQy1BUEktUlRTLVIiLCJTSEktUC1GMy1SVyIsIk1EQy1QLUdEVFMtUiIsIk1EQy1QLUdBVC1SVyIsIk1EQy1QLVBOUC1SIiwiU0hJLVAtVFJBSU4tUlciLCJTSEktUC1ESUEtUlciLCJTSEktUC1DVC1SVyIsIkdMLVAtUC1SVyIsIkVSLVAtRVJCLVJXIiwiU0lOLUFQSS1GVS1SVyIsIlNISS1QLURFTC1SVyIsIlNUUi1BUEktSUwiLCJTVC1BUEktQlJELVJXIiwiU0hJLVAtRjFSLVJXIiwiU0hJLVAtSU5DLVJXIiwiRVItUC1FUlJFUC1SVyIsIlNULUFQSS1BTUMtUlciLCJTSS1SLUlORCIsIlNUUi1BUEktSUwtUiIsIlNISS1QLU9ULVJXIiwiU0hJLVAtSEFORFItUlciLCJHTC1QLUVMLVJXIiwiU1QtUC1UREwtUiIsIlNISS1QLUYxUy1SVyIsIlNISS1QLUYzUi1SVyIsIkVSLVItRVJTQSIsIk1EQy1QLUdBRC1SVyIsIk1EQy1BUEktQVQtUlciLCJTVC1BUEktQ1JELVJXIiwiR0wtUC1OREMtUlciLCJNREMtQVBJLVRIUi1SIiwiU0hJLVAtRU1SLVJXIiwiTURDLVAtRUYtUlciLCJTSEktUC1ERUxSQVctUlciLCJTVFItQVBJLVRJTi1SIiwiU0hJLVAtRjItUlciLCJTVFItQVBJLVRSTC1SVyIsIk1EQy1QLUNERS1SVyIsIlNJTi1SLVNUQSIsIlNISS1QLUYyUy1SVyIsIlNISS1QLVNVUElOVi1SVyIsIlNULVAtTlRGLVJXIiwiTURDLUFQSS1MQk4tUiIsIlNISS1QLVJFQ1ItUlciLCJTVC1QLU5URi1SIiwiU0hJLVAtRk9STS1SVyIsIk1EQy1BUEktQVQtUiIsIlNULVItQSIsIkdMLVAtQU5ELVJXIiwiU1QtUC1DTVQtUiIsIkdQLVAtR0NOLVIiLCJTVC1BUEktVFJMUi1SVyIsIk1EQy1BUEktUkRMLVIiLCJNREMtUC1SRUctUiIsIlNUUi1QLUlDUy1SIiwiTURDLVAtUkRFLVJXIiwiU0hJLVAtRjJTUi1SVyIsIkdMLVAtRVAtUlciLCJTSEktUC1MQUItUlciLCJTVFItUC1USU5SLVJXIiwiU0hJLVAtUkVDLVJXIiwiU0lOLVAtR0RMLVJXIiwiTURDLVAtUE5QLVJXIiwiU1QtQVBJLUVNUC1SIiwiU1RSLUFQSS1JTC1SVyIsIk1EQy1QLVVBUy1SVyIsIk1EQy1BUEktQ0RSLVIiLCJTSEktUC1IUi1SVyIsIlNISS1QLU1PQ0stUlciLCJTSEktUC1VUEQtUlciLCJNREMtUC1PU0ItUlciLCJNREMtUC1SRUctUlciLCJTSU4tQVBJLU9SLVJXIiwiU0hJLVAtQ0hFTU9SLVJXIiwiTURDLVAtQUQtUlciLCJHTC1QLUVCVC1SVyIsIk1EQy1QLUFTTS1SVyIsIlNUUi1BUEktVkwtUiIsIkVSLVAtRVJBUy1SVyIsIk1EQy1QLVNPUi1SIiwiR0wtUC1FQUQtUlciLCJTSEktUC1GMVNSLVJXIiwiU0hJLVAtRVhQLVJXIiwiU1QtUC1TTk8tUlciLCJTSEktUC1TSUNVUi1SVyIsIkVSLUFQSS1FUlVCLVJXIiwiU0hJLVAtRU1SUi1SVyIsIlNULVAtREVTLVJXIiwiU0hJLVAtTVJELVJXIiwiU1RSLVAtVElOUi1SIiwiU0hJLVAtTUlDVS1SVyIsIlNJTi1BUEktSUYtUlciLCJTSEktUC1GMS1SVyIsIlNUUi1BUEktVElOLVJXIiwiU0hJLVAtUEhZLVJXIiwiU0hJLVAtVVBEUkFXLVJXIiwiRVItUC1FUkdQUi1SVyIsIlNISS1QLVhSQVktUlciLCJTSEktUC1OSUNVUi1SVyIsIk1EQy1QLVBOUFItUiIsIlNISS1QLVRSQUlOUi1SVyIsIkVSLVAtRVJWQi1SVyIsIlNJTi1BUEktU0YtUiIsIlNISS1QLUlOQ0MtUlciLCJTSEktUC1DSEVNTy1SVyIsIk1EQy1BUEktUEFULVIiLCJNREMtQVBJLUdBUy1SIiwiU1QtUC1ERVMtUiIsIlNISS1QLU5JQ1UtUlciLCJTSU4tUC1HSUMtUiIsIlNISS1QLVNJQ1UtUlciLCJTSU4tUC1FTlEtUlciLCJFUi1QLUVSR0FTLVJXIiwiU1RSLUFQSS1WTC1SVyIsIlNISS1QLUYyUi1SVyIsIlNJTi1QLUVOUUwtUlciLCJTSEktUC1GUk5ULVJXIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaG9zcGl0YWxfY29kZSI6IlNIMDAxIiwiaG1zX3BhZ2VzIjpbXSwiYWxsb3dlZC1vdXRsZXRzIjpbXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3ODM5MTU1OTUsImV4cCI6MTc4NDAwMjU5NX0.Ydw3XRVSMzqZz25-k_azOgKjgJCB-6Pa7PQCkWJmC_3TfDg0fBMhRtaTcfu_spRKRYUcdO198vwfahAe4GncDD_BBoJx5-TCuOa_njl4ElR6vplvK7ZTcBmGMDRwKVWhNX_8zXA4iR5m5bsOpBPRLLFB633y9EsYqUFyF7PsbZkNeQ7r9hj-lO9o4mHkndLKBMnqomwLQqCapV0ADp85MePOls1YWcCuGdMmoM_OoAXijic5HZbfvzXEY0Nltbrv84opI_MXJQo3JcgNl2yXIeK7X3fi-_FDpi1jRE4Bd54319KIjIRyoOWjnBF8XHTCDqgq3xemu8mlEQ7TiVkfew";
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

