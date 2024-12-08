import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FireBaseConfig/FireBase";
import { useParams, Link, useNavigate } from "react-router-dom";
import imagePerfil from "../assets/perfil.png";
import '../Styles/Training.css';

const Training = () => {
  const { id: userId } = useParams(); // Obtén el userId de los parámetros de la URL
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario 
  const [role, setRole] = useState(null); // Estado para almacenar el rol del usuario
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = doc(db, `users/${userId}`); // Referencia al documento del usuario en Firestore
        const userSnapshot = await getDoc(userDoc); // Obtener el documento del usuario
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUser(userData); // Actualizar el estado con los datos del usuario
          setRole(userData.role); // Obtener el rol del usuario
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

  // Si el rol no es 'supervisor' o 'preventionista', redirigir al usuario
  useEffect(() => {
    if (role && role !== 'supervisor' && role !== 'prevencionista'); {
      // navigate('/unauthorized'); // Ruta a la que rediriges si el usuario no tiene permisos
    }
  }, [role, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // return (
  //   <div className="training-background">
  //     <div className="training-content">
  //       <div className="card text-center training-card">
  //         <img src={imagePerfil} alt="Perfil" className="card-img-perfil" />
  //         <div className="card-body">
  //           <h5 className="card-title">
  //             {capitalizeFirstLetter(user.userName)}{" "}
  //             {capitalizeFirstLetter(user.lastName)}
  //           </h5>
  //           <p className="card-text">Email: {user.email}</p>
  //           <p className="card-text">
  //             Address: {capitalizeFirstLetter(user.address)}
  //           </p>
  //           <p className="card-text">DNI: {user.dni}</p>
  //           <p className="card-text">
  //             Country: {capitalizeFirstLetter(user.country)}
  //           </p>
  //           <p className="card-text">Phone: {user.phone}</p>
  //           <p className="card-text">Rol: {capitalizeFirstLetter(user.role)}</p>

  //           {/* Botones añadidos para la creación y visualización de Capacitaciones */}
  //           <Link to={`/create-training/${userId}`} className="btn btn-primary">
  //             Crear Registro Capacitación
  //           </Link>
  //           <Link to={`/view-trainings/${userId}`} className="btn btn-warning ms-2">
  //             Ver Listado de Capacitaciones
  //           </Link>

  //           {/* Botones añadidos para la creación y visualización de accidentes */}
  //           <Link to={`/accident-investigation/${userId}`} className="btn btn-primary ms-2">
  //             Crear Registro de Accidentes
  //           </Link>
  //           <Link to={`/view-accidents/${userId}`} className="btn btn-warning ms-2">
  //             Ver Listado de Accidentes
  //           </Link>

  //            {/* Botones añadidos para la creación y visualización de MIPER */}
  //           <Link to={`/create-miper/${userId}`} className="btn btn-primary ms-2">
  //             Crear Registro MIPER
  //           </Link>

  //           <Link to={`/view-miper/${userId}`} className="btn btn-warning ms-2">
  //             Ver Listado de MIPER
  //           </Link>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="training-background">
      <div className="training-content">
        {/* Card para datos personales */}
        <div className="card personal-info-card">
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
            <p className="card-text">Rol: {capitalizeFirstLetter(user.role)}</p>
          </div>
        </div>

        <div className="actions-container">
          <h4 className="actions-title mt-2 mb-4">Acciones</h4>
          <div className="btn-grid">
            <Link to={`/create-training/${userId}`} className="btn btn-primary">
              Crear Registro Capacitación
            </Link>
            <Link to={`/view-trainings/${userId}`} className="btn btn-warning">
              Ver Listado de Capacitaciones
            </Link>
            <Link to={`/accident-investigation/${userId}`} className="btn btn-primary">
              Crear Registro de Accidentes
            </Link>
            <Link to={`/view-accidents/${userId}`} className="btn btn-warning">
              Ver Listado de Accidentes
            </Link>
            <Link to={`/create-miper/${userId}`} className="btn btn-primary">
              Crear Registro MIPER
            </Link>
            <Link to={`/view-miper/${userId}`} className="btn btn-warning">
              Ver Listado de MIPER
            </Link>
          </div>
        </div>

      </div>
    </div>
  );

};

export default Training;
