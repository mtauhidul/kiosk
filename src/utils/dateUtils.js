/**
 * Date Utility Functions for Kiosk
 * JavaScript version for React app
 */

import { Timestamp } from "firebase/firestore";

/**
 * Parse flexible date formats to JavaScript Date
 */
export const parseFlexibleDate = (dateValue) => {
  if (!dateValue) return null;

  try {
    // Already a Date
    if (dateValue instanceof Date) {
      return isNaN(dateValue.getTime()) ? null : dateValue;
    }

    // Firestore Timestamp
    if (dateValue.toDate && typeof dateValue.toDate === "function") {
      return dateValue.toDate();
    }

    // String - try parsing
    if (typeof dateValue === "string") {
      const parsed = new Date(dateValue);
      
      if (isNaN(parsed.getTime())) {
        return null;
      }
      
      // For date-only strings (no time component), set to noon local time
      // This prevents timezone conversion issues when converting to Timestamp
      if (!dateValue.includes('T') && !dateValue.includes(':')) {
        parsed.setHours(12, 0, 0, 0);
      }
      
      return parsed;
    }

    return null;
  } catch (error) {
    console.warn("Error parsing date:", error);
    return null;
  }
};

/**
 * Convert any date to Firestore Timestamp
 */
export const toFirestoreTimestamp = (dateValue) => {
  const date = parseFlexibleDate(dateValue);
  if (!date) return null;

  try {
    return Timestamp.fromDate(date);
  } catch (error) {
    console.warn("Error converting to Timestamp:", error);
    return null;
  }
};

/**
 * Format Timestamp to readable string
 */
export const formatTimestamp = (timestamp, format = "short") => {
  if (!timestamp || !timestamp.toDate) return "";

  try {
    const date = timestamp.toDate();

    if (format === "short") {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  } catch (error) {
    return "";
  }
};

/**
 * Get today's date range as Timestamps
 */
export const getTodayRange = () => {
  const today = new Date();
  
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);

  return {
    start: Timestamp.fromDate(start),
    end: Timestamp.fromDate(end),
  };
};

/**
 * Create a date range for queries (accepts any date)
 * @param {Date} date - Date to create range for (defaults to today)
 * @returns {Object} Object with start and end Timestamps for the entire day
 */
export const getDateRange = (date) => {
  const targetDate = date || new Date();

  const start = new Date(targetDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(targetDate);
  end.setHours(23, 59, 59, 999);

  return {
    start: Timestamp.fromDate(start),
    end: Timestamp.fromDate(end),
  };
};

/**
 * Check if Timestamp is today
 */
export const isToday = (timestamp) => {
  if (!timestamp || !timestamp.toDate) return false;

  try {
    const date = timestamp.toDate();
    const today = new Date();
    
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  } catch (error) {
    return false;
  }
};

/**
 * Format date of birth for display
 */
export const formatDateOfBirth = (dob) => {
  if (!dob) return "";
  
  const date = parseFlexibleDate(dob);
  if (!date) return dob; // Return original if can't parse

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Normalize a date of birth to YYYY-MM-DD format
 * @param {*} dobValue - Date of birth in any format (string, Date, number)
 * @returns {string} Normalized DOB in YYYY-MM-DD format, or empty string if invalid
 */
export const normalizeDateOfBirth = (dobValue) => {
  if (!dobValue) return "";
  
  const parsed = parseFlexibleDate(dobValue);
  if (!parsed) return "";
  
  // Convert to YYYY-MM-DD format
  return parsed.toISOString().split('T')[0];
};
