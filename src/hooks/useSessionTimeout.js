/**
 * Session Timeout Hook
 * Automatically logs out kiosk user after 5 minutes of inactivity
 * Protects patient privacy on public kiosks
 */

import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const WARNING_DURATION = 60 * 1000; // Show warning 1 minute before timeout

/**
 * Custom hook to handle session timeout
 * @param {boolean} enabled - Whether timeout is active (disable on welcome screen)
 */
export const useSessionTimeout = (enabled = true) => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const warningShownRef = useRef(false);

  /**
   * Clear all session data and redirect to welcome screen
   */
  const handleTimeout = useCallback(() => {
    console.log("⏱️ Session timeout - clearing data and redirecting");
    
    // Clear all session storage (important for patient privacy)
    sessionStorage.clear();
    
    // Clear all local storage related to patient data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes("patient") || key.includes("kiosk"))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Show message
    toast.error("Session expired due to inactivity. Please start over.", {
      duration: 5000,
    });
    
    // Redirect to welcome screen
    navigate("/");
  }, [navigate]);

  /**
   * Show warning before timeout
   */
  const showWarning = useCallback(() => {
    if (!warningShownRef.current) {
      warningShownRef.current = true;
      toast("Your session will expire in 1 minute due to inactivity.", {
        icon: "⏰",
        duration: 10000,
      });
    }
  }, []);

  /**
   * Reset the timeout timers on user activity
   */
  const resetTimeout = useCallback(() => {
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    
    // Reset warning flag
    warningShownRef.current = false;

    // Only set new timeouts if enabled
    if (enabled) {
      // Set warning timeout (1 minute before session expires)
      warningTimeoutRef.current = setTimeout(() => {
        showWarning();
      }, TIMEOUT_DURATION - WARNING_DURATION);

      // Set session timeout
      timeoutRef.current = setTimeout(() => {
        handleTimeout();
      }, TIMEOUT_DURATION);
    }
  }, [enabled, handleTimeout, showWarning]);

  /**
   * Setup event listeners for user activity
   */
  useEffect(() => {
    if (!enabled) {
      // Clear timeouts if disabled
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      return;
    }

    // Events that indicate user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    // Reset timeout on any user activity
    const handleActivity = () => {
      resetTimeout();
    };

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Start the timeout timer
    resetTimeout();

    // Cleanup
    return () => {
      // Remove event listeners
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      
      // Clear timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [enabled, resetTimeout]);

  return {
    resetTimeout, // Manually reset if needed
  };
};

export default useSessionTimeout;
