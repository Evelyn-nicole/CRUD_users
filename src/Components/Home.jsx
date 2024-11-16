import React from 'react';
import '../Styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="overlay">
          <h1 className="hero-title">SAFETRACK</h1>
          <h1 className="hero-title">Seguridad Ocupacional, Salud y Calidad</h1>
          <p className="hero-subtitle">Construyendo espacios de trabajo seguros y eficientes para todos.</p>
          <button
            className="hero-button"
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
          >
            Descubre Más
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="features-section">
        <h2 className="section-title">¿Qué Ofrecemos?</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>Capacitaciones</h3>
            <p>Crea y gestiona capacitaciones personalizadas para la seguridad laboral.</p>
          </div>
          <div className="feature">
            <h3>Formularios de Accidentes</h3>
            <p>Optimiza la gestión de incidentes para prevenir futuros riesgos.</p>
          </div>
          <div className="feature">
            <h3>MIPER</h3>
            <p>Evalúa y gestiona riesgos laborales de manera eficaz.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
