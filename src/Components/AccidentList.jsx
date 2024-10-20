import React, { useState, useEffect } from 'react';
import { db } from '../FireBaseConfig/FireBase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../Styles/AccidentList.css';

const AccidentList = () => {
  const { id: userId } = useParams();
  const [accidents, setAccidents] = useState([]);
  const [selectedAccidentId, setSelectedAccidentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const capitalizeFirstLetter = (string = '') =>
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

  useEffect(() => {
    const fetchAccidents = async () => {
      try {
        const accidentsCollection = collection(db, 'accident_investigations');
        const q = query(accidentsCollection, where('userId', '==', userId));
        const accidentsSnapshot = await getDocs(q);
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
      await updateDoc(accidentDoc, { status });

      setAccidents(prevAccidents =>
        prevAccidents.map(accident =>
          accident.id === accidentId ? { ...accident, status } : accident
        )
      );

      Swal.fire({
        icon: 'success',
        title: `Estado actualizado a: ${status}`,
        showConfirmButton: false,
        timer: 1500,
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
      inputValidator: value => !value && 'Debes escribir una acción correctiva!',
    });

    if (correctiveActions) {
      try {
        const accidentDoc = doc(db, 'accident_investigations', accidentId);
        await updateDoc(accidentDoc, { correctiveActions });

        setAccidents(prevAccidents =>
          prevAccidents.map(accident =>
            accident.id === accidentId ? { ...accident, correctiveActions } : accident
          )
        );

        Swal.fire({
          icon: 'success',
          title: 'Acciones Correctivas Guardadas',
          showConfirmButton: false,
          timer: 1500,
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

  const toggleAccidentDetails = (accidentId) => {
    setSelectedAccidentId(prevId => (prevId === accidentId ? null : accidentId));
  };

  if (isLoading) return <div className="loading">Cargando accidentes...</div>;
  if (!accidents.length) return <div className="no-data">No se encontraron accidentes registrados.</div>;

  return (
    <>
      <h2 className="accident-list-title mb-4">Listado de Accidentes Registrados</h2>
      <div className="accident-list-container">
        <div className="table-responsive">
          <table className="accident-list-table table table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {accidents.map(accident => (
                <React.Fragment key={accident.id}>
                  <tr
                    className={`accident-row ${selectedAccidentId === accident.id ? 'selected' : ''}`}
                  >
                    <td>{accident.date}</td>
                    <td>{accident.time}</td>
                    <td className="location-column">{capitalizeFirstLetter(accident.location)}</td>
                    <td>{capitalizeFirstLetter(accident.status)}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-secondary btn-sm dropdown-toggle"
                          type="button"
                          id={`dropdown-${accident.id}`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Opciones
                        </button>
                        <ul className="dropdown-menu" aria-labelledby={`dropdown-${accident.id}`}>
                          <li>
                            <button className="dropdown-item" onClick={() => updateAccidentStatus(accident.id, 'En Proceso')}>En Proceso</button>
                          </li>
                          <li>
                            <button className="dropdown-item" onClick={() => updateAccidentStatus(accident.id, 'Pendiente')}>Pendiente</button>
                          </li>
                          <li>
                            <button className="dropdown-item" onClick={() => updateAccidentStatus(accident.id, 'Cerrada')}>Cerrada</button>
                          </li>
                        </ul>
                      </div>
                      <button className="btn btn-info btn-sm mx-1" onClick={() => addCorrectiveActions(accident.id)}>Acciones Correctivas</button>
                      <button className="btn btn-warning btn-sm mx-1" onClick={() => toggleAccidentDetails(accident.id)}>Ver Detalles</button>
                    </td>
                  </tr>

                  {selectedAccidentId === accident.id && (
                    <tr className="accident-details-row">
                      <td colSpan="6">
                        <div className="accident-details">
                          <h3 className="details-title">Detalles del Accidente</h3>
                          <div className="details-content">
                            <div className="details-column details-block">
                              <h4 className="details-subtitle">Responsable</h4>
                              <p><strong>Nombre:</strong> {accident.responsable}</p>
                              <p><strong>Cargo:</strong> {accident.responsablePosition}</p>
                            </div>
                            <div className="details-column details-block">
                              <h4 className="details-subtitle">Datos del Accidentado</h4>
                              <p><strong>Nombre:</strong> {capitalizeFirstLetter(accident.employeeName)}</p>
                              <p><strong>Apellido:</strong> {capitalizeFirstLetter(accident.employeeLastName)}</p>
                              <p><strong>Cargo:</strong> {capitalizeFirstLetter(accident.employeePosition)}</p>
                              <p><strong>Edad:</strong> {accident.employeeAge}</p>
                              <p><strong>RUT:</strong> {accident.employeeRut}</p>
                            </div>
                          </div>
                          <div className="details-block">
                            <h4 className="details-subtitle">Descripción del Accidente</h4>
                            <p>{capitalizeFirstLetter(accident.description)}</p>
                          </div>
                          <div className="details-block">
                            <h4 className="details-subtitle">Acciones Correctivas</h4>
                            <p className="corrective-actions">{accident.correctiveActions ? capitalizeFirstLetter(accident.correctiveActions) : 'No hay acciones correctivas registradas.'}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <Link className="btn-accident-back mt-3" to={`/training/${userId}`}>Volver</Link>
      </div>
    </>
  );
};

export default AccidentList;
