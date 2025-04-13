// src/contexts/AlertContext.js
import React, { createContext, useContext, useState } from 'react';

// Default duration for alerts (in milliseconds)
const DEFAULT_DURATION = 5000;

// Create context
const AlertContext = createContext();

// Provider component
export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);
  
  // Function to show an alert
  const showAlert = (message, severity = 'info', duration = DEFAULT_DURATION) => {
    setAlert({ message, severity });
    
    // Auto-hide the alert after the specified duration
    if (duration > 0) {
      setTimeout(() => {
        setAlert(null);
      }, duration);
    }
  };
  
  // Function to hide the alert
  const hideAlert = () => {
    setAlert(null);
  };
  
  // Convenience methods for different alert types
  const success = (message, duration) => showAlert(message, 'success', duration);
  const error = (message, duration) => showAlert(message, 'error', duration);
  const warning = (message, duration) => showAlert(message, 'warning', duration);
  const info = (message, duration) => showAlert(message, 'info', duration);
  
  return (
    <AlertContext.Provider
      value={{
        alert,
        showAlert,
        hideAlert,
        success,
        error,
        warning,
        info
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

// Custom hook to use the Alert context
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};