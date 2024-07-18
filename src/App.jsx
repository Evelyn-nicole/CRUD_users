import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Users from "./Components/Users";
import Edit from "./Components/Edit";
import Home from "./Components/Home";
import Login from "./Components/Login";
import CreateUser from "./Components/CreateUser";
import ViewTrainings from "./Components/ViewTrainings";
import Training from "./Components/Trainig";
import CreateTraining from "./Components/CreateTraining";
import EditTraining from "./Components/EditTraining";
import Footer from "./Components/Footer";
import { getAuth, signOut } from "firebase/auth";
import { app } from "./FireBaseConfig/FireBase";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import "./styles.css";
import logo from './assets/logoCental.png'


// Inicializa Firestore con la configuración de Firebase (app). lo asigna a la variable firestore.
// Inicializa la autenticación de Firebase con la configuración de Firebase (app). Lo asigna a la variable auth.
const firestore = getFirestore(app);
const auth = getAuth(app);


const App = () => {
  const [user, setUser] = useState(null);
  const [getUser, setGetUser] = useState("");


  // Hook de efecto que se ejecuta cuando el componente se monta. 
  // Se suscribe a los cambios de autenticación y actualiza el estado user cuando cambia el estado de autenticación
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);



  // Funcion de cierre de sesion. 
  // useEffect sHook de efecto que se ejecuta cuando el estado user cambia.
  useEffect(() => {
    if (user) {                                               // Si hay un usuario autenticado ejecuta la función fetchUserName
      const fetchUserName = async () => {
        const docRef = doc(firestore, `users/${user.uid}`);
        const docSnap = await getDoc(docRef);                // Obtiene el documento del usuario desde Firestore.
        if (docSnap.exists()) {                              // Si el documento del usuario existe, actualiza el estado getUser con los datos del documento.
          setGetUser(docSnap.data());
        }
      };
      fetchUserName();
    }
  }, [user]);



  // userSignOut para manejar el cierre de sesión del usuario.
  const userSignOut = () => {
    Swal.fire({
      icon: "success",
      title: "Sesión terminada",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      signOut(auth).then(() => {
        window.location.href = "/"; 
      });
    });
  };

  return (
    <>
      <BrowserRouter>
        <div className="App">
          <nav
            className="navbar bg-dark navbar-expand-lg bg-body-tertiary"
            data-bs-theme="dark"
          >
            <div className="container">
              <Link className="navbar-brand" to={"/"}>
                <img
                  src={logo}
                  alt="SafeTRACK"
                  style={{ height: "50px" }} // Ajusta el tamaño según sea necesario
                />
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item m-2 mt-3">
                    <Link className="text-white" to={"/"}>
                      Home
                    </Link>
                  </li>
                  <li className="nav-item m-2 mt-3">
                    <Link className="text-white" to={"/login"}>
                      Log In
                    </Link>
                  </li>
                  {user !== null && getUser.role === "admin" ? (
                    <li className="nav-item m-2 mt-3">
                      <Link className="text-white" to={"/users"}>
                        Usuarios
                      </Link>
                    </li>
                  ) : null}
                  {user !== null && getUser.role === "user" ? (
                    <li className="nav-item m-2 mt-3">
                      <Link className="text-white" to={`/training/${user.uid}`}>
                        Mi sesión
                      </Link>
                    </li>
                  ) : null}
                  {user ? (
                    <li className="nav-item m-1">
                      <div className="rounded-pill text-white bg-dark p-2">
                        {getUser.userName}
                        <button
                          onClick={() => userSignOut()}
                          type="button"
                          className="btn btn-danger mx-2 rounded-pill"
                        >
                          <i className="fa-solid fa-x"></i>
                        </button>
                      </div>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          </nav>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/users" element={<Users />} />
              <Route path="/create" element={<CreateUser />} />
              <Route path="/training/:id" element={<Training />} />
              <Route path="/create-training/:id" element={<CreateTraining />} />
              <Route path="/view-trainings/:id" element={<ViewTrainings />} />
              <Route
                path="/edit-training/:trainingId"
                element={<EditTraining />}
              />
              <Route path="/edit/:id" element={<Edit />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
// El unSuscribe se asegura de que el estado de autenticación del usuario esté siempre actualizado en tu aplicación. 
// Cada vez que el usuario inicia o cierra sesión, el estado user en tu componente se actualiza en consecuencia. 
// La función de limpieza (unsubscribe) se asegura de que se elimine el observador cuando el componente se desmonta, lo que ayuda a 
// mantener la aplicación eficiente y libre de fugas de memoria.