import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../FireBaseConfig/FireBase'; 
import { useParams } from 'react-router-dom';

const ViewTrainings = () => {
  const { id } = useParams(); // Asegúrate de que el userId esté en los parámetros de la URL
  const [userTraining, setUserTraining] = useState([]);

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
          </tr>
        </thead>
        <tbody>
          {userTraining.map(training => (
            <tr key={training.id}>
              <td>{training.title}</td>
              <td>{training.description}</td>
              <td>{training.startDate}</td>
              <td>{training.endDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewTrainings;
