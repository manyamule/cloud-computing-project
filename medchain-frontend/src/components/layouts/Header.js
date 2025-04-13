// src/components/layouts/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Box, Chip, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import { useWeb3 } from '../../contexts/Web3Context';

const Header = () => {
  const { accounts, role, loading } = useWeb3();
  
  // Function to truncate address for display
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.substr(0, 6)}...${address.substr(-4)}`;
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 'bold',
            flexGrow: 1
          }}
        >
          MedChain
        </Typography>
        
        {/* Account Info */}
        {!loading && (
          <Box display="flex" alignItems="center" gap={2}>
            {accounts && accounts[0] ? (
              <>
                <Box display="flex" alignItems="center" gap={1}>
                  <PersonIcon fontSize="small" />
                  <Typography variant="body2">
                    {truncateAddress(accounts[0])}
                  </Typography>
                </Box>
                
                <Chip
                  label={role === 'unknown' ? 'Not Registered' : role === 'doctor' ? 'Doctor' : 'Patient'}
                  color={
                    role === 'unknown' 
                      ? 'default' 
                      : role === 'doctor' 
                        ? 'primary' 
                        : 'secondary'
                  }
                  size="small"
                />
                
                {role !== 'unknown' && (
                  <Button
                    component={Link}
                    to={role === 'doctor' ? '/doctor' : '/patient'}
                    variant="contained"
                    size="small"
                  >
                    {role === 'doctor' ? 'Doctor Portal' : 'My Records'}
                  </Button>
                )}
              </>
            ) : (
              <Typography variant="body2">
                Wallet not connected
              </Typography>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;