// src/pages/doctor/AddRecordModal.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useWeb3 } from '../../contexts/Web3Context';
import { useAlert } from '../../contexts/AlertContext';
import { uploadFile } from '../../services/ipfsService';

const AddRecordModal = ({ open, onClose, patientAddress, onRecordAdded }) => {
  const { accounts, addRecord } = useWeb3();
  const { success, error } = useAlert();
  
  // State variables
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  // Handle file upload and record creation
  const handleUpload = async () => {
    if (!file || !patientAddress) return;
    
    setUploading(true);
    
    try {
      // Convert file to array buffer
      const buffer = await file.arrayBuffer();
      
      // Upload to IPFS
      const ipfsHash = await uploadFile(buffer, file.name);
      
      // Add record to blockchain
      await addRecord(ipfsHash, file.name, patientAddress);
      
      success('Record added successfully');
      
      // Notify parent component
      if (onRecordAdded) {
        onRecordAdded();
      }
      
      // Close modal and reset state
      setFile(null);
      onClose();
    } catch (err) {
      error(err.message || 'Failed to upload record');
    } finally {
      setUploading(false);
    }
  };
  
  // Handle modal close
  const handleClose = () => {
    if (!uploading) {
      setFile(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Add Medical Record
      </DialogTitle>
      
      <DialogContent>
        {uploading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>
              Uploading to IPFS and blockchain...
            </Typography>
          </Box>
        ) : (
          <Box py={2}>
            <Typography variant="body1" gutterBottom>
              Upload a medical record for patient: {patientAddress}
            </Typography>
            
            <Box
              border={1}
              borderColor="divider"
              borderRadius={1}
              p={3}
              mt={2}
              textAlign="center"
            >
              <input
                type="file"
                id="record-file"
                accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx,.txt"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              
              <label htmlFor="record-file">
                <Button
                  component="span"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Select File
                </Button>
              </label>
              
              {file && (
                <Box mt={2}>
                  <Alert severity="success">
                    Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </Alert>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          disabled={!file || uploading}
        >
          Upload Record
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRecordModal;