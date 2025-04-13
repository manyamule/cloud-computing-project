// src/services/ipfsService.js
import axios from 'axios';

// Pinata API credentials
const apiKey = process.env.REACT_APP_PINATA_API_KEY;
const apiSecret = process.env.REACT_APP_PINATA_API_SECRET;

// Upload file to IPFS via Pinata
export const uploadFile = async (fileBuffer, fileName) => {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  
  try {
    // Create file object from buffer
    const file = new File([fileBuffer], fileName);
    const formData = new FormData();
    formData.append('file', file);
    
    // Add metadata
    const metadata = JSON.stringify({
      name: fileName,
      keyvalues: {
        type: 'medical_record'
      }
    });
    formData.append('pinataMetadata', metadata);
    
    // Make request to Pinata
    const response = await axios.post(url, formData, {
      maxContentLength: 'Infinity',
      headers: {
        'Content-Type': 'multipart/form-data',
        'pinata_api_key': apiKey,
        'pinata_secret_api_key': apiSecret
      }
    });
    
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

// Get gateway URL for an IPFS hash
export const getIpfsUrl = (hash) => {
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};

// For backward compatibility with existing code
export default {
  add: async (buffer, fileName = 'file') => {
    const hash = await uploadFile(buffer, fileName);
    return [{ hash }];
  }
};