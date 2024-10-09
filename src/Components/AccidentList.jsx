import React, { useState, useEffect } from 'react';
import { db } from '../FireBaseConfig/FireBase'; // Importar Firestore
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2'; // Para las alertas
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

  const updateAccidentStatus = async (accidentId, status) => {
    try {
      const accidentDoc = doc(db, 'accident_investigations', accidentId);
      await updateDoc(accidentDoc, { status }); // Actualiza el estado en Firestore

      // Actualizar el estado local de la tabla
      setAccidents(prevAccidents =>
        prevAccidents.map(accident =>
          accident.id === accidentId ? { ...accident, status } : accident
        )
      );

      Swal.fire({
        icon: 'success',
        title: `Estado actualizado a: ${status}`,
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Error actualizando el estado:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el estado del accidente.',
      });
    }
  };

  const addCorrectiveActions = async (accidentId) => {
    const { value: correctiveActions } = await Swal.fire({
      title: 'Agregar Acciones Correctivas',
      input: 'textarea',
      inputLabel: 'Acciones Correctivas',
      inputPlaceholder: 'Escribe las acciones correctivas aquí...',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes escribir una acción correctiva!';
        }
      }
    });

    if (correctiveActions) {
      try {
        const accidentDoc = doc(db, 'accident_investigations', accidentId);
        await updateDoc(accidentDoc, { correctiveActions }); // Actualiza las acciones correctivas en Firestore

        // Actualizar el estado local de la tabla
        setAccidents(prevAccidents =>
          prevAccidents.map(accident =>
            accident.id === accidentId ? { ...accident, correctiveActions } : accident
          )
        );

        Swal.fire({
          icon: 'success',
          title: 'Acciones Correctivas Guardadas',
          showConfirmButton: false,
          timer: 1500
        });
      } catch (error) {
        console.error('Error actualizando las acciones correctivas:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron guardar las acciones correctivas.',
        });
      }
    }
  };

  if (isLoading) {
    return <div>Cargando accidentes...</div>;
  }

  if (accidents.length === 0) {
    return <div>No se encontraron accidentes registrados para este usuario.</div>;
  }

  return (
    <>
      {/* Título fuera del cuadro */}
      <h2 className="accident-list-title mb-4">Listado de Accidentes Registrados</h2>

      <div className="accident-list-container">
        <div className="table-responsive">
          <table className="accident-list-table table table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Ubicación</th>
                <th>Descripción</th>
                <th>Acciones Correctivas</th>
                <th>Estado</th>
                <th>Responsable</th>
                <th>Cargo del Responsable</th> {/* Cargo del responsable */}
                <th>Nombre del Accidentado</th>
                <th>Apellido del Accidentado</th>
                <th>Cargo</th>
                <th>Edad</th>
                <th>RUT</th>
                <th>Acciones</th>
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
                  <td>{capitalizeFirstLetter(accident.status)}</td>
                  <td>{accident.responsable}</td>
                  <td>{accident.responsablePosition}</td> {/* Mostrar cargo del responsable */}
                  <td>{capitalizeFirstLetter(accident.employeeName)}</td>
                  <td>{capitalizeFirstLetter(accident.employeeLastName)}</td>
                  <td>{capitalizeFirstLetter(accident.employeePosition)}</td>
                  <td>{accident.employeeAge}</td>
                  <td>{accident.employeeRut}</td>
                  <td>
                    {/* Contenedor de botones organizados en una fila */}
                    <div className="accident-button-group">
                      <button 
                        className="btn-accident-primary btn-sm mb-1" 
                        onClick={() => updateAccidentStatus(accident.id, 'En Proceso')}
                      >
                        En Proceso
                      </button>
                      <button 
                        className="btn-accident-danger btn-sm mb-1" 
                        onClick={() => updateAccidentStatus(accident.id, 'Pendiente')}
                      >
                        Pendiente
                      </button>
                      <button 
                        className="btn-accident-success btn-sm mb-1" 
                        onClick={() => updateAccidentStatus(accident.id, 'Cerrada')}
                      >
                        Cerrada
                      </button>
                      <button 
                        className="btn-accident-add-corrective btn-sm" 
                        onClick={() => addCorrectiveActions(accident.id)}
                      >
                        Agregar Acciones
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botón de enlace para volver a la vista de capacitación */}
        <Link className="btn-accident-back mt-3" to={`/training/${userId}`}>
          Volver
        </Link>
      </div>
    </>
  );
};

export default AccidentList;
