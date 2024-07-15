// Importa los módulos necesarios de React, Firebase y RxJS
import React, { useState } from "react";

// setDoc: Método para crear o sobrescribir un documento en una colección de Firestore.
// doc: Método para obtener una referencia a un documento en una colección.
// getFirestore: Método para obtener una instancia de Firestore.
import { setDoc, doc, getFirestore } from "firebase/firestore";
import { app } from "../FireBaseConfig/FireBase";
import { useNavigate } from "react-router-dom";

// Método para crear un nuevo usuario utilizando un email y una contraseña.
// Método para obtener una instancia de autenticación de Firebase.
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"; // Importa funciones de autenticación de Firebase.

// from: Método para crear un observable a partir de una promesa.
// switchMap: Operador para cambiar a un nuevo observable basado en el valor de un observable anterior.
// tap: Operador para ejecutar efectos secundarios (side effects).
// catchError: Operador para manejar errores en un observable.
import { from } from "rxjs";
import { switchMap, tap, catchError } from "rxjs/operators"; // Importa operadores de RxJS
import Swal from "sweetalert2"; // SweetAlert para alertas

// Define el componente CreateUser
// Estados para los campos del formulario y otras variables necesarias
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
  const navigate = useNavigate();
  const fireStore = getFirestore(app); // instancia de Firestore para realizar operaciones en DB.
  const auth = getAuth(app); //instancia de Firebase Auth para manejar  autenticación de usuarios.

  // Esta función se ejecuta cuando se envía el formulario la llamada a event.preventDefault() evita que se envie el formulario por defecto..
  // Evita que la página se recargue.
  const createUser = (event) => {
    event.preventDefault();

    // createFBUser se encarga de crear un usuario en Firebase Authentication y de almacenar datos adicionales
    // del usuario. Luego, se utiliza dentro de createUser para el proceso de creación de un nuevo usuario.
    const createFBUser = (
      email,
      password,
      userName,
      lastName,
      address,
      role, // todos son creados con user por defecto.
      dni,
      country,
      phone,
      created_at
    ) => {
      // createUserWithEmailAndPassword de Firebase Auth para crear nuevo usuario.
      // from se usa para convertir la promesa retornada en un observable.
      return from(createUserWithEmailAndPassword(auth, email, password))
        .pipe(
          // switchMap toma el resultado de createUserWithEmailAndPassword,
          // Define referencias a documentos en Firestore (newUser y newUserTraining).
          switchMap((fireBaseUser) => {
            const infoUser = fireBaseUser;
            const newUser = doc(fireStore, `users/${infoUser.user.uid}`);
            const newUserTraining = doc(
              fireStore,
              `training/${infoUser.user.uid}`
            );

            // setDoc crea usuario en Firestore con los datos adicionales.
            // from convierte la promesa retornada por setDoc en un observable.
            return from(
              setDoc(newUser, {
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
              })
            );
          }),
          tap(() => {
            // Tap: para realizar efectos secundarios sin modificar el flujo de datos.
            // Limpiar el formulario después de agregar
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

            // Una vez crea el usuario redirige a vista training (mi perfil)
            navigate(`/training/${auth.currentUser.uid}`);

            // Alerta de creacion de usuario exitoso
            Swal.fire({
              icon: "success",
              title: "Usuario creado exitosamente",
              showConfirmButton: false,
              timer: 1500,
            });
          }),
          catchError((error) => {
            // Maneja cualquier error que ocurra en el proceso de creación de usuario.
            Swal.fire({
              icon: "error",
              title: "Error al crear el usuario",
              text: error.message,
            });
            throw error;
          })
        )
        .subscribe();
    };

    // Llama a la función para crear el usuario en Firebase y Firestore
    createFBUser(
      email,
      password,
      userName,
      lastName,
      address,
      role,
      dni,
      country,
      phone,
      created_at
    );
  };

  // Renderizado del formulario
  // evento onsubmit: se activa cuando un usuario envía un formulario HTML asociado al elemento <form>
  return (
    <>
      <div className="create-user-bg">
        <div className="text-center text-white p-3">
          <h1>Registro Nuevo Usuario</h1>
        </div>
        <div >
          <form
            onSubmit={createUser}
            className="container mt-3 create-user-form col-sm-12 col-md-10 col-lg-8 col-xl-6"
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
            <div className="d-grid gap-2 col-3 mx-auto">
              <button type="submit" className="btn btn-primary">
                Crear Usuario
              </button>
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
