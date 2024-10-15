import React, { useState, useEffect } from 'react';
import { db } from '../FireBaseConfig/FireBase'; // Importar Firestore
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import '../styles.css';

const AccidentInvestigation = () => {
  const { id: userId } = useParams(); // Obtener el userId de la URL
  const [user, setUser] = useState(null); // Datos del usuario
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const navigate = useNavigate(); // Para redirigir al usuario a otra página
  const [accidentDetails, setAccidentDetails] = useState({
    date: '',
    time: '',
    location: '',
    description: '',
    correctiveActions: '',
    employeeName: '',
    employeeLastName: '',
    employeePosition: '',
    employeeAge: '',
    employeeRut: '',
    responsable: '', // Añadimos el responsable
    responsablePosition: '', // Añadimos el cargo del responsable
  });

  // Función para obtener los datos del usuario desde Firestore
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = doc(db, `users/${userId}`);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUser(userSnapshot.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    } else {
      console.log('No userId found in URL');
      setIsLoading(false);
    }
  }, [userId]);

  const handleChange = (e) => {
    setAccidentDetails({
      ...accidentDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("User ID al crear accidente:", userId); // Depurar userId
    console.log("Detalles del accidente que se va a registrar:", accidentDetails); // Depurar detalles

    try {
      // Crear un nuevo registro en la colección raíz de 'accident_investigations' con el userId
      await addDoc(collection(db, "accident_investigations"), {
        ...accidentDetails,
        userId, // Agregar el ID del usuario que registró la investigación
        createdAt: new Date(), // Añadir la fecha de creación
        updates: [], // Añadimos el historial de actualizaciones vacío
      });

      Swal.fire({
        icon: 'success',
        title: '¡Investigación registrada con éxito!',
        text: 'El registro del accidente ha sido guardado.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        // Redirigir a la página de training después de la creación exitosa
        navigate(`/training/${userId}`);
      });

      // Limpiar el formulario después de enviarlo
      setAccidentDetails({
        date: '',
        time: '',
        location: '',
        description: '',
        correctiveActions: '',
        employeeName: '',
        employeeLastName: '',
        employeePosition: '',
        employeeAge: '',
        employeeRut: '',
        responsable: '',
        responsablePosition: '', // Limpiar el campo del cargo del responsable
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar la investigación',
        text: 'Hubo un problema al guardar los datos. Por favor, intenta nuevamente.',
        confirmButtonText: 'Cerrar'
      });
      console.error('Error registrando la investigación: ', error);
    }
  };

  if (isLoading) {
    return <div>Cargando datos...</div>;
  }

  if (!user) {
    return <div>No se encontraron datos para este usuario.</div>;
  }

  return (
    <div className="accident-investigation container">
      <h2>Investigación de Accidentes</h2>
      <form onSubmit={handleSubmit} className="row">
        {/* Formulario del accidente */}
        <div className="col-md-6">
          <label className="form-label">Fecha del accidente:</label>
          <input
            type="date"
            name="date"
            className="form-control"
            value={accidentDetails.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Hora del accidente:</label>
          <input
            type="time"
            name="time"
            className="form-control"
            value={accidentDetails.time}
            onChange={handleChange}
            required
          />
        </div>

        {/* Otros campos */}
        <div className="col-md-12">
          <label className="form-label">Ubicación:</label>
          <input
            type="text"
            name="location"
            className="form-control"
            value={accidentDetails.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-12">
          <label className="form-label">Descripción del accidente:</label>
          <textarea
            name="description"
            className="form-control"
            value={accidentDetails.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Responsable y Cargo del Responsable */}
        <div className="col-md-6">
          <label className="form-label">Responsable</label>
          <input
            type="text"
            name="responsable"
            className="form-control"
            value={accidentDetails.responsable}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Cargo del Responsable</label>
          <input
            type="text"
            name="responsablePosition"
            className="form-control"
            value={accidentDetails.responsablePosition}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campos del accidentado */}
        <div className="col-12 section-title">
          <h3>Datos del Accidentado</h3>
        </div>
        <div className="col-md-6">
          <label className="form-label">Nombre del accidentado:</label>
          <input
            type="text"
            name="employeeName"
            className="form-control"
            value={accidentDetails.employeeName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Apellido del accidentado:</label>
          <input
            type="text"
            name="employeeLastName"
            className="form-control"
            value={accidentDetails.employeeLastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Cargo:</label>
          <input
            type="text"
            name="employeePosition"
            className="form-control"
            value={accidentDetails.employeePosition}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Edad:</label>
          <input
            type="number"
            name="employeeAge"
            className="form-control"
            value={accidentDetails.employeeAge}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">RUT:</label>
          <input
            type="text"
            name="employeeRut"
            className="form-control"
            value={accidentDetails.employeeRut}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-12 text-center mt-4">
          <button type="submit" className="btn btn-primary">Registrar Investigación</button>
          {/* Botón de enlace para volver a la vista de capacitación */}
          <Link className="btn btn-red ms-2" to={`/training/${userId}`}>
            Volver
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AccidentInvestigation;
