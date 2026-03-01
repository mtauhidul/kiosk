/**
 * Session Manager Component
 * Manages session timeout for kiosk security
 * Excludes welcome screen from timeout
 */

import { useLocation } from "react-router-dom";
import { useSessionTimeout } from "../hooks/useSessionTimeout";

const SessionManager = ({ children }) => {
  const location = useLocation();
  
  // Don't apply timeout on welcome screen
  const isWelcomeScreen = location.pathname === "/";
  
  // Enable timeout for all other screens
  useSessionTimeout(!isWelcomeScreen);
  
  return children;
};

export default SessionManager;
