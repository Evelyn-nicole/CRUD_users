// Importa los módulos necesarios de react, firebase y rxjs
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; 
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../FireBaseConfig/FireBase"; 
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { from, of } from 'rxjs'; 
import { switchMap, catchError, tap } from 'rxjs/operators'; 
import Swal from "sweetalert2"; 


// Iniciliza las Instancias de Firestore y Auth
const firestore = getFirestore(app);
const auth = getAuth(app);


const Login = () => {
  const navigate = useNavigate(); // Permite redirigir al usuario a diferentes rutas.


  // Función para manejar el envío del formulario de inicio de sesión
  const submithandler = (e) => {
    e.preventDefault(); // Evita que el formulario se envíe


    // Obtiene el correo electrónico y la contraseña del formulario
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;


    // Utiliza RxJS para manejar el inicio de sesión y la obtención del documento de usuario
    // from(signInWithEmailAndPassword(auth, email, password)): Inicia sesión con Firebase Auth y convierte la promesa en un observable.
    // switchMap: Después de iniciar sesión, obtiene el ID del usuario actual y busca el documento en Firestore.
    from(signInWithEmailAndPassword(auth, email, password)).pipe(
      switchMap(() => {
        // Obtiene el ID de usuario actual
        const userId = auth.currentUser.uid;
        const docRef = doc(firestore, `users/${userId}`);
        return from(getDoc(docRef)).pipe(
          tap((docSnap) => {
            if (docSnap.exists()) {
              // Si el usuario existe, obtiene su información
              const userDoc = docSnap.data();
              const role = userDoc.role;


              // Redirige según el rol del usuario
              role === "admin"
                ? navigate("/users")
                : navigate(`/home`);


              // Muestra una alerta de inicio de sesión exitoso
              Swal.fire({
                icon: "success",
                title: `¡Bienvenido, ${userDoc.userName}! Redirigiendo a tu sesión`,
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              // Si el usuario no existe, muestra un mensaje de error
              Swal.fire({
                icon: "error",
                title: "Usuario no encontrado",
                text: "Por favor, verifique sus credenciales",
              });
            }
          }),
          catchError((error) => {
            // Maneja errores al obtener el documento de usuario
            Swal.fire({
              icon: "error",
              title: "Error al obtener los datos del usuario",
              text: error.message,
            });
            return of(null);
          })
        );
      }),
      catchError((error) => {
        // Maneja errores de inicio de sesión
        Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: error.message,
        });
        return of(null);
      })
    ).subscribe();
  };



  // Renderiza el formulario de inicio de sesión
  return (
    <>
      <div className="container mt-5">
        <div className="card">
          <div className="card-header">
            <h2 className="text-white">Ingresar a sesión</h2>
          </div>
          <div className="mt-5">
            <form onSubmit={submithandler} className="mx-5 px-5">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Ingresa tu Mail
                </label>
                <input
                  type="email"
                  className="form-control"
                  data-testid="email-input"
                  id="email"
                  aria-describedby="emailHelp"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Ingresa tu contraseña
                </label>
                <input type="password" className="form-control" id="password" data-testid="password-input"/>
              </div>
              <button type="submit" className="btn btn-primary mt-3">
                Ingresar a sesión
              </button>
            </form>
            <Link className="btn btn-success my-5" to={"/Create"}>
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;