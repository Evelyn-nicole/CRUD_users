import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Users from "./Components/Users";
import Edit from "./Components/Edit";
import Home from "./Components/Home";
import Login from "./Components/Login";
import CreateUser from "./Components/CreateUser";
import { getAuth, signOut } from "firebase/auth";
import { app } from "./FireBaseConfig/FireBase";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";


const firestore = getFirestore(app);
const auth = getAuth(app);
const App = () => {
  const [user, setUser] = useState(null);
  const [getUser, setGetUser] = useState("");

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
          setGetUser(docSnap.data());
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
        window.location.href = "/"; // Redirige al usuario a la página de inicio
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
              <Link className="text-white" to={"/"}>
              Home
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
                    <Link className="text-white" to={"/"}>Home</Link>
                  </li>
                  <li className="nav-item m-2 mt-3">
                    <Link className="text-white"  to={"/login"}>Log In</Link>
                  </li>
                  {user !== null && getUser.role === "admin" ? (
                    <li className="nav-item m-2 mt-3">
                      <Link className="text-white"  to={"/users"}>Usuarios</Link>
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<Users />} />
            <Route path="/create" element={<CreateUser />} />
            <Route path="/edit/:id" element={<Edit />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;