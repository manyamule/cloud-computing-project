// src/contexts/Web3Context.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import EHRContract from '../contracts/EHR.json';

// Create context
const Web3Context = createContext();

// Provider component
export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [role, setRole] = useState('unknown');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Web3
  const initWeb3 = useCallback(async () => {
    try {
      // Check if window.ethereum is available
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        
        // Request accounts
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccounts(accounts);
        
        // Get network ID
        const netId = await web3Instance.eth.net.getId();
        setNetworkId(netId);
        
        // Get contract instance
        const deployedNetwork = EHRContract.networks[netId];
        if (!deployedNetwork) {
          throw new Error('Contract not deployed on this network');
        }
        
        const contractInstance = new web3Instance.eth.Contract(
          EHRContract.abi,
          deployedNetwork.address
        );
        setContract(contractInstance);
        
        // Get user role if account is available
        if (accounts && accounts.length > 0) {
          try {
            const userRole = await contractInstance.methods.getSenderRole().call({ from: accounts[0] });
            setRole(userRole);
          } catch (roleErr) {
            console.warn('Could not get role:', roleErr);
          }
        }
        
        setLoading(false);
      } else {
        throw new Error('MetaMask not installed. Please install MetaMask to use this application.');
      }
    } catch (error) {
      console.error('Error initializing Web3:', error);
      setError(error.message);
      setLoading(false);
    }
  }, []);

  // Register MetaMask event listeners
  useEffect(() => {
    if (web3 && window.ethereum) {
      // Account changed event handler
      const handleAccountsChanged = (accounts) => {
        setAccounts(accounts);
        window.location.reload();
      };
      
      // Chain changed event handler
      const handleChainChanged = () => {
        window.location.reload();
      };
      
      // Register event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      // Cleanup event listeners
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [web3]);

  // Initialize Web3 on component mount
  useEffect(() => {
    initWeb3();
  }, [initWeb3]);

  // Register a doctor
  const registerDoctor = async () => {
    if (!contract || !accounts || accounts.length === 0) {
      throw new Error('No connection to blockchain');
    }
    
    try {
      await contract.methods.addDoctor().send({ from: accounts[0] });
      setRole('doctor');
      return true;
    } catch (error) {
      console.error('Error registering doctor:', error);
      throw error;
    }
  };
  
  // Register a patient
  const registerPatient = async (patientAddress) => {
    if (!contract || !accounts || accounts.length === 0 || role !== 'doctor') {
      throw new Error('Only doctors can register patients');
    }
    
    try {
      await contract.methods.addPatient(patientAddress).send({ from: accounts[0] });
      return true;
    } catch (error) {
      console.error('Error registering patient:', error);
      throw error;
    }
  };
  
  // Add a medical record
  const addRecord = async (cid, fileName, patientAddress) => {
    if (!contract || !accounts || accounts.length === 0 || role !== 'doctor') {
      throw new Error('Only doctors can add records');
    }
    
    try {
      await contract.methods.addRecord(cid, fileName, patientAddress).send({ from: accounts[0] });
      return true;
    } catch (error) {
      console.error('Error adding record:', error);
      throw error;
    }
  };
  
  // Get patient records
  const getPatientRecords = async (patientAddress) => {
    if (!contract || !accounts || accounts.length === 0) {
      throw new Error('No connection to blockchain');
    }
    
    try {
      return await contract.methods.getRecords(patientAddress).call({ from: accounts[0] });
    } catch (error) {
      console.error('Error getting records:', error);
      throw error;
    }
  };
  
  // Check if patient exists
  const patientExists = async (patientAddress) => {
    if (!contract || !accounts || accounts.length === 0 || role !== 'doctor') {
      throw new Error('Only doctors can check patient existence');
    }
    
    try {
      return await contract.methods.getPatientExists(patientAddress).call({ from: accounts[0] });
    } catch (error) {
      console.error('Error checking patient existence:', error);
      throw error;
    }
  };

  return (
    <Web3Context.Provider
      value={{
        web3,
        accounts,
        contract,
        networkId,
        role,
        loading,
        error,
        registerDoctor,
        registerPatient,
        addRecord,
        getPatientRecords,
        patientExists
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to use the Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};