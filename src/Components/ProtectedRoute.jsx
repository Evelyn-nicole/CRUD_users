import React from "react";
import { Navigate } from "react-router-dom";
import AccessDenied from "./AccessDenied"; // Importa la página de acceso denegado

const ProtectedRoute = ({ user, getUser, allowedRoles, children }) => {
  // Si no hay un usuario autenticado, redirige al login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si el usuario está autenticado pero los datos de `getUser` aún no están listos, muestra un mensaje de carga
  if (!getUser) {
    return <div>Loading...</div>;
  }

  // Si el usuario está autenticado pero no tiene el rol correcto, muestra "Acceso Denegado"
  if (allowedRoles && !allowedRoles.includes(getUser?.role)) {
    return <AccessDenied />;
  }

  // Si todo es válido, renderiza el contenido de la ruta
  return children;
};

export default ProtectedRoute;
