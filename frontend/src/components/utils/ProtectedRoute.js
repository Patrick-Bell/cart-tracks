import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { authenticated, checkAuthStatus, errors } = useAuth();

    useEffect(() => {
        checkAuthStatus();
    }, []);  // Ensure the dependency is correct for the effect

    // If the user is not authenticated, navigate to login with an error message
    if (!authenticated) {
        return <Navigate to="/" state={{ error: 'You must be logged in to access this page' }} />;
    }

    // If authenticated, render the children (protected content)
    return children;
};

export default ProtectedRoute;
