// Importa los módulos necesarios de react y firebase
import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firestore
import { db } from "../FireBaseConfig/FireBase"; // Configuración de Firebase
import { useNavigate, useParams } from "react-router-dom"; // Navegación en React Router  useParams para obtener parámetros de la URL.
import Swal from "sweetalert2"; // SweetAlert para alertas


const Edit = () => {
  // Estados para los campos del formulario
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
  }, []);



  // Renderiza el formulario de edición de usuario
  return (
    <>
      <div>
        <h1 className="text-center mt-5">Editar Usuario</h1>
      </div>
      <form onSubmit={updateUser} className="container mt-5">
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">
            Nombre
          </span>
          <input
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            data-testid="name-input"
            aria-describedby="inputGroup-sizing-default"
            value={userName}
            onChange={(e) => setNameUser(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">
            Apellido
          </span>
          <input
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">
            Direccion
          </span>
          <input
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">
            Mail
          </span>
          <input
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">
            Rut
          </span>
          <input
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">
            Pais
          </span>
          <input
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">
            Telefono
          </span>
          <input
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="d-grid gap-2 col-6 mx-auto">
          <button type="submit" className="btn btn-primary">
            Actualizar Usuario
          </button>
        </div>
      </form>
    </>
  );
};
export default Edit;