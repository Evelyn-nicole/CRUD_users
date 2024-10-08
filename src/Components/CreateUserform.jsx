import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const CreateUserForm = () => {
  const [userName, setUserName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [dni, setDni] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('trabajador');
  const auth = getAuth();
  const firestore = getFirestore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const admin = auth.currentUser; // Obtener la cuenta del admin actual
    if (!admin) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El administrador no está autenticado.',
      });
      return;
    }

    // Guardar las credenciales del administrador para reautenticación posterior
    const adminEmail = admin.email;
    const adminPassword = window.prompt("Introduce la contraseña del administrador para continuar:");
    const adminCredential = EmailAuthProvider.credential(adminEmail, adminPassword);

    try {
      // Crear el nuevo usuario
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Guardar información adicional en Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        userName,
        lastName,
        password,
        email,
        address,
        dni,
        country,
        phone,
        role,
        created_at: new Date(),
      });

      Swal.fire({
        icon: 'success',
        title: 'Usuario creado exitosamente',
        showConfirmButton: false,
        timer: 1500,
      });

      // Reautenticar al administrador
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);

      // Redirigir a la vista de usuarios
      navigate('/users'); // Cambia '/users' por la ruta correspondiente a la vista de administración de usuarios

      // Limpiar los campos
      setUserName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setAddress('');
      setDni('');
      setCountry('');
      setPhone('');
      setRole('trabajador');
    } catch (error) {
      console.error('Error al crear el usuario o reautenticar al administrador:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  };

  return (
    <div className="createUser">
      <div className="card editUser">
        <div className="card-header">Crear Usuario</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Apellido</label>
              <input
                type="text"
                className="form-control"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">DNI/RUT</label>
              <input
                type="text"
                className="form-control"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">País</label>
              <input
                type="text"
                className="form-control"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Rol</label>
              <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="trabajador">Trabajador</option>
                <option value="supervisor">Supervisor</option>
                <option value="prevencionista">Prevencionista de riesgo</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Crear Usuario
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserForm;
