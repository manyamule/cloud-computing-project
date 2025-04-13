// src/pages/doctor/index.js
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Divider,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useWeb3 } from '../../contexts/Web3Context';
import { useAlert } from '../../contexts/AlertContext';
import RecordItem from '../../components/records/RecordItem';
import Loading from '../../components/common/Loading';
import AddRecordModal from './AddRecordModal';

const DoctorPage = () => {
  const { accounts, role, loading, patientExists, getPatientRecords, registerPatient } = useWeb3();
  const { success, error } = useAlert();
  
  // State variables
  const [searchAddress, setSearchAddress] = useState('');
  const [registerAddress, setRegisterAddress] = useState('');
  const [currentPatient, setCurrentPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);
  
  // Validate Ethereum address
  const isValidAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };
  
  // Handle patient search
  const handleSearchPatient = async () => {
    if (!isValidAddress(searchAddress)) {
      error('Please enter a valid Ethereum address');
      return;
    }
    
    setLoadingRecords(true);
    
    try {
      const exists = await patientExists(searchAddress);
      
      if (exists) {
        const patientRecords = await getPatientRecords(searchAddress);
        setCurrentPatient(searchAddress);
        setRecords(patientRecords);
        success('Patient found');
      } else {
        setCurrentPatient(null);
        setRecords([]);
        error('Patient not found');
      }
    } catch (err) {
      error(err.message || 'Error searching for patient');
    } finally {
      setLoadingRecords(false);
    }
  };
  
  // Handle patient registration
  const handleRegisterPatient = async () => {
    if (!isValidAddress(registerAddress)) {
      error('Please enter a valid Ethereum address');
      return;
    }
    
    try {
      await registerPatient(registerAddress);
      success('Patient registered successfully');
      setRegisterAddress('');
    } catch (err) {
      error(err.message || 'Error registering patient');
    }
  };
  
  // After a record is added, refresh the records list
  const handleRecordAdded = async () => {
    if (currentPatient) {
      setLoadingRecords(true);
      try {
        const patientRecords = await getPatientRecords(currentPatient);
        setRecords(patientRecords);
      } catch (err) {
        error('Failed to refresh records');
      } finally {
        setLoadingRecords(false);
      }
    }
  };

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
  
  if (role !== 'doctor') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Only doctors can access this page. Please register as a doctor first.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Patient Search Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Patient Records
        </Typography>
        
        <Box display="flex" gap={2} mb={2}>
          <TextField
            fullWidth
            label="Patient Address"
            variant="outlined"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="0x..."
          />
          
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearchPatient}
            disabled={!isValidAddress(searchAddress)}
          >
            Search
          </Button>
        </Box>
        
        {/* Add Record Button - only shown when a patient is found */}
        {currentPatient && (
          <Button
            variant="outlined"
            startIcon={<NoteAddIcon />}
            onClick={() => setShowAddRecord(true)}
          >
            Add New Record
          </Button>
        )}
      </Paper>
      
      {/* Records List */}
      {loadingRecords ? (
        <Loading message="Loading patient records..." />
      ) : currentPatient ? (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Records for {currentPatient.substr(0, 6)}...{currentPatient.substr(-4)}
          </Typography>
          
          {records.length === 0 ? (
            <Alert severity="info">No records found for this patient</Alert>
          ) : (
            records.map((record, index) => (
              <RecordItem key={index} record={record} />
            ))
          )}
        </Box>
      ) : null}
      
      <Divider sx={{ my: 4 }} />
      
      {/* Patient Registration Section */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Register New Patient
        </Typography>
        
        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            label="Patient Address"
            variant="outlined"
            value={registerAddress}
            onChange={(e) => setRegisterAddress(e.target.value)}
            placeholder="0x..."
          />
          
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PersonAddIcon />}
            onClick={handleRegisterPatient}
            disabled={!isValidAddress(registerAddress)}
          >
            Register
          </Button>
        </Box>
      </Paper>
      
      {/* Add Record Modal */}
      <AddRecordModal
        open={showAddRecord}
        onClose={() => setShowAddRecord(false)}
        patientAddress={currentPatient}
        onRecordAdded={handleRecordAdded}
      />
    </Container>
  );
};

export default DoctorPage;