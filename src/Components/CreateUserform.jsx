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
  const [role, setRole] = useState('');
  const auth = getAuth();
  const firestore = getFirestore();
  const navigate = useNavigate();

  const handleInputChange = (setter, validation) => (e) => {
    const { value } = e.target;
    if (validation(value)) {
      setter(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (!userName || !lastName || !email || !password || !dni || !country || !phone || !role) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son obligatorios. Por favor, complétalos.',
      });
      return;
    }

    const admin = auth.currentUser;
    if (!admin) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El administrador no está autenticado.',
      });
      return;
    }

    // Solicitar la contraseña del administrador para la verificación
    const adminEmail = admin.email;
    const adminPassword = window.prompt("Introduce la contraseña del administrador para continuar:");

    // Si la contraseña del administrador no se ingresa, no se procede
    if (!adminPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Es necesario ingresar la contraseña del administrador para continuar.',
      });
      return;
    }

    try {
      // Verificar la autenticación del administrador
      const adminCredential = EmailAuthProvider.credential(adminEmail, adminPassword);
      await reauthenticateWithCredential(admin, adminCredential);

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
      navigate('/users');

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
                onChange={handleInputChange(setUserName, (value) => /^[a-zA-ZáéíóúÁÉÍÓÚ ]*$/.test(value))}
                placeholder="Ingrese nombre (solo letras)"
                pattern="[a-zA-ZáéíóúÁÉÍÓÚ ]+"
                title="El nombre solo debe contener letras."
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Apellido</label>
              <input
                type="text"
                className="form-control"
                value={lastName}
                onChange={handleInputChange(setLastName, (value) => /^[a-zA-ZáéíóúÁÉÍÓÚ ]*$/.test(value))}
                placeholder="Ingrese apellido (solo letras)"
                pattern="[a-zA-ZáéíóúÁÉÍÓÚ ]+"
                title="El apellido solo debe contener letras."
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
                placeholder="Ingrese correo electrónico"
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
                placeholder="Ingrese contraseña"
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
                placeholder="Ingrese dirección"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">RUT</label>
              <input
                type="text"
                className="form-control"
                value={dni}
                onChange={handleInputChange(setDni, (value) => /^[0-9.-]*$/.test(value))}
                placeholder="Ingrese RUT (ej: 12.345.678-9)"
                pattern="[0-9.-]+"
                title="El RUT solo debe contener números, puntos y guiones."
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">País</label>
              <input
                type="text"
                className="form-control"
                value={country}
                onChange={handleInputChange(setCountry, (value) => /^[a-zA-ZáéíóúÁÉÍÓÚ ]*$/.test(value))}
                placeholder="Ingrese país (solo letras)"
                pattern="[a-zA-ZáéíóúÁÉÍÓÚ ]+"
                title="El país solo debe contener letras."
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                className="form-control"
                value={phone}
                onChange={handleInputChange(setPhone, (value) => /^[0-9]*$/.test(value))}
                placeholder="Ingrese número de teléfono (solo números)"
                pattern="[0-9]+"
                title="El número de teléfono solo debe contener números."
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Rol</label>
              <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="" disabled>
                  Seleccione un rol
                </option>
                <option value="prevencionista">Prevencionista de riesgo</option>
                <option value="supervisor">Supervisor</option>
                <option value="trabajador">Trabajador</option>
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
