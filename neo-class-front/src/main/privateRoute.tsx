// src/routes/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface Props {
  children: React.ReactElement;
  allowedRoles: string[];
}

const PrivateRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // 1) Sem token = não está autenticado
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2) Verificação OPCIONAL de expiração do JWT
  try {
    const { exp }: any = jwtDecode(token);
    const now = Date.now().valueOf() / 1000;
    if (exp && exp < now) {
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }
  } catch {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // 3) Sem role ou role não permitido
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  // 4) Tudo ok?
  return children;
};

export default PrivateRoute;
