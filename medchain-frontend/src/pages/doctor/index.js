// src/pages/doctor/index.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import { useWeb3 } from '../../contexts/Web3Context';
import { useAlert } from '../../contexts/AlertContext';
import AddRecordModal from './AddRecordModal';
import RecordItem from '../../components/RecordItem';

const DoctorPage = () => {
  const { accounts, contract, getDoctorPatients, patientExists, getPatientRecords, registerPatient } = useWeb3();
  const { success, error } = useAlert();
  
  // State
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchAddress, setSearchAddress] = useState('');
  const [registerAddress, setRegisterAddress] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [openAddRecord, setOpenAddRecord] = useState(false);
  
  // Load doctor's patients
  useEffect(() => {
    const loadPatients = async () => {
      try {
        if (accounts && accounts[0] && contract) {
          const patientAddresses = await getDoctorPatients();
          setPatients(patientAddresses);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPatients();
  }, [accounts, contract, getDoctorPatients]);
  
  // Handle patient search
  const handleSearch = async () => {
    try {
      if (!searchAddress) {
        error('Please enter a patient address');
        return;
      }
      
      setLoading(true);
      const exists = await patientExists(searchAddress);
      
      if (exists) {
        const patientRecords = await getPatientRecords(searchAddress);
        setSelectedPatient(searchAddress);
        setRecords(patientRecords);
        success('Patient found');
      } else {
        error('Patient not found');
      }
    } catch (err) {
      error(err.message || 'Error searching for patient');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle patient registration
  const handleRegister = async () => {
    try {
      if (!registerAddress) {
        error('Please enter a patient address');
        return;
      }
      
      await registerPatient(registerAddress);
      success('Patient registered successfully');
      setRegisterAddress('');
      
      // Refresh patient list
      const patientAddresses = await getDoctorPatients();
      setPatients(patientAddresses);
    } catch (err) {
      error(err.message || 'Error registering patient');
    }
  };
  
  // Handle record added
  const handleRecordAdded = async () => {
    try {
      if (selectedPatient) {
        const patientRecords = await getPatientRecords(selectedPatient);
        setRecords(patientRecords);
        success('Record added successfully');
      }
    } catch (err) {
      error(err.message || 'Error refreshing records');
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Doctor Dashboard
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Patient Records
            </Typography>
            
            <Box sx={{ display: 'flex', mb: 2 }}>
              <TextField
                fullWidth
                label="Patient Address"
                variant="outlined"
                size="small"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
              />
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ ml: 2 }}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Box>
            
            {selectedPatient && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpenAddRecord(true)}
                sx={{ mb: 2 }}
              >
                Add New Record
              </Button>
            )}
            
            {selectedPatient && records.length > 0 ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Patient: {selectedPatient.substring(0, 6)}...{selectedPatient.substring(38)}
                </Typography>
                
                {records.map((record, index) => (
                  <RecordItem key={index} record={record} />
                ))}
              </Box>
            ) : selectedPatient ? (
              <Typography variant="body1">No records found for this patient</Typography>
            ) : null}
          </Paper>
          
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Register New Patient
            </Typography>
            
            <Box sx={{ display: 'flex', mb: 2 }}>
              <TextField
                fullWidth
                label="Patient Address"
                variant="outlined"
                size="small"
                value={registerAddress}
                onChange={(e) => setRegisterAddress(e.target.value)}
              />
              <Button 
                variant="contained" 
                color="secondary" 
                sx={{ ml: 2 }}
                onClick={handleRegister}
              >
                Register
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              My Patients
            </Typography>
            
            {patients.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient Address</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patients.map((patient, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {patient.substring(0, 6)}...{patient.substring(38)}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => {
                              setSearchAddress(patient);
                              setSelectedPatient(patient);
                              getPatientRecords(patient).then(setRecords);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1">No patients found</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      <AddRecordModal
        open={openAddRecord}
        onClose={() => setOpenAddRecord(false)}
        patientAddress={selectedPatient}
        onRecordAdded={handleRecordAdded}
      />
    </Container>
  );
};

export default DoctorPage;