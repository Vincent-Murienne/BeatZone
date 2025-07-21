import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface PublicRouteProps {
  children: JSX.Element;
  redirectTo?: string;
}

const PublicRoute = ({ children, redirectTo = "/" }: PublicRouteProps) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return children;
};

export default PublicRoute; 