import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface PublicRouteProps {
  children: JSX.Element;
  redirectTo?: string;
}

const PublicRoute = ({ children, redirectTo = "/map" }: PublicRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return children;
};

export default PublicRoute; 