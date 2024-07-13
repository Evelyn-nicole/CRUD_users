// Importa los módulos necesarios de React, Firebase y RxJS
import React, { useState } from "react";

// setDoc: Método para crear o sobrescribir un documento en una colección de Firestore.
// doc: Método para obtener una referencia a un documento en una colección.
// getFirestore: Método para obtener una instancia de Firestore.
import { setDoc, doc, getFirestore } from "firebase/firestore"; 
import { app } from "../FireBaseConfig/FireBase"; 
import { useNavigate } from 'react-router-dom'; 

// Método para crear un nuevo usuario utilizando un email y una contraseña.
// Método para obtener una instancia de autenticación de Firebase.
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"; // Importa funciones de autenticación de Firebase.

// from: Método para crear un observable a partir de una promesa.
// switchMap: Operador para cambiar a un nuevo observable basado en el valor de un observable anterior.
// tap: Operador para ejecutar efectos secundarios (side effects).
// catchError: Operador para manejar errores en un observable.
import { from } from 'rxjs'; 
import { switchMap, tap, catchError } from 'rxjs/operators'; // Importa operadores de RxJS
import Swal from 'sweetalert2'; // SweetAlert para alertas


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
  // Hook para la navegación en React Router
  // Instancia de Firestore
  // Instancia de Firebase Auth
  const navigate = useNavigate(); 
  const fireStore = getFirestore(app); 
  const auth = getAuth(app); 


  // Función para manejar el envío del formulario
  const createUser = (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario


    // Función para crear un usuario en Firebase Authentication y guardar datos adicionales en Firestore
    const createFBUser = (
      email,
      password,
      userName,
      lastName,
      address,
      role, // todos los usuarios creados son usuarios por defecto
      dni,
      country,
      phone,
      created_at,
    ) => {

      // Crea el usuario en Firebase Authentication
      return from(createUserWithEmailAndPassword(auth, email, password)).pipe(
        switchMap((fireBaseUser) => {
          const infoUser = fireBaseUser;
          // Crea un documento de usuario en Firestore con datos adicionales
          const newUser = doc(fireStore, `users/${infoUser.user.uid}`);
          
          return from(setDoc(newUser, {
            userName: userName,
            lastName: lastName,
            address: address,
            email: email,
            password: password,
            role: 'user',
            dni: dni,
            country: country,
            phone: phone,
            created_at: new Date(), // Establece la fecha y hora actual al crear un usuario
            updated_at: updated_at,
          }))
        }),
        tap(() => {
          // Limpiar el formulario después de agregar
          setNameUser('');
          setLastName('');
          setAddress('');
          setEmail('');
          setRole('');
          setDni('');
          setCountry('');
          setPhone('');
          setCreated('');
          setUpdated('');

          // Una vez crea el usuario redirige a vista home
          navigate(`/home}`);


          // Alerta de creacion de usuario exitoso
          Swal.fire({
            icon: "success",
            title: "Usuario creado exitosamente",
            showConfirmButton: false,
            timer: 1500
          });
        }),
        catchError((error) => {
          // Manejo de errores
          Swal.fire({
            icon: "error",
            title: "Error al crear el usuario",
            text: error.message,
          });
          throw error;
        })
      ).subscribe();
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
      created_at,
    );
  };

  
  
  // Renderizado del formulario
  return (
    <>
      <div>
        <h1 className="text-center mt-5">Crear Usuario</h1>
      </div>
      <form onSubmit={createUser} className="container mt-5">
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
        <div className="d-grid gap-2 col-6 mx-auto">
          <button type="submit" className="btn btn-primary">
            Agregar Usuario
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateUser;