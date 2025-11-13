import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) {
    console.log('User:', user);
    console.log('Allowed roles:', allowedRoles);
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
