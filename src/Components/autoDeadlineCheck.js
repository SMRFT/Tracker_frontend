// frontend/src/Components/autoDeadlineCheck.js
import { toast } from "react-toastify";
import apiRequest from "./apiRequest";

export const checkDeadline = async (isManual = false) => {
  const TrackerbaseURL = process.env.REACT_APP_BACKEND_TRACKER_BASE_URL;

  try {
    const url = isManual
      ? `${TrackerbaseURL}check-deadline/?manual=true`
      : `${TrackerbaseURL}check-deadline/`;

    const { success, data, error, status } = await apiRequest(url, "GET");

    if (success) {
      // toast.success(data?.message || "Deadline check successful.", {
      //   autoClose: 2000,   // closes automatically in 2s
      //   closeOnClick: true, // closes when clicked
      //   closeButton: true,  // show close (✖) button
      // });
      return { success: true, data, status };
    } else {
      toast.error(error || "Deadline check failed.", {
        autoClose: 2000,
        closeOnClick: true,
        closeButton: true,
      });
      return { success: false, error, status };
    }
  } catch (err) {
    console.error("Deadline check error:", err);
    toast.error("Unable to connect to deadline check service.", { autoClose: 2000 });
    return { success: false, error: err.message };
  }
};

let intervalId = null;

export const startAutoDeadlineCheck = () => {
  if (!intervalId) {
    intervalId = setInterval(() => checkDeadline(false), 10 * 60 * 1000); // Every 10 minutes
    console.log("Started auto deadline check.");
    checkDeadline(false); // Initial check
  }
};

export const stopAutoDeadlineCheck = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("Stopped auto deadline check.");
  }
};

export const manualDeadlineCheck = () => {
  console.log("Manual deadline check triggered.");
  return checkDeadline(true); // Pass isManual=true
};
