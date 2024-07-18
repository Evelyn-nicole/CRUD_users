import React, { useState } from "react";
import { setDoc, doc, getFirestore } from "firebase/firestore"; // Importa funciones de Firestore.
import { app } from "../FireBaseConfig/FireBase";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import Swal from "sweetalert2";


// // Define el componente CreateUser
// // Estados para los campos del formulario y otras variables
const CreateUser = () => {
  const [userName, setNameUser] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dni, setDni] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [created_at, setCreated] = useState("");
  const [updated_at, setUpdated] = useState("");


  // Obtención de hooks y referencias a Firebase
  const navigate = useNavigate(); // Hook para redireccionar a diferentes rutas.
  const fireStore = getFirestore(app); // instancia de Firestore para realizar operaciones en DB.
  const auth = getAuth(app); //instancia de Firebase Auth para manejar  autenticación de usuarios.


  // Función para crear un nuevo usuario.
  const createUser = async (event) => {
    event.preventDefault(); // Previene la recarga de la página al enviar el formulario.



    try {
      // Crea un nuevo usuario en Firebase Authentication.
      const fireBaseUser = await createUserWithEmailAndPassword(auth, email, password);
      const infoUser = fireBaseUser;


      // Define referencias a documentos en Firestore.
      const newUser = doc(fireStore, `users/${infoUser.user.uid}`);


      // Crea un nuevo documento en Firestore con los datos del usuario.
      await setDoc(newUser, {
        userName: userName,
        lastName: lastName,
        address: address,
        email: email,
        password: password,
        role: "user",
        dni: dni,
        country: country,
        phone: phone,
        created_at: new Date(),
        updated_at: updated_at,
      });


       // Limpia los campos del formulario.
      setNameUser("");
      setLastName("");
      setAddress("");
      setEmail("");
      setRole("");
      setDni("");
      setCountry("");
      setPhone("");
      setCreated("");
      setUpdated("");


      // Redirige a la vista de entrenamiento (perfil del usuario).
      navigate(`/training/${auth.currentUser.uid}`);


      Swal.fire({
        icon: "success",
        title: "Usuario creado exitosamente",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) { // Maneja cualquier error que ocurra durante la creación del usuario.
      Swal.fire({
        icon: "error",
        title: "Error al crear el usuario",
        text: error.message,
      });
    }
  };


  // Renderizado del formulario
  // evento onsubmit: se activa cuando un usuario envía un formulario HTML asociado al elemento <form>
  return (
    <>
      <div className="create-user-bg">
        <div className="title-create-user text-center text-white p-3 mt-3">
          <h1>Registro Nuevo Usuario</h1>
        </div>
        <div >
          <form
            onSubmit={createUser}
            className="container mt-4 create-user-form col-sm-12 col-md-10 col-lg-8 col-xl-6"
          >
            <div className="input-group mb-3">
              <span className="input-group-text" id="inputGroup-sizing-default">
                Nombre
              </span>
              <input
                type="text"
                className="form-control"
                aria-label="Sizing example input"
                data-testid="userName-input"
                aria-describedby="inputGroup-sizing-default"
                value={userName} // Enlaza el valor del campo al estado userName
                onChange={(e) => setNameUser(e.target.value)} // Actualiza el estado userName
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
                data-testid="lastName-input"
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
                data-testid="address-input"
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
                data-testid="email-input"
                aria-describedby="inputGroup-sizing-default"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="inputGroup-sizing-default">
                Contraseña
              </span>
              <input
                type="password"
                className="form-control"
                aria-label="Sizing example input"
                data-testid="password-input"
                aria-describedby="inputGroup-sizing-default"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                data-testid="dni-input"
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
                data-testid="country-input"
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
                data-testid="phone-input"
                aria-describedby="inputGroup-sizing-default"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="">
              <button type="submit" className="btn btn-primary">
                Crear Usuario
              </button>
              <Link className="btn btn-danger ms-2" to={`/login`}>
              Volver
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateUser;

// Resumen
// El formulario para crear un usuario en React:

// Interfaz de Usuario: Utiliza componentes de Bootstrap para un diseño consistente y atractivo.
// Gestión del Estado: Cada campo del formulario está vinculado a un estado mediante useState.
// Manejo de Eventos: El evento onChange de cada campo actualiza el estado correspondiente. El evento onSubmit del formulario activa la función createUser.
// Creación de Usuario: La función createUser se encarga de la validación y la creación del usuario en Firebase Authentication y Firestore.
//Esto asegura que el formulario no solo capture la información del usuario de manera efectiva, sino que también la procese y la almacene correctamente en los servicios backend.
