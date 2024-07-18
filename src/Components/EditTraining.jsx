import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../FireBaseConfig/FireBase";
import Swal from "sweetalert2";
import '../styles.css'; 


const EditTraining = () => {
  const { trainingId } = useParams();
  const [training, setTraining] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    duration: "",
    trainer: "",
    location: "",
    capacity: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTraining = async () => {
      const trainingDoc = doc(db, "training", trainingId);
      const trainingSnapshot = await getDoc(trainingDoc);
      if (trainingSnapshot.exists()) {
        setTraining(trainingSnapshot.data());
      }
    };

    fetchTraining();
  }, [trainingId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTraining((prevTraining) => ({
      ...prevTraining,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trainingDoc = doc(db, "training", trainingId);
    await updateDoc(trainingDoc, training);
    Swal.fire({
      icon: "success",
      title: "¡Capacitación editada con éxito!",
      showConfirmButton: false,
      timer: 2000,
    });
    navigate(`/view-trainings/${training.userId}`);
  };

  return (
    <div className="training-background-img">
      <div className="container mt-5">
        <div className="card editTraining mx-auto">
          <div className="card-header">
            <h3>Editar Capacitación</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Título
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={training.title}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Descripción
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={training.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="startDate" className="form-label">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  name="startDate"
                  value={training.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="endDate" className="form-label">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  name="endDate"
                  value={training.endDate}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="duration" className="form-label">
                  Duración
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="duration"
                  name="duration"
                  value={training.duration}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="trainer" className="form-label">
                  Instructor
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="trainer"
                  name="trainer"
                  value={training.trainer}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="location" className="form-label">
                  Ubicación
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  name="location"
                  value={training.location}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="capacity" className="form-label">
                  Capacidad
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="capacity"
                  name="capacity"
                  value={training.capacity}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Guardar Cambios
              </button>
              <Link className="btn btn-danger ms-2" to={`/view-trainings/${training.userId}`}>
              Volver
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTraining;
