import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem('docuwise_token');
  const role = localStorage.getItem('docuwise_role');

  if (!token || role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}
