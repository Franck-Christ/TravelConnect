import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const ProtectedAdminRoute: React.FC = () => {
  const { isAdmin } = useAdminAuth();
  
  // Check for adminToken in localStorage
  const adminToken = localStorage.getItem("adminToken");

  // If not an admin and no adminToken, redirect to admin login page
  if (!isAdmin && !adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  // If admin or has adminToken, render the child routes
  return <Outlet />;
};

export default ProtectedAdminRoute; 