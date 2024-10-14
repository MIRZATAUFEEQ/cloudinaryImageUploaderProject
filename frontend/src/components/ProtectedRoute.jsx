import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Check if the token is stored
    return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
