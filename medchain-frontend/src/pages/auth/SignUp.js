// src/pages/auth/SignUp.js
import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../contexts/Web3Context';
import { useAlert } from '../../contexts/AlertContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { registerDoctor } = useWeb3();
  const { success, error } = useAlert();
  
  const [userType, setUserType] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  
  const handleSignUp = async () => {
    try {
      if (userType === 'doctor') {
        await registerDoctor();
        success('Successfully registered as a doctor!');
        navigate('/doctor');
      } else {
        success('Please ask your doctor to register you as a patient');
        navigate('/');
      }
    } catch (err) {
      error(err.message || 'Registration failed');
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ color: 'primary.main' }}>
        SIGN UP PANEL
      </Typography>
      
      <Grid container spacing={4} justifyContent="center">
        {/* User type selection */}
        <Grid item xs={12} md={10}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Button 
                fullWidth
                variant={userType === 'patient' ? 'contained' : 'outlined'}
                color="primary"
                size="large"
                onClick={() => setUserType('patient')}
                sx={{ py: 1.5 }}
              >
                <Typography variant="h5">FOR PATIENT</Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button 
                fullWidth
                variant={userType === 'doctor' ? 'contained' : 'outlined'}
                color="primary"
                size="large"
                onClick={() => setUserType('doctor')}
                sx={{ py: 1.5 }}
              >
                <Typography variant="h5">FOR DOCTOR</Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Sign up form */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Sign Up
            </Typography>
            
            <Box mb={3}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
              />
              
              {userType === 'doctor' && (
                <>
                  <TextField
                    fullWidth
                    label="Specialization"
                    variant="outlined"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    margin="normal"
                  />
                  
                  <TextField
                    fullWidth
                    label="License No."
                    variant="outlined"
                    value={licenseNo}
                    onChange={(e) => setLicenseNo(e.target.value)}
                    margin="normal"
                  />
                </>
              )}
            </Box>
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSignUp}
              sx={{ py: 1.2, mb: 2 }}
            >
              SIGN UP
            </Button>
            
            <Box textAlign="center">
              <Typography variant="body2">
                Already a user? <Link href="/login" underline="hover">Log in</Link>
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h4" gutterBottom>
              ENTIRE SYSTEM
            </Typography>
            <Typography variant="h5" gutterBottom>
              INCLUDING
            </Typography>
            <Typography variant="h5" gutterBottom>
              LOGIN DETAILS
            </Typography>
            <Typography variant="h5" gutterBottom>
              IMPLEMENTED
            </Typography>
            <Typography variant="h5" gutterBottom>
              USING
            </Typography>
            <Typography variant="h5" gutterBottom>
              BLOCKCHAIN
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignUp;