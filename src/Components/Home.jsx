import React from 'react';
import Swal from 'sweetalert2';
import epp from '../assets/epp.png'
import acc from '../assets/investigacioACC1.webp'
import miper from '../assets/miper1.png'
import docu from '../assets/login.jpg'


const Home = () => {

  const handleMoreInfoClick = () => {
    Swal.fire({
      icon: 'info',
      title: 'Próximamente disponible',
      text: 'Este servicio estará disponible pronto en nuestro sitio web.',
      confirmButtonText: 'Cerrar'
    });
  };

  return (
    <div className="container home-container">
      <header className="jumbotron my-4 home-header text-shadow text-white">
        <h1 className="display-3 home-title text-black">BIENVENIDO A SAFE-TRACK</h1>
        <h2 className="lead mt-4 mb-4 home-subtitle text-black">Aquí encontrarás información relevante sobre nuestro Software para la Gestión de Seguridad Laboral</h2>
      </header>

      <div className="row text-center mt-5">
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card home-card h-100">
            <img className="card-img-top home-card-img" src={epp} alt="Gestión de los EPP"/>
            <div className="card-body">
              <h4 className="card-title text-white mt-2">Gestión de los EPP</h4>
              <p className="card-text text-black mt-4">La gestión de EPP garantiza la provisión y uso adecuado de equipos de protección, como cascos y guantes, para proteger a los trabajadores de riesgos específicos y evitar incidentes.</p>
            </div>
            <div className="card-footer">
              <button onClick={handleMoreInfoClick} className="btn btn-info text-white">
                Más Información
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4 text-white">
          <div className="card home-card h-100">
            <img className="card-img-top home-card-img" src={docu} alt="Gestión Documental"/>
            <div className="card-body">
              <h4 className="card-title text-white">Gestión Documental</h4>
              <p className="card-text text-black">La gestión documental administra la creación, almacenamiento y disposición de documentos, asegurando que la información sea precisa y accesible, cumpliendo así con los requisitos legales y normativos.</p>
            </div>
            <div className="card-footer">
              <button onClick={handleMoreInfoClick} className="btn btn-info text-white">
                Más Información
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card home-card h-100">
            <img className="card-img-top home-card-img" src={acc} alt="Investigación de Accidentes"/>
            <div className="card-body">
              <h4 className="card-title text-white">Investigación de Accidentes</h4>
              <p className="card-text text-black">La investigación de accidentes identifica las causas de incidentes laborales para prevenir futuras ocurrencias. Involucra la recopilación de datos, análisis y recomendaciones detalladas.</p>
            </div>
            <div className="card-footer">
              <button onClick={handleMoreInfoClick} className="btn btn-info text-white">
                Más Información
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card home-card h-100">
            <img className="card-img-top home-card-img" src={miper} alt="Matriz IPER"/>
            <div className="card-body">
              <h4 className="card-title text-white">Matriz de Riesgos MIPER</h4>
              <p className="card-text text-black">La MIPER identifica y evalúa riesgos laborales, priorizándolos para desarrollar estrategias de control y mitigación, mejorando significativamente la seguridad ocupacional en la empresa.</p>
            </div>
            <div className="card-footer">
              <button onClick={handleMoreInfoClick} className="btn btn-info text-white">
                Más Información
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;