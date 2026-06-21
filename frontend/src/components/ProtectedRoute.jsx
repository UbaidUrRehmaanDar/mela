import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageLoader from './ui/PageLoader';

/**
 * requiredRole — string or array of strings.
 * User must have one of the listed roles to access the route.
 */
export default function ProtectedRoute({ children, requiredRole = null }) {
  const { loading, user, profile } = useAuth();

  if (loading) {
    return <PageLoader message="Verifying access" fullPage />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !profile) {
    return <PageLoader message="Verifying access" fullPage />;
  }

  if (requiredRole) {
    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowed.includes(profile?.role)) {
      return <Navigate to="/events" replace />;
    }
  }

  return children;
}
