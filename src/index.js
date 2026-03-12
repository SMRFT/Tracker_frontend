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
  const dev_token ="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDM4MCIsImVtYWlsIjoibWFuaWJhbGFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6Ik1hbmliYWxhbiIsImFsbG93ZWQtYWN0aW9ucyI6WyJNREMtUC1PU0ItUlciLCJTSEktUC1DSEVNT1ItUlciLCJTSEktUC1GMlMtUlciLCJNREMtUi1SRUMiLCJNREMtUC1SRUctUiIsIkVSLVAtRVJQLVIiLCJFUi1QLUVSR0FTLVJXIiwiU1QtQVBJLUFNQy1SVyIsIlNISS1QLVVQRC1SVyIsIlNISS1QLVNJQ1VSLVJXIiwiU0hJLVAtREVMLVJXIiwiTURDLUFQSS1SVFMtUiIsIk1EQy1QLUFTTS1SVyIsIlNISS1QLUYyLVJXIiwiU0hJLVAtVFJBSU4tUlciLCJFUi1SLUVSUCIsIlNISS1QLVJFQ1ItUlciLCJNREMtUC1QTlAtUlciLCJTSEktUC1FTVItUlciLCJTSEktUC1GMy1SVyIsIlNULUFQSS1FTVAtUiIsIlNULUFQSS1CUkQtUlciLCJNREMtUC1TT1ItUiIsIlNISS1QLVBIWS1SVyIsIk1EQy1BUEktVEhSLVIiLCJTSEktUC1GMlItUlciLCJTSEktUC1NSUNVLVJXIiwiRVItUC1FUlZCLVJXIiwiU1QtUC1ERVMtUlciLCJTSEktUC1QSEFSTS1SVyIsIkdMLVAtUlNFLVJXIiwiU0hJLVAtSU5DIiwiU0hJLVAtTklDVS1SVyIsIkdMLVAtRUJULVJXIiwiU0hJLVAtT1BELVJXIiwiR0wtUC1FUC1SVyIsIlNISS1QLUhBTkRSLVJXIiwiU0ktUi1JTkQiLCJTSEktUC1GMS1SVyIsIlNULVAtVERMLVJXIiwiTURDLUFQSS1DRFItUiIsIlNISS1QLVRSQUlOUi1SVyIsIlNISS1QLU1SRC1SVyIsIlNISS1QLU1SSS1SVyIsIkdQLVAtR0NOLVIiLCJNREMtQVBJLUFULVIiLCJFUi1QLUVSVVMtUlciLCJHTC1QLU5EQy1SVyIsIlNISS1QLUhSLVJXIiwiU0hJLVAtU0lDVS1SVyIsIlNISS1QLVJFQy1SVyIsIk1EQy1QLUNERS1SVyIsIlNISS1QLUZSTlQtUlciLCJTSEktUC1GM1ItUlciLCJHTC1QLUVELVJXIiwiTURDLUFQSS1MQk4tUiIsIk1EQy1QLVRSQi1SVyIsIlNULVAtTlRGLVJXIiwiU0hJLVAtTU9DSy1SVyIsIlNISS1QLURJQS1SVyIsIlNULVAtU05PLVJXIiwiU0hJLVAtRVhQLVJXIiwiU0hJLVAtT1QtUlciLCJNREMtUC1QTlBSLVIiLCJNREMtUC1SREUtUlciLCJNREMtQVBJLUdBUy1SIiwiU1QtUC1DTVQtUlciLCJTVC1BUEktQ1JELVJXIiwiU0hJLVAtWFJBWS1SVyIsIkVSLVAtRVJHUFItUlciLCJNREMtUC1QVEUtUlciLCJNREMtQVBJLVBBVC1SIiwiU0hJLVAtR0VUUkFXLVJXIiwiU0hJLVAtRjFTLVJXIiwiR0wtUC1QLVJXIiwiU1QtUC1OVEYtUiIsIk1EQy1BUEktUkRMLVJXIiwiU0hJLVAtTUlDVVItUlciLCJTVC1QLURFUy1SIiwiU0hJLVAtRU1SUi1SVyIsIlNISS1QLUFWQUlMLVJXIiwiR0wtUC1FQUQtUlciLCJHTC1QLUFORC1SVyIsIlNULVAtVERMLVIiLCJTVC1QLUNNVC1SIiwiU0hJLVAtRjFSLVJXIiwiU0hJLVAtVVBEUkFXLVJXIiwiTURDLUFQSS1BVC1SVyIsIlNISS1QLURFTFJBVy1SVyIsIlNISS1QLU5JQ1VSLVJXIiwiU0hJLVAtQ0hFTU8tUlciLCJTSEktUC1DVC1SVyIsIlNULVAtQlJELVIiLCJTSEktUC1GMlNSLVJXIiwiU1QtUi1BIiwiTURDLVAtUE5QLVIiLCJNREMtUC1SRUctUlciLCJTSEktUC1MQUItUlciLCJFUi1QLUVSU0QtUlciLCJNREMtQVBJLVBBVCIsIlNISS1QLUYxU1ItUlciLCJTVC1SLUNEUiIsIlNISS1QLUZPUk0tUlciLCJTSEktUC1IQU5ELVJXIiwiR0wtUC1FTC1SVyJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDA1Il0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzcwNzkwMTMwLCJleHAiOjE3NzA4NzcxMzAsImp0aSI6IjMyMTIxOGZlLTcyNjItNGY2Zi05MTYyLTgyNjJjOTkwYTRkMCJ9.DSbp3k5HLmbqMzamTpY9oB7z1TFEnYbK_KuV0dZvqEvSEz8z_O4-rvZzWfw-tbw8laQE8v4ksEoFxiZfUDbr7KKCmiLsqhRug90mMvZUjhiiY4btv-LsUh_AKQzdJzu_5nJqxKNvNgx8YwLBNVpfrRPCQyMruUM-hJmE06hlwR_x--s498rC2pOiM9x_aIh300pIrjUDvVoOUq5D44njVuo0mqrXByObQPtdzwa87_8dPzhIJwpt9frd6jvUte6T3i2dYZNue-BQZ9RTrgSjo5SjjbHvEK79VTtbkiRbxxIR3KJH2-KajxpB-fc3Cv2yQ-iTa-HPSbIgtD1MycfYwQ";
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

