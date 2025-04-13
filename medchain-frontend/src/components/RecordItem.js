// src/components/RecordItem.js
import React from 'react';
import { Card, CardContent, Grid, Box, Typography, IconButton } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const RecordItem = ({ record }) => {
  // Handle both array and object formats for the record
  let cid, fileName, patientId, doctorId, timestamp;
  
  if (Array.isArray(record)) {
    [cid, fileName, patientId, doctorId, timestamp] = record;
  } else if (record && typeof record === 'object') {
    cid = record.cid || '';
    fileName = record.fileName || '';
    patientId = record.patientId || '';
    doctorId = record.doctorId || '';
    timestamp = record.timeAdded || 0;
  } else {
    console.error('Invalid record format:', record);
    return null;
  }
  
  // Format timestamp
  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString();
  };
  
  // Generate IPFS URL
  const getIpfsUrl = (cid) => {
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  };
  
  // Truncate address
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  };
  
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={1}>
            <DescriptionIcon fontSize="large" color="action" />
          </Grid>
          
          <Grid item xs={4}>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Record name
              </Typography>
              <Typography variant="body1">
                {fileName}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={4}>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Doctor
              </Typography>
              <Typography variant="body2">
                {truncateAddress(doctorId)}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={2}>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Created
              </Typography>
              <Typography variant="body2">
                {formatDate(timestamp)}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={1}>
            <IconButton 
              component="a"
              href={getIpfsUrl(cid)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CloudDownloadIcon />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RecordItem;