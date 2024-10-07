import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../FireBaseConfig/FireBase';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Importar Link para el botón de "Volver"
import Swal from 'sweetalert2';
import '../styles.css'; 


// Componente ViewTrainings
const ViewTrainings = () => {
  const { id: userId } = useParams(); // Obtener el ID del usuario desde los parámetros de la URL
  const [userTraining, setUserTraining] = useState([]); // Estado para almacenar las capacitaciones del usuario
  const [selectedTraining, setSelectedTraining] = useState(null); // Estado para almacenar la capacitación seleccionada para ver detalles
  const navigate = useNavigate(); // Hook para la navegación 

  useEffect(() => {
    // useEffect se ejecuta al montar el componente para obtener las capacitaciones del usuario
    const fetchUserTrainings = async () => {
      const trainingCollectionByUser = collection(db, 'training'); // Referencia a la colección 'training' en Firestore
      const trainingQuery = query(trainingCollectionByUser, where('userId', '==', userId)); // Crear una consulta para obtener capacitaciones del usuario con el ID específico
      const trainingSnapshot = await getDocs(trainingQuery); // Ejecutar la consulta y obtener los documentos
      const trainings = trainingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setUserTraining(trainings); // Actualizar el estado con las capacitaciones obtenidas
    };

    fetchUserTrainings(); // Llamar a la función para obtener capacitaciones
  }, [userId]);

  // Maneja la eliminación de una capacitación
  const handleDelete = async (trainingId) => {
    Swal.fire({
      title: '¿Desea eliminar la capacitación?',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const trainingDoc = doc(db, 'training', trainingId); // Referencia al documento de la capacitación en Firestore
        await deleteDoc(trainingDoc); // Eliminar el documento de la capacitación
        setUserTraining(userTraining.filter(training => training.id !== trainingId)); // Actualizar el estado eliminando la capacitación del array
        Swal.fire({
          icon: 'success',
          title: '¡Capacitación eliminada con éxito!',
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  };

  // Maneja la edición de una capacitación
  const handleEdit = (trainingId) => {
    navigate(`/edit-training/${trainingId}`); // Navegar a la ruta de edición de capacitación
  };

  // Maneja la visualización de detalles de una capacitación
  const handleViewDetails = (training) => {
    setSelectedTraining(training);
  };

  return (
    <div className="training-background-img">
      <div className="container mt-5">
        {selectedTraining ? (
          // Mostrar detalles de la capacitación seleccionada
          <div className="card mt-4">
            <div className="card-header">
              <h4>Detalles de la Capacitación</h4>
            </div>
            <div className="card-body">
              <p><strong>Título:</strong> {selectedTraining.title}</p>
              <p><strong>Fecha de Inicio:</strong> {selectedTraining.startDate}</p>
              <p><strong>Fecha de Fin:</strong> {selectedTraining.endDate}</p>
              <p><strong>Instructor:</strong> {selectedTraining.trainer ? selectedTraining.trainer : 'N/A'}</p>
              <p><strong>Ubicación:</strong> {selectedTraining.location}</p>
              <p><strong>Duración:</strong> {selectedTraining.duration}</p>
              <p><strong>Capacidad:</strong> {selectedTraining.capacity}</p>
              <p><strong>Descripción:</strong> {selectedTraining.description}</p>
              <button className="btn btn-danger mt-3" onClick={() => setSelectedTraining(null)}>Salir</button>
            </div>
          </div>
        ) : (
          <>
            {/* Agregar el título del listado de capacitaciones */}
            <h2 className="training-list-title">Listado de Capacitaciones</h2>
  
            {/* Tabla de capacitaciones del usuario */}
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Instructor</th>
                  <th>Fecha de Inicio</th>
                  <th>Fecha de Fin</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {userTraining.map(training => (
                  <tr key={training.id}>
                    <td>{training.title}</td>
                    <td>{training.trainer}</td>
                    <td>{training.startDate}</td>
                    <td>{training.endDate}</td>
                    <td>
                      <button className="btn btn-primary mx-1" onClick={() => handleEdit(training.id)}>
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button className="btn btn-danger mx-1" onClick={() => handleDelete(training.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                      <button className="btn btn-info mx-1" onClick={() => handleViewDetails(training)}>
                        <i className="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
  
            {/* Botón de enlace para volver a la vista de capacitación */}
            <Link className="btn btn-danger mt-3" to={`/training/${userId}`}>
              Volver
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewTrainings;
