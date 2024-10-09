import React from "react"; 
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Importa funciones de autenticación de Firebase.
import { Link, useNavigate } from "react-router-dom"; // Importa hooks y componentes de navegación de react-router-dom.
import { app } from "../FireBaseConfig/FireBase"; // Importa la configuración de Firebase.
import { doc, getDoc, getFirestore } from "firebase/firestore"; // Importa funciones de Firestore.
import Swal from "sweetalert2";


// Iniciliza las Instancias de Firestore y Auth
const firestore = getFirestore(app);
const auth = getAuth(app);


// Define el componente Login.
const Login = () => {
  const navigate = useNavigate(); // Hook para redireccionar a diferentes rutas.


   // Función para manejar el envío del formulario de inicio de sesión.
  const submithandler = async (e) => {
    e.preventDefault(); // Previene la recarga de la página al enviar el formulario.

    
    // Obtiene el email y la contraseña de los elementos del formulario.
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;


    // Inicia sesión con Firebase Authentication.
    try {
      await signInWithEmailAndPassword(auth, email, password); // Obtiene el UID del usuario autenticado.
      const userId = auth.currentUser.uid;  // Referencia al documento del usuario en Firestore.
      const docRef = doc(firestore, `users/${userId}`); // Obtiene el documento del usuario.
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userDoc = docSnap.data(); // Obtiene los datos del documento.
        const role = userDoc.role; // Obtiene el rol del usuario.

        if (role === "admin") {
          navigate("/users");
        } else {
          navigate(`/training/${userId}`);
        }

        Swal.fire({
          icon: "success",
          title: `¡Bienvenido, ${userDoc.userName}! Redirigiendo a tu sesión`,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Usuario no encontrado",
          text: "Por favor, verifique sus credenciales",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: error.message,
      });
    }
  };

  // Renderiza el formulario de inicio de sesión
  return (
    <>
      <div className="title-login mt-5 mb-3">
        <h1>INICIO DE SESION</h1>
      </div>
      <div className="login-page">
        <div className="login-background mt-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-sm-12 col-md-10 col-lg-8 col-xl-6">
                <div className="card login-style">
                  <div className="card-body">
                    <form onSubmit={submithandler} className="mx-4 px-4">
                      <div className="mb-5">
                        <label
                          htmlFor="email"
                          className="form-label text-black"
                        >
                          Ingresa tu Email
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
                        <label
                          htmlFor="password"
                          className="form-label text-black"
                        >
                          Ingresa tu Clave
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          data-testid="password-input"
                        />
                      </div>
                      <button type="submit" className="btn btn-sesion mt-5 w-100">
                        Aceptar
                      </button>
                    </form>
                    {/* <div className="text-center mt-3">
                      <a href="#" className="text-white">
                        Forgot password?
                      </a>
                    </div> */}
                    <div className="text-center mt-3">
                      {/* <Link className="text-black" to={"/Create"}>
                        ¿No tienes una cuenta? Registrate
                      </Link> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

// Gestiona el inicio de sesión de usuarios utilizando Firebase Authentication y Firestore. Utiliza RxJS para manejar operaciones asincrónicas y SweetAlert2 para alertas.
// submithandlerManeja el envío del formulario de inicio de sesión.Usa RxJS para iniciar sesión con Firebase Auth y obtener el documento de usuario de Firestore.
// Redirige al usuario según su rol (admin o user)
