/**
 * Sentry Configuration for Kiosk App
 * Error monitoring for patient check-in kiosk
 */

import * as Sentry from "@sentry/react";

export const initSentry = () => {
  const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;

  // Only initialize if DSN is provided
  if (!SENTRY_DSN) {
    console.warn("⚠️ Sentry DSN not configured. Error monitoring disabled.");
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    
    // Environment
    environment: process.env.NODE_ENV || "development",
    
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    
    // NO Session Replay for kiosk (PHI privacy concern)
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 0.0,
    
    // Filter sensitive patient data
    beforeSend(event) {
      // Remove patient identifiable information from error reports
      if (event.request) {
        // Remove sensitive query params
        if (event.request.url) {
          try {
            const url = new URL(event.request.url);
            url.searchParams.delete("patientId");
            url.searchParams.delete("encounterId");
            url.searchParams.delete("firstName");
            url.searchParams.delete("lastName");
            url.searchParams.delete("dateOfBirth");
            event.request.url = url.toString();
          } catch (e) {
            // Invalid URL, skip
          }
        }
      }
      
      // Remove breadcrumbs with PHI
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
          if (breadcrumb.data) {
            const sensitiveFields = [
              "patientId", "firstName", "lastName", "dateOfBirth", 
              "ssn", "email", "phone", "address", "encounterId"
            ];
            sensitiveFields.forEach(field => {
              if (breadcrumb.data && breadcrumb.data[field]) {
                breadcrumb.data[field] = "[REDACTED]";
              }
            });
          }
          return breadcrumb;
        });
      }
      
      return event;
    },
    
    // Ignore common errors
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "Non-Error promise rejection captured",
    ],
  });
};

/**
 * Manually capture exceptions
 */
export const captureException = (error, context) => {
  if (context) {
    Sentry.setContext("additional", context);
  }
  Sentry.captureException(error);
};

/**
 * Log events
 */
export const logEvent = (message, level = "info") => {
  Sentry.captureMessage(message, level);
};
