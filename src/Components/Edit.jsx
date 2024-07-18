import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firestore
import { db } from "../FireBaseConfig/FireBase"; // Configuración de Firebase
import { useNavigate, useParams, Link } from "react-router-dom"; // Navegación en React Router  useParams para obtener parámetros de la URL.
import Swal from "sweetalert2"; 
import "../styles.css"; 


const Edit = () => {
  const [userName, setNameUser] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [updated_at, setUpdated] = useState("");

  // Hook - useNavigate permite redirigir a otras rutas en React Router
  const navigate = useNavigate();
  const { id } = useParams(); // Obtiene el parámetro de la URL

  // Función para actualizar un usuario
  const updateUser = async (e) => {
    e.preventDefault(); // Evita que el formulario se envíe

    // Referencia al documento del usuario en Firestore
    const user = doc(db, "users", id);

    // Datos actualizados del usuario
    const data = {
      userName: userName,
      lastName: lastName,
      address: address,
      email: email,
      dni: dni,
      country: country,
      phone: phone,
      updated_at: new Date(),
    };

    // Actualiza el documento del usuario en Firestore
    await updateDoc(user, data);

    // Alerta de edicion de usuario exitoso
    Swal.fire({
      icon: "success",
      title: "Usuario Actualizado exitosamente",
      showConfirmButton: false,
      timer: 1500,
    });

    // Una vez actualiza el usuario redirige a vista usuarios
    navigate("/users");
  };

  // Función para obtener los datos del usuario por su ID
  // getDoc(doc(db, "users", id)) obtiene el documento del usuario desde Firestore.
  // if (user.exists()) verifica si el documento existe.
  const getUserById = async (id) => {
    const user = await getDoc(doc(db, "users", id));
    if (user.exists()) {
      // Actualiza los estados con los datos del usuario
      setNameUser(user.data().userName);
      setLastName(user.data().lastName);
      setAddress(user.data().address);
      setEmail(user.data().email);
      setDni(user.data().dni);
      setCountry(user.data().country);
      setPhone(user.data().phone);
      setUpdated(user.data().updated_at);
    } else {
      console.log("Usuario no encontrado");
    }
  };

  // Se ejecuta al cargar el componente, obtiene los datos del usuario por su ID
  useEffect(() => {
    getUserById(id);
  }, [id]); // dependencia, useEffect se monta cada vez que cambia el id

  // Renderiza el formulario de edición de usuario
  return (
    <div className="admin-background">
      <div className="container mt-5">
        <div className="card editUser mx-auto">
          <div className="card-header">
            <h3>Edición de Usuario</h3>
          </div>
          <div className="card-body">
            <form onSubmit={updateUser}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={userName}
                  onChange={(e) => setNameUser(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Dirección</label>
                <input
                  type="text"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">RUT</label>
                <input
                  type="text"
                  className="form-control"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">País</label>
                <input
                  type="text"
                  className="form-control"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Teléfono</label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Actualizar Usuario
              </button>
              <Link className="btn btn-danger ms-2" to={`/users`}>
              Volver
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
