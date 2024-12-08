import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/NotFound.css"; 
import errorImage from "../assets/errorImage.png"; // Asegúrate de tener una imagen SVG o PNG en tu carpeta de assets

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <img src={errorImage} alt="404 Error" />
      <h1>404 - Página No Encontrada</h1>
      <p>La página que estás buscando no existe o ha sido movida.</p>
      <button onClick={() => navigate("/")}>Volver al Inicio</button>
    </div>
  );
};

export default NotFound;
