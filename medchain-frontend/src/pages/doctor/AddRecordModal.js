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
  CircularProgress
} from '@mui/material';
import { useWeb3 } from '../../contexts/Web3Context';
import { useAlert } from '../../contexts/AlertContext';

const AddRecordModal = ({ open, onClose, patientAddress, onRecordAdded }) => {
  const { addRecord } = useWeb3();
  const { error } = useAlert();
  
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!file || !patientAddress) return;
    
    setUploading(true);
    
    try {
      // Create a buffer from the file
      const buffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => resolve(new Uint8Array(reader.result));
        reader.onerror = reject;
      });
      
      // Upload to IPFS
      const ipfsResponse = await uploadToIPFS(buffer);
      const ipfsHash = ipfsResponse.path;
      
      // Add record to blockchain
      await addRecord(ipfsHash, file.name, patientAddress);
      
      // Call the callback
      if (onRecordAdded) {
        onRecordAdded();
      }
      
      // Close the modal
      onClose();
    } catch (err) {
      error(err.message || 'Error uploading record');
    } finally {
      setUploading(false);
    }
  };
  
  // Function to upload to IPFS
  const uploadToIPFS = async (buffer) => {
    // Import your IPFS service logic here
    // This is a placeholder, replace with your actual IPFS upload logic
    return { path: 'ipfshash123' };
  };
  
  return (
    <Dialog
      open={open}
      onClose={!uploading ? onClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Add Medical Record</DialogTitle>
      
      <DialogContent>
        {uploading ? (
          <Box display="flex" alignItems="center" justifyContent="center" py={3}>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography>Uploading to IPFS and blockchain...</Typography>
          </Box>
        ) : (
          <Box py={2}>
            <Typography variant="body1" gutterBottom>
              Upload a medical record for patient: {patientAddress}
            </Typography>
            
            <Box 
              border={1} 
              borderRadius={1} 
              borderColor="divider" 
              p={3} 
              mt={2} 
              textAlign="center"
            >
              <input
                type="file"
                id="record-file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label htmlFor="record-file">
                <Button
                  variant="contained"
                  component="span"
                >
                  Select File
                </Button>
              </label>
              
              {file && (
                <Box mt={2}>
                  <Typography variant="body2">
                    Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={uploading}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          Upload Record
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRecordModal;