import React from 'react';
import { Card, CardContent, Grid, Box, Typography, IconButton } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import moment from 'moment';
import { getIpfsUrl } from '../../services/ipfsService';

const RecordItem = ({ record }) => {
  // Handle both array and object formats for record data
  let cid, fileName, patientId, doctorId, timestamp;
  
  if (Array.isArray(record)) {
    // If record is an array, destructure it
    [cid, fileName, patientId, doctorId, timestamp] = record;
  } else if (record && typeof record === 'object') {
    // If record is an object, extract properties
    cid = record.cid || '';
    fileName = record.fileName || '';
    patientId = record.patientId || '';
    doctorId = record.doctorId || '';
    timestamp = record.timeAdded || 0;
  } else {
    // Handle invalid record format
    console.error('Invalid record format:', record);
    return (
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography color="error">Invalid record format</Typography>
        </CardContent>
      </Card>
    );
  }
  
  // Format timestamp
  const formattedDate = moment.unix(Number(timestamp)).format('MMM DD, YYYY HH:mm');
  
  // Generate IPFS URL
  const ipfsUrl = getIpfsUrl(cid);
  
  // Function to truncate address for display
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.substr(0, 6)}...${address.substr(-4)}`;
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          {/* Icon */}
          <Grid item xs={1}>
            <DescriptionIcon fontSize="large" color="action" />
          </Grid>
          
          {/* File Name */}
          <Grid item xs={3}>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Record Name
              </Typography>
              <Typography variant="body1" noWrap>
                {fileName}
              </Typography>
            </Box>
          </Grid>
          
          {/* Doctor ID */}
          <Grid item xs={4}>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Doctor
              </Typography>
              <Typography variant="body2" noWrap>
                {truncateAddress(doctorId)}
              </Typography>
            </Box>
          </Grid>
          
          {/* Timestamp */}
          <Grid item xs={3}>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Created
              </Typography>
              <Typography variant="body2">
                {formattedDate}
              </Typography>
            </Box>
          </Grid>
          
          {/* Download Button */}
          <Grid item xs={1}>
            <IconButton
              component="a"
              href={ipfsUrl}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              aria-label="download record"
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