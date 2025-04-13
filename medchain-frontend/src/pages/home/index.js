// src/pages/home/index.js
import React from 'react';
import { Box, Typography, Button, Container, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../contexts/Web3Context';
import { useAlert } from '../../contexts/AlertContext';

const HomePage = () => {
  const { accounts, role, loading, registerDoctor } = useWeb3();
  const { success, error } = useAlert();
  const navigate = useNavigate();
  
  // Handle doctor registration
  const handleRegisterDoctor = async () => {
    try {
      await registerDoctor();
      success('Successfully registered as a doctor');
      navigate('/doctor');
    } catch (err) {
      error(err.message || 'Failed to register as doctor');
    }
  };
  
  // Handle navigation to portal
  const handleGoToPortal = () => {
    navigate(role === 'doctor' ? '/doctor' : '/patient');
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Connecting to blockchain...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        textAlign="center"
      >
        <Typography variant="h2" component="h1" gutterBottom>
          MedChain
        </Typography>
        
        <Typography variant="h5" color="textSecondary" paragraph>
          A secure blockchain-based medical records system
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, mt: 4, width: '100%', maxWidth: 600 }}>
          {!accounts || accounts.length === 0 ? (
            <Box>
              <Typography variant="body1" paragraph>
                Please connect your MetaMask wallet to continue.
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                If MetaMask is not prompting automatically, please click the MetaMask extension icon in your browser.
              </Typography>
            </Box>
          ) : (
            <Box>
              {role === 'unknown' ? (
                <Box>
                  <Typography variant="body1" paragraph>
                    Your wallet is connected, but you're not registered yet.
                  </Typography>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleRegisterDoctor}
                    sx={{ mt: 2 }}
                  >
                    Register as Doctor
                  </Button>
                  
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    If you are a patient, ask your doctor to register you.
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Welcome, {role === 'doctor' ? 'Doctor' : 'Patient'}
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    You are logged in and ready to use the system.
                  </Typography>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleGoToPortal}
                  >
                    Go to {role === 'doctor' ? 'Doctor Portal' : 'Patient Records'}
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Paper>
        
        <Typography variant="body2" color="textSecondary" sx={{ mt: 4 }}>
          Powered by Ethereum and IPFS
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;