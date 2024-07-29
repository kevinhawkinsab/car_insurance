
import { Navigate } from 'react-router-dom';
import isAuthenticated from './Authenticated';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children  }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/auth/login" />;
    }

    return children;
};

export default ProtectedRoute;
