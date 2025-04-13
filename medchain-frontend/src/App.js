// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Web3Provider } from './contexts/Web3Context';
import { AlertProvider } from './contexts/AlertContext';
import AlertSnackbar from './components/common/AlertSnackbar';
import Header from './components/layouts/Header';
import theme from './theme';

// Import existing pages
import HomePage from './pages/home';
import DoctorPage from './pages/doctor';
import PatientPage from './pages/patient';

// Import new auth pages
import LoginPage from './pages/auth/Login';
import SignUpPage from './pages/auth/SignUp';

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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </BrowserRouter>
        </AlertProvider>
      </Web3Provider>
    </ThemeProvider>
  );
}

export default App;