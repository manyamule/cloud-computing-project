// src/pages/patient/index.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  Divider
} from '@mui/material';
import { useWeb3 } from '../../contexts/Web3Context';
import { useAlert } from '../../contexts/AlertContext';
import RecordItem from '../../components/records/RecordItem';
import Loading from '../../components/common/Loading';

const PatientPage = () => {
  const { accounts, role, loading, getPatientRecords } = useWeb3();
  const { error } = useAlert();
  
  // State variables
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  
  // Load patient records on component mount
  useEffect(() => {
    const loadRecords = async () => {
      if (accounts && accounts[0] && role === 'patient') {
        try {
          const patientRecords = await getPatientRecords(accounts[0]);
          setRecords(patientRecords);
        } catch (err) {
          error(err.message || 'Failed to load records');
        } finally {
          setLoadingRecords(false);
        }
      } else {
        setLoadingRecords(false);
      }
    };
    
    if (!loading) {
      loadRecords();
    }
  }, [accounts, role, loading, getPatientRecords, error]);

  // If loading blockchain data
  if (loading) {
    return <Loading message="Connecting to blockchain..." />;
  }
  
  // If no wallet connected or wrong role
  if (!accounts || accounts.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Please connect your MetaMask wallet to continue.
        </Alert>
      </Container>
    );
  }
  
  if (role !== 'patient') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Only patients can access this page. If you are a patient, please ask your doctor to register you.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          My Medical Records
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {loadingRecords ? (
          <Loading message="Loading your records..." />
        ) : records.length === 0 ? (
          <Box py={2}>
            <Alert severity="info">
              You don't have any medical records yet.
            </Alert>
          </Box>
        ) : (
          <Box py={2}>
            {records.map((record, index) => (
              <RecordItem key={index} record={record} />
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PatientPage;