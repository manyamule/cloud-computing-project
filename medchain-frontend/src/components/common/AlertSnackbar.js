// src/components/common/AlertSnackbar.js
import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAlert } from '../../contexts/AlertContext';

const AlertSnackbar = () => {
  const { alert, hideAlert } = useAlert();
  
  if (!alert) return null;
  
  return (
    <Snackbar
      open={!!alert}
      autoHideDuration={5000}
      onClose={hideAlert}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={hideAlert} 
        severity={alert.severity} 
        variant="filled"
        elevation={6}
      >
        {alert.message}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;