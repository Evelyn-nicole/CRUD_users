import React, { useState } from "react";
import { doc, addDoc, getFirestore } from "firebase/firestore";
import { app } from "../FireBaseConfig/FireBase"; // Configuración de Firebase
import { useNavigate, useParams, Link, } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2"; // SweetAlert para alertas
import { collection } from "firebase/firestore";
import '../styles.css'; // Importar el archivo CSS

// hook useState para gestionar el estado de varios campos del formulario 
const CreateTraining = () => {
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState("");
  const [trainer, setTrainer] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");

  // useNavigate de React Router para la navegación.
  const navigate = useNavigate();  
  const fireStore = getFirestore(app); // inicializa Firestore con la configuración de Firebase 
  const { id } = useParams(); // Obtiene el parámetro de la URL

  // Maneja el envío del formulario.
  // Previene el comportamiento por defecto del formulario con e.preventDefault()
  const createTraining = async (e) => {
    e.preventDefault();
  
    const trainingData = {
      userId: id,
      description,
      title,
      startDate,
      endDate,
      duration,
      trainer,
      location,
      capacity,
      updated_at: new Date().toISOString(),
    };
    
    // addDoc: para agregar este objeto como un nuevo documento a la colección "training" en Firestore.
    try {
      await addDoc(collection(fireStore, "training"), trainingData);  
      Swal.fire({
        icon: "success",
        title: "Capacitación creada exitosamente",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate(`/training/${id}`);
    } catch (error) {
      console.error("Error creating training:", error);
      Swal.fire({
        icon: "error",
        title: "Error al crear la capacitación",
        text: error.message,
      });
    } finally {  // limpia todos los estados de los campos del formulario después de la creación exitosa.
      setUserId('');
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setDuration('');
      setTrainer('');
      setLocation('');
      setCapacity('');
    }
  };

  // Renderizado del componente 
  return (
    <div className="training-background-img">
      <div className="container mt-5">
        <div className="card create-training">
          <div className="card-header">
            <h3>Crear Capacitación</h3>
          </div>
          <div className="card-body">
            <form onSubmit={createTraining}>
              <div className="mb-3">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha de Inicio</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha de Fin</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Duración</label>
                <input
                  type="text"
                  className="form-control"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Instructor</label>
                <input
                  type="text"
                  className="form-control"
                  value={trainer}
                  onChange={(e) => setTrainer(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Ubicación</label>
                <input
                  type="text"
                  className="form-control"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Capacidad</label>
                <input
                  type="number"
                  className="form-control"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Crear Capacitación
              </button>
              <Link className="btn btn-danger ms-2" to={`/training/${id}`}>
              Volver
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTraining;

// El componente CreateTraining permite crear nuevas capacitaciones utilizando un formulario en React. Utiliza Firebase para almacenar los datos en Firestore, 
// maneja errores de creación y muestra alertas de éxito o error utilizando SweetAlert2. Al finalizar la creación, limpia los campos del formulario y redirige 
// al usuario a la página /training/xy9LaCjo3dXnECTughse6aB1Ljw2.
