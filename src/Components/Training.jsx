import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FireBaseConfig/FireBase";
import { useParams, Link } from "react-router-dom";
import imagePerfil from "../assets/perfil.png";

const Training = () => {
  const { id: userId } = useParams(); // Obtén el userId de los parámetros de la URL
  const [user, setUser] = useState(null);// Estado para almacenar los datos del usuario 

  useEffect(() => {
    // useEffect se ejecuta al montar el componente para obtener los datos del usuario
    const fetchUser = async () => {
      try {
        const userDoc = doc(db, `users/${userId}`); // Referencia al documento del usuario en Firestore
        const userSnapshot = await getDoc(userDoc); // Obtener el documento del usuario
        if (userSnapshot.exists()) {
          setUser(userSnapshot.data()); // Actualizar el estado con los datos del usuario
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (userId) {
      fetchUser(); // Llamar a la función para obtener los datos del usuario si userId está definido
    }
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }
  // Función para capitalizar la primera letra de una cadena
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <div className="training-background">
      <div className="training-content">
        <div className="card text-center training-card">
          <img src={imagePerfil} alt="Perfil" className="card-img-perfil" />
          <div className="card-body">
            <h5 className="card-title">
              {capitalizeFirstLetter(user.userName)}{" "}
              {capitalizeFirstLetter(user.lastName)}
            </h5>
            <p className="card-text">Email: {user.email}</p>
            <p className="card-text">
              Address: {capitalizeFirstLetter(user.address)}
            </p>
            <p className="card-text">DNI: {user.dni}</p>
            <p className="card-text">
              Country: {capitalizeFirstLetter(user.country)}
            </p>
            <p className="card-text">Phone: {user.phone}</p>
            <Link to={`/create-training/${userId}`} className="btn btn-primary">
              Crear Capacitación
            </Link>
            <Link
              to={`/view-trainings/${userId}`}
              className="btn btn-secondary ms-2"
            >
              Listado de Capacitaciones
            </Link>

            {/* Botones añadidos para la creación y visualización de accidentes */}
            <Link to={`/accident-investigation/${userId}`} className="btn btn-warning ms-2">
              Crear Registro de Accidentes
            </Link>

            <Link to={`/view-accidents/${userId}`} className="btn btn-info ms-2">
              Listado de Accidentes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Training;
