import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/AccessDenied.css";
import deniedImage from "../assets/DeniedImage.png"; // Asegúrate de tener una imagen SVG o PNG en tu carpeta de assets

const AccessDenied = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2000); // Retraso de 3 segundos

    return () => clearTimeout(timer); // Limpia el timer si el componente se desmonta
  }, []);

  if (!showContent) {
    return <div>Cargando...</div>; // Puedes mostrar un mensaje de carga o spinner
  }

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
