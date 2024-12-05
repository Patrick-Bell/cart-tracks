import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import ProtectedRoute from './ProtectedRoute';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const AppContent = () => {
    const { checkAuthStatus, authenticated } = useAuth();

   

    const location = useLocation();

    const getRouteInfo = (path) => {
        switch (path) {
            case '/':
                return { title: 'Bandstand Merchandise Services - Login', description: 'Login Page' };
            case '/dashboard':
                return { title: 'Bandstand Merchandise Services - Dashboard', description: 'Dashboard Page' };
            default:
                return { title: 'Bandstand | Page Not Found', description: 'This page does not exist' };
        }
    };

    const { title, description } = getRouteInfo(location.pathname);

    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name='description' content={description} />
                <link rel="icon" href={Logo} />
            </Helmet>

            <Routes>
                <Route path="/" element={<Login />} />
                
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
};

export default AppContent;
