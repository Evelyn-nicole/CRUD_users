// Importa los módulos necesarios de react y firebase
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../FireBaseConfig/FireBase";
import Swal from "sweetalert2";



// useState para almacenar y gestionar el estado de la lista de usuarios.
const Users = () => {
  const [users, setUsers] = useState([]);


  // usersCollection para acceder a la colección de users en Firestore.
  // usersCollections hace referencia a la colección de usuarios en Firestore mediante collection(db, "users").
  const usersCollections = collection(db, "users");


  // Funcion para mostar todos los usuarios
  // getDocs: Obtiene todos los documentos de la colección de usuarios.
  const getUsersCollection = async () => {
    const data = await getDocs(usersCollections);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); // Actualiza el estado de users
  };
  

  // Funcion para eliminar un producto
  // deleteDoc: Elimina el documento de usuario especificado por id.
  // para actualizar la lista de usuarios mostrada.
  const deleteUser = async (id) => {
    const userDeleteDoc = doc(db, "users", id);
    await deleteDoc(userDeleteDoc);
    getUsersCollection();  
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



  // useEffect: Llama a getUsersCollection una vez cuando el componente se monta, obtener y muestra la lista de usuarios.
  useEffect(() => {
    getUsersCollection();
  }, []);


  // Renderiza la tabla con los usuarios y opciones
  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
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
                  <th scope="col">Rol</th>
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
                    <td>{user.role}</td>
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




