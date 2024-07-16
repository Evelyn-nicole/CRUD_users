import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../FireBaseConfig/FireBase';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles.css'; // Importar el archivo CSS

const ViewTrainings = () => {
  const { id } = useParams();
  const [userTraining, setUserTraining] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserTrainings = async () => {
      const trainingCollectionByUser = collection(db, 'training');
      const trainingQuery = query(trainingCollectionByUser, where('userId', '==', id));
      const trainingSnapshot = await getDocs(trainingQuery);
      const trainings = trainingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setUserTraining(trainings);
    };

    fetchUserTrainings();
  }, [id]);

  const handleDelete = async (trainingId) => {
    Swal.fire({
      title: '¿Desea eliminar la capacitación?',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const trainingDoc = doc(db, 'training', trainingId);
        await deleteDoc(trainingDoc);
        setUserTraining(userTraining.filter(training => training.id !== trainingId));
        Swal.fire({
          icon: 'success',
          title: '¡Capacitación eliminada con éxito!',
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  };

  const handleEdit = (trainingId) => {
    navigate(`/edit-training/${trainingId}`);
  };

  const handleViewDetails = (training) => {
    setSelectedTraining(training);
  };

  return (
    <div className="training-background-img">
      <div className="container mt-5">
        {selectedTraining ? (
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
        )}
      </div>
    </div>
  );
};

export default ViewTrainings;
