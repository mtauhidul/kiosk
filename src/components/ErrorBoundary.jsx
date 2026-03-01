/**
 * Error Boundary Component for Kiosk
 * Catches React errors and shows user-friendly message for patients
 */

import React, { Component } from "react";
import { Alert, Button, Container, Typography, Box } from "@mui/material";
import { ErrorOutline, Refresh, Home } from "@mui/icons-material";
import { captureException } from "../monitoring/sentry";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary caught error:", error, errorInfo);
    
    // Report to Sentry
    captureException(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    // Clear session storage (important for kiosk privacy)
    sessionStorage.clear();
    
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    
    // Redirect to welcome screen
    window.location.href = "/";
  };

  handleContactStaff = () => {
    alert("Please ask the front desk staff for assistance.");
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              p: 4,
              border: "1px solid",
              borderColor: "error.light",
              borderRadius: 2,
              backgroundColor: "background.paper",
            }}
          >
            {/* Error Icon */}
            <Box
              sx={{
                p: 2,
                backgroundColor: "error.light",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ErrorOutline sx={{ fontSize: 48, color: "error.main" }} />
            </Box>

            {/* Error Message */}
            <Typography variant="h5" component="h1" gutterBottom textAlign="center">
              Something Went Wrong
            </Typography>

            <Typography variant="body1" color="text.secondary" textAlign="center">
              We encountered an unexpected error with the check-in system.
              Please try again or contact the front desk for assistance.
            </Typography>

            {/* Error details (development only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
                <Typography variant="caption" component="pre" sx={{ whiteSpace: "pre-wrap" }}>
                  {this.state.error.toString()}
                </Typography>
              </Alert>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 2, width: "100%" }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<Refresh />}
                onClick={this.handleReset}
                size="large"
              >
                Start Over
              </Button>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<Home />}
                onClick={this.handleContactStaff}
                size="large"
              >
                Contact Staff
              </Button>
            </Box>

            {/* Additional Help Text */}
            <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
              Error ID: {Date.now().toString(36).toUpperCase()}
              <br />
              Please provide this ID to staff if the problem persists.
            </Typography>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
