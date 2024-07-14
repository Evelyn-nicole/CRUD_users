// Importa los módulos necesarios de react y firebase
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../FireBaseConfig/FireBase";
import Swal from "sweetalert2";


// Configuracion de hooks
// useState para almacenar y gestionar el estado de la lista de usuarios.
const Users = () => {
  const [users, setUsers] = useState([]);


  // usersCollection para acceder a la colección de usuarios en Firestore.
  // usersCollections como una referencia a la colección de usuarios en Firestore mediante collection(db, "users").
  const usersCollections = collection(db, "users");


  // Funcion para mostar todos los usuarios
  // getDocs: Obtiene todos los documentos de la colección de usuarios.
  const getUsersCollection = async () => {
    const data = await getDocs(usersCollections);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); // Actualiza el estado de users
  };
  

  // Funcion para eliminar un producto
  // deleteDoc: Elimina el documento de usuario especificado por id.
  // getUsersCollection: Actualiza la lista de usuarios después de eliminar uno.
  const deleteUser = async (id) => {
    const userDeleteDoc = doc(db, "users", id);
    await deleteDoc(userDeleteDoc);
    getUsersCollection();  // para actualizar la lista de usuarios mostrada.
  };


  // Alerta de borrado exitoso
  const confirmDelete = (id) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "Precaución, esta acción borrara el registro",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(id);
        Swal.fire({
          title: "¡Borrado!",
          text: "El usuario ha sido eliminado",
          icon: "success",
        });
      }
    });
  };


  //Uso de useeffect
  // useEffect: Llama a getUsersCollection una vez cuando el componente se monta para obtener y mostrar la lista de usuarios.
  useEffect(() => {
    getUsersCollection();
  }, []);


  // Renderiza la tabla con los usuarios y opciones
  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col">
            <div className="d-grid gap-2"></div>
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Apellido</th>
                  <th scope="col">Mail</th>
                  <th scope="col">Rut</th>
                  <th scope="col">Pais</th>
                  <th scope="col">Telefono</th>
                  <th scope="col">Editar</th>
                  <th scope="col">Borrar</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.userName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.dni}</td>
                    <td>{user.country}</td>
                    <td>{user.phone}</td>
                    <td>
                      <Link to={`/edit/${user.id}`} className="btn btn-success">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </Link>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          confirmDelete(user.id);
                        }}
                        className="btn btn-danger"
                        data-testid={`delete-button-${user.id}`}
                      >

                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;

// Muestra una lista de usuarios almacenados en Firestore.
// Utiliza useState y useEffect para gestionar el estado de los usuarios y cargar la lista al inicio.
// Ofrece la funcionalidad de eliminar usuarios con una confirmación mediante SweetAlert2.
// Proporciona enlaces para editar usuarios individuales (Editar) y botones para eliminar usuarios (Eliminar).



