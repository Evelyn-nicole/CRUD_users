import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/AccessDenied.css";
import deniedImage from "../assets/DeniedImage.png"; // Asegúrate de tener una imagen SVG o PNG en tu carpeta de assets

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="access-denied-container">
      <img src={deniedImage} alt="Acceso Denegado" />
      <h1>Acceso Denegado</h1>
      <p>No tienes permiso para acceder a esta página.</p>
      <button onClick={() => navigate("/")}>Volver al inicio</button>
    </div>
  );
};

export default AccessDenied;
