import axios from "axios";
import { toast } from "react-toastify";

/**
 * Reusable API request helper with token authentication
 * @param {string} url - The API endpoint URL
 * @param {string} method - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param {Object|null} data - Request body data for POST/PUT/PATCH/DELETE
 * @param {Object} headers - Additional headers to merge with defaults
 * @param {Object} config - Additional axios configuration (like params)
 * @returns {Promise<Object>} - Returns { success: boolean, data?: any, error?: string, status?: number }
 */
// ✅ API helper
const apiRequest = async (url, method = "GET", data = null, headers = {}) => {
  try {
    const token = localStorage.getItem("access_token");

    const defaultHeaders = {
      "Content-Type": "application/json",
      Authorization: token, // Use 'Bearer' if backend expects it
    };

    const config = {
      method,
      url,
      headers: { ...defaultHeaders, ...headers },
      validateStatus: () => true,
    };

    if (data && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      config.data = data;
    }

    const response = await axios(config);

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else if (response.status === 400) {
      return {
        success: false,
        error: "Invalid data sent to server.",
        status: 400,
        data: response.data,
      };
    } else if (response.status === 401) {
      return {
        success: false,
        error: "Session expired. Please log in again.",
        status: 401,
        data: response.data,
      };
    } else {
      return {
        success: false,
        error: "Something went wrong. Try again.",
        status: response.status,
        data: response.data,
      };
    }
  } catch (error) {
    console.error("Network or unexpected error:", error);
    return {
      success: false,
      error: "Network error or unexpected issue occurred.",
      networkError: true,
    };
  }
};

export default apiRequest;
