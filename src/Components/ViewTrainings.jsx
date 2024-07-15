import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../FireBaseConfig/FireBase';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ViewTrainings = () => {
  const { id } = useParams(); // Asegúrate de que el userId esté en los parámetros de la URL
  const [userTraining, setUserTraining] = useState([]);
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

  return (
    <div className="container mt-5">
      <h3>Capacitaciones</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {userTraining.map(training => (
            <tr key={training.id}>
              <td>{training.title}</td>
              <td>{training.description}</td>
              <td>{training.startDate}</td>
              <td>{training.endDate}</td>
              <td>
                <button className="btn btn-primary" onClick={() => handleEdit(training.id)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleDelete(training.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewTrainings;
