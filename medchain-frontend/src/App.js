// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Web3Provider } from './contexts/Web3Context';
import { AlertProvider } from './contexts/AlertContext';
import AlertSnackbar from './components/common/AlertSnackbar';
import Header from './components/layouts/Header';
import HomePage from './pages/home';
import DoctorPage from './pages/doctor';
import PatientPage from './pages/patient';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#2e7d32',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Web3Provider>
        <AlertProvider>
          <BrowserRouter>
            <Header />
            <AlertSnackbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/doctor" element={<DoctorPage />} />
              <Route path="/patient" element={<PatientPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </BrowserRouter>
        </AlertProvider>
      </Web3Provider>
    </ThemeProvider>
  );
}

export default App;