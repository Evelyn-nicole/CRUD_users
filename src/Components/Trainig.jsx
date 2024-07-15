import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FireBaseConfig/FireBase"; // Asegúrate de que la ruta sea correcta
import { useParams, Link } from "react-router-dom"; // Importa useParams para obtener el ID de la URL
import imagePerfil from "../assets/perfil.png";

const Training = () => {
  const { id: userId } = useParams(); // Obtén el userId de los parámetros de la URL
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = doc(db, `users/${userId}`);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUser(userSnapshot.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <div className="training-background">
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
            Crear Capacitaciones
          </Link>
          <Link to={`/view-trainings/${userId}`} className="btn btn-secondary">
            Ver Capacitaciones
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Training;
