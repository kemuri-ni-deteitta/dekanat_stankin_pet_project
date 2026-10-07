import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const user = useSelector((state: any) => state.auth.user);
    const location = useLocation();

    if (!user || !user.roles.includes('ADMIN')) {
        return <Navigate to="/" state={{ from: location }} />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
