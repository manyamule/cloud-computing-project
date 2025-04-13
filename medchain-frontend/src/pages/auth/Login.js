// src/pages/auth/Login.js
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
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../contexts/Web3Context';
import { useAlert } from '../../contexts/AlertContext';

const Login = () => {
  const navigate = useNavigate();
  const { error } = useAlert();
  const { loading } = useWeb3();
  
  const [userType, setUserType] = useState('patient');
  
  const handleConnect = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        navigate(userType === 'doctor' ? '/doctor' : '/patient');
      } else {
        error('MetaMask not detected. Please install MetaMask to continue.');
      }
    } catch (err) {
      error(err.message || 'Failed to connect wallet');
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
        LOGIN PANEL
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4">Log In</Typography>
        </Box>
        
        <Box mb={3}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            disabled={true}
            value="Connect with MetaMask"
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
            <InputLabel>User Type</InputLabel>
            <Select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              label="User Type"
            >
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="patient">Patient</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            disabled={true}
            value="••••••••"
            sx={{ mb: 3 }}
          />
        </Box>
        
        <Box textAlign="right" mb={2}>
          <Link href="#" underline="hover">
            Forgot password?
          </Link>
        </Box>
        
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          onClick={handleConnect}
          disabled={loading}
          sx={{ py: 1.5, mb: 2 }}
        >
          {loading ? 'Connecting...' : 'CONNECT WITH METAMASK'}
        </Button>
        
        <Box textAlign="center">
          <Typography variant="body1">
            Don't have an account? <Link href="/signup" underline="hover">Sign Up</Link>
          </Typography>
        </Box>
      </Paper>
      
      <Box textAlign="center" mt={4}>
        <Typography variant="body2" color="textSecondary">
          Powered by Ethereum and IPFS
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;