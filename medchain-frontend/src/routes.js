// src/routes.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import HomePage from './pages/home';
import DoctorPage from './pages/doctor';
import PatientPage from './pages/patient';
import { useWeb3 } from './contexts/Web3Context';

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { accounts, role, loading } = useWeb3();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!accounts || accounts.length === 0 || role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Define routes
const routes = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/doctor',
    element: (
      <ProtectedRoute requiredRole="doctor">
        <DoctorPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/patient',
    element: (
      <ProtectedRoute requiredRole="patient">
        <PatientPage />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
];

export default routes;