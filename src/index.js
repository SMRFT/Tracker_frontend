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
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NiIsImVtYWlsIjoiY2hhbmRyYXNtcmZ0QGdtYWlsLmNvbSIsIm5hbWUiOiJDaGFuZHJhIiwiYWxsb3dlZC1hY3Rpb25zIjpbIkVSLVItRVJBIiwiR0wtUC1QLVJXIiwiRVItUC1EU0gtUiIsIlNULVAtTlRGLVIiLCJFUi1QLVBMLVIiLCJTSEktUC1UUkFJTi1SVyIsIlNULVAtQlJELVIiLCJHTC1QLUVQLVJXIiwiU1QtUi1IT0QiLCJTVC1QLUNNVC1SVyIsIlNULVAtQ01ULVIiLCJTVC1QLURFUy1SIiwiU1QtUC1TTk8tUlciLCJTVC1BUEktQlJELVJXIiwiU1QtUC1UREwtUlciLCJTVC1QLVRETC1SIiwiU0hJLVAtRVhQLVJXIiwiU1QtQVBJLUVNUC1SIiwiU0hJLVAtSU5DIiwiU1QtUC1OVEYtUlciLCJHTC1QLUVBRC1SVyIsIlNULUFQSS1BTUMtUlciLCJTVC1BUEktQ1JELVJXIiwiRVItUC1QQi1SIiwiU1QtUC1ERVMtUlciLCJHTC1QLUVMLVJXIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3NTEwMjA2NzEsImV4cCI6MTc1MTEwNzA3MSwianRpIjoiN2VkMmJhMmYtYTMzNC00YmNlLTg3ZWYtNjAwZDkzZjQwNDI0In0.ZPENx7oxAjCnu4b-rPiun8qXhARrIoL_2aBMmqcJm7GyYk07jWI6-kE0OWnEOwtOqbBZe-JECJHnsSMR6s9ytiavmA1ksy5ifr4IFJp0gVCrtRFHefWACPoatocoT_IyABVBvfiUXWFFtWyoDqu50tdx0cj32d8zcQeSHRXq_D1m08M-aBc1JJzqDZ9Ev8nJg_c0a8CN6G_mjXHquSHvyxrZ0Jshx7CnMi_GdMM9aYZ1cFfRJ_AbeaImRHPftNzNVa4uqpjSSZ32ONP1u7aeIblA8bju3i9rUrZju9YNwYrfIzsQ0JoHfIeuwkjVnpbv_xtebeX6gwO6Z66QUTMTlQ"; // Keep empty to force redirect in development
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
    window.location.href = "https://loginshanmuga.netlify.app/";
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
