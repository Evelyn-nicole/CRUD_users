import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Users from "./Components/Users";
import Edit from "./Components/Edit";
import Home from "./Components/Home";
import Login from "./Components/Login";
import CreateUserForm from "./Components/CreateUserform";  // Cambiado para usar el nuevo formulario
import ViewTrainings from "./Components/ViewTrainings";
import WorkerTraining from "./Components/WorkerTraining";
import Training from "./Components/Training";
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
import AccidentInvestigation from './Components/AccidentInvestigation';
import AccidentList from './Components/AccidentList';






// Inicializa Firestore con la configuración de Firebase (app). lo asigna a la variable firestore.
// Inicializa la autenticación de Firebase con la configuración de Firebase (app). Lo asigna a la variable auth.
const firestore = getFirestore(app);
const auth = getAuth(app);


const App = () => {
  const [user, setUser] = useState(null);
  const [getUser, setGetUser] = useState(null);  // Inicialmente null

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUserName = async () => {
        const docRef = doc(firestore, `users/${user.uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGetUser(docSnap.data());  // Actualiza solo si hay datos
        }
      };
      fetchUserName();
    }
  }, [user]);

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

  // Verifica si `getUser` está listo antes de renderizar
  if (!getUser && user) {
    return <div>Loading...</div>;  // Muestra un mensaje de carga mientras se obtienen los datos
  }

  return (
    <BrowserRouter>
      <div className="App">
        <nav className="navbar bg-dark navbar-expand-lg bg-body-tertiary">
  <div className="container">
    <Link className="navbar-brand" to={"/"}>
      <img src={logo} alt="SafeTRACK" style={{ height: "55px" }} />
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
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        <li className="nav-item m-2 mt-3">
          <Link className="text-white" to={"/"}>
            HOME
          </Link>
        </li>
        <li className="nav-item m-2 mt-3">
          <Link className="text-white" to={"/login"}>
            LOG IN
          </Link>
        </li>

        {/* Condicional para administradores */}
        {user !== null && getUser && getUser.role === "admin" ? (
          <>
            <li className="nav-item m-2 mt-3">
              <Link className="text-white" to={"/users"}>
                USUARIOS
              </Link>
            </li>
            <li className="nav-item m-2 mt-3">
              <Link className="text-white" to={"/create"}>
                CREAR USUARIO
              </Link>
            </li>
          </>
        ) : null}

        {/* Condicional para supervisores y prevencionistas */}
        {user !== null && getUser && (getUser.role === "supervisor" || getUser.role === "prevencionista") ? (
          <li className="nav-item m-2 mt-3">
            <Link className="text-white" to={`/training/${user.uid}`}>
              MI SESION
            </Link>
          </li>
        ) : null}

        {/* Condicional para trabajadores */}
        {user !== null && getUser && getUser.role === "trabajador" ? (
          <li className="nav-item m-2 mt-3">
            <Link className="text-white" to={`/worker-training/${user.uid}`}>
              MI SESION
            </Link>
          </li>
        ) : null}

        {/* Mostrar el nombre del usuario y botón de cerrar sesión */}
        {user ? (
          <li className="nav-item m-1">
            <div className="rounded-pill text-white bg-dark p-2">
              {getUser ? getUser.userName : 'Cargando...'}
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
            <Route path="/create" element={<CreateUserForm />} />
            <Route path="/training/:id" element={<Training />} />
            <Route path="/worker-training/:id" element={<WorkerTraining />} />
            <Route path="/create-training/:id" element={<CreateTraining />} />
            <Route path="/view-trainings/:id" element={<ViewTrainings />} />
            <Route path="/accident-investigation/:id" element={<AccidentInvestigation />} />
            <Route path="/view-accidents/:id" element={<AccidentList />} />
            <Route path="/edit-training/:trainingId" element={<EditTraining />} />
            <Route path="/edit/:id" element={<Edit />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
