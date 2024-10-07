import React, { useState, useEffect } from 'react';
import { db } from '../FireBaseConfig/FireBase'; // Importar Firestore
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import '../styles.css'; 

const AccidentList = () => {
  const { id: userId } = useParams(); // Obtener el userId desde los parámetros de la URL
  const [accidents, setAccidents] = useState([]); // Estado para almacenar la lista de accidentes
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga

  // Función para capitalizar la primera letra de una cadena
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Función para obtener los accidentes relacionados con el userId desde Firestore
  useEffect(() => {
    const fetchAccidents = async () => {
      try {
        const accidentsCollection = collection(db, 'accident_investigations'); // Referencia a la colección
        const q = query(accidentsCollection, where('userId', '==', userId)); // Query para filtrar por userId
        const accidentsSnapshot = await getDocs(q); // Obtener los documentos filtrados
        const accidentsList = accidentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAccidents(accidentsList);
      } catch (error) {
        console.error('Error fetching accidents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccidents();
  }, [userId]);

  if (isLoading) {
    return <div>Cargando accidentes...</div>;
  }

  if (accidents.length === 0) {
    return <div>No se encontraron accidentes registrados para este usuario.</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="accident-list-title">Listado de Accidentes Registrados</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Ubicación</th>
            <th>Descripción</th>
            <th>Acciones Correctivas</th>
            <th>Nombre del Accidentado</th>
            <th>Apellido del Accidentado</th>
            <th>Cargo</th>
            <th>Edad</th>
            <th>RUT</th>
          </tr>
        </thead>
        <tbody>
          {accidents.map(accident => (
            <tr key={accident.id}>
              <td>{accident.date}</td>
              <td>{accident.time}</td>
              <td>{capitalizeFirstLetter(accident.location)}</td>
              <td>{capitalizeFirstLetter(accident.description)}</td>
              <td>{capitalizeFirstLetter(accident.correctiveActions)}</td>
              <td>{capitalizeFirstLetter(accident.employeeName)}</td>
              <td>{capitalizeFirstLetter(accident.employeeLastName)}</td>
              <td>{capitalizeFirstLetter(accident.employeePosition)}</td>
              <td>{accident.employeeAge}</td>
              <td>{accident.employeeRut}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Botón de enlace para volver a la vista de capacitación */}
      <Link className="btn btn-danger" to={`/training/${userId}`}>
        Volver
      </Link>
    </div>
  );
};

export default AccidentList;
