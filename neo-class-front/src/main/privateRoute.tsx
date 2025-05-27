import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactElement;
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  // Busca o role salvo no localStorage (string simples)
  const userRole = localStorage.getItem("role") || "";

  if (!allowedRoles.includes(userRole)) {
    // Se não tiver permissão, redireciona para login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
