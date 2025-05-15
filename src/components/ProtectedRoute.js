import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

 
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

 
  if (allowedRoles.length === 0) {
    return children;
  }


  if (!allowedRoles.includes(user.role)) {
  
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute; 