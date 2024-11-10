import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../FireBaseConfig/FireBase';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../Styles/ViewTrainings.css';

const ViewTrainings = () => {
  const { id: userId } = useParams();
  const [userTraining, setUserTraining] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userDoc = await getDoc(doc(db, `users/${userId}`));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [userId]);

  useEffect(() => {
    const fetchUserTrainings = async () => {
      const trainingCollectionByUser = collection(db, 'training');
      const trainingQuery = query(trainingCollectionByUser, where('userId', '==', userId));
      const trainingSnapshot = await getDocs(trainingQuery);
      const trainings = trainingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setUserTraining(trainings);
    };

    fetchUserTrainings();
  }, [userId]);

  const handleEdit = (trainingId) => {
    navigate(`/edit-training/${trainingId}`);
  };

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

  const handleViewDetails = async (training) => {
    setSelectedTraining(training);
    try {
      if (Array.isArray(training.enrolledUsers) && training.enrolledUsers.length > 0) {
        const enrolledUsersList = [];

        for (const enrolledUserId of training.enrolledUsers) {
          try {
            const userDoc = await getDoc(doc(db, "users", enrolledUserId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              enrolledUsersList.push({
                id: userDoc.id,
                ...userData,
              });
            }
          } catch (err) {
            console.error(`Error al obtener datos del usuario con ID ${enrolledUserId}:`, err);
          }
        }
        setEnrolledUsers(enrolledUsersList);
      } else {
        setEnrolledUsers([]);
      }
    } catch (error) {
      console.error("Error fetching enrolled users:", error);
    }
  };

  const availableSpots = selectedTraining ? selectedTraining.capacity - enrolledUsers.length : 0;

  return (
    <div className="training-background-img">
      <div className="container mt-5">
        {selectedTraining ? (
          <div className="card mt-4 training-detail-card">
            <div className="card-header">
              <h4 className="card-title">Detalles de la Capacitación</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Título:</strong> {selectedTraining.title}</p>
                  <p><strong>Fecha de Inicio:</strong> {selectedTraining.startDate}</p>
                  <p><strong>Fecha de Fin:</strong> {selectedTraining.endDate}</p>
                  <p><strong>Ubicación:</strong> {selectedTraining.location}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Instructor:</strong> {selectedTraining.trainer ? selectedTraining.trainer : 'N/A'}</p>
                  <p><strong>Duración:</strong> {selectedTraining.duration}</p>
                  <p><strong>Cupos Totales:</strong> {selectedTraining.capacity}</p>
                  <p><strong>Cupos Disponibles:</strong> {`${availableSpots}/${selectedTraining.capacity}`}</p>
                </div>
                {/* Cuadro de Descripción Independiente */}
                <div className="col-12">
                  <div className="description-box">
                    <h5><strong>Descripción:</strong></h5>
                    <p>{selectedTraining.description}</p>
                  </div>
                </div>
              </div>
              <h5 className="mt-4 section-title">Trabajadores Inscritos</h5>
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>N</th>
                    <th>RUT</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Correo</th>
                  </tr>
                </thead>
                <tbody>
                  {enrolledUsers.length > 0 ? (
                    enrolledUsers.map((user, index) => (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.dni || "No disponible"}</td>
                        <td>{user.userName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.email}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No hay trabajadores inscritos en esta capacitación.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <button className="btn btn-danger mt-3" onClick={() => setSelectedTraining(null)}>Salir</button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="training-list-title">Listado de Capacitaciones</h2>
            <div className="training-table-container">
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
            </div>
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
