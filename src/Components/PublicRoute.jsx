import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ user, children }) => {
  // Si el usuario está autenticado, redirige a la página principal
  if (user) {
    return <Navigate to="/" />;
  }

  // Si no está autenticado, muestra el componente hijo (ej., <Login />)
  return children;
};

export default PublicRoute;
