import React from "react";
import { Link } from "react-router-dom";
import logonav1 from '../assets/logonav1.png';
import { getAuth, signOut } from "firebase/auth";
import Swal from "sweetalert2";
import "../Styles/Navbar.css";

const Navbar = ({ user, getUser }) => {
  const auth = getAuth();

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
    <nav className="navbar bg-dark navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <Link className="navbar-brand" to={"/"}>
          <img src={logonav1} alt="SafeTRACK" style={{ height: "40px" }} />
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

            {/* Mostrar "LOG IN" solo si no hay usuario logueado */}
            {!user && (
              <li className="nav-item m-2 mt-3">
                <Link className="text-white" to={"/login"}>
                  LOG IN
                </Link>
              </li>
            )}

            {/* Condicional para administradores */}
            {user !== null && getUser && getUser.role === "admin" && (
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
            )}

            {/* Condicional para supervisores y prevencionistas */}
            {user !== null && getUser && (getUser.role === "supervisor" || getUser.role === "prevencionista") && (
              <li className="nav-item m-2 mt-3">
                <Link className="text-white" to={`/training/${user.uid}`}>
                  MI SESION
                </Link>
              </li>
            )}

            {/* Condicional para trabajadores */}
            {user !== null && getUser && getUser.role === "trabajador" && (
              <li className="nav-item m-2 mt-3">
                <Link className="text-white" to={`/worker-training/${user.uid}`}>
                  MI SESION
                </Link>
              </li>
            )}

            {/* Mostrar el nombre del usuario y botón de cerrar sesión */}
            {user && (
              <li className="nav-item m-1">
                <div className="rounded-pill text-white bg-dark p-2">
                  {getUser ? getUser.userName : "Cargando..."}
                  <button
                    onClick={userSignOut}
                    type="button"
                    className="btn btn-danger mx-2 rounded-pill"
                  >
                    <i className="fa-solid fa-x"></i>
                  </button>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
