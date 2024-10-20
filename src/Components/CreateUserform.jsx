import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../Styles/CreateUserform.css';

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
    // Validaciones y lógica
  };

  const handleBack = () => {
    navigate(-1); // Redirige a la página anterior o usa navigate('/ruta') si tienes una ruta específica
  };

  return (
    <div className="createUser">
      <div className="card createUserForm">
        <div className="card-header">Crear Usuario</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={userName}
                  onChange={handleInputChange(setUserName, (value) => /^[a-zA-ZáéíóúÁÉÍÓÚ ]*$/.test(value))}
                  placeholder="Ingrese nombre (solo letras)"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  value={lastName}
                  onChange={handleInputChange(setLastName, (value) => /^[a-zA-ZáéíóúÁÉÍÓÚ ]*$/.test(value))}
                  placeholder="Ingrese apellido (solo letras)"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
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
              <div className="col-md-6 mb-3">
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
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Dirección</label>
                <input
                  type="text"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ingrese dirección"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">RUT</label>
                <input
                  type="text"
                  className="form-control"
                  value={dni}
                  onChange={handleInputChange(setDni, (value) => /^[0-9.-]*$/.test(value))}
                  placeholder="Ingrese RUT (ej: 12.345.678-9)"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">País</label>
                <input
                  type="text"
                  className="form-control"
                  value={country}
                  onChange={handleInputChange(setCountry, (value) => /^[a-zA-ZáéíóúÁÉÍÓÚ ]*$/.test(value))}
                  placeholder="Ingrese país (solo letras)"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  value={phone}
                  onChange={handleInputChange(setPhone, (value) => /^[0-9]*$/.test(value))}
                  placeholder="Ingrese número de teléfono (solo números)"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 mb-3">
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
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <button type="submit" className="btn btn-primary w-100">
                  Crear Usuario
                </button>
              </div>
              <div className="col-md-6">
                <button type="button" className="btn btn-danger w-100" onClick={handleBack}>
                  Volver
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserForm;
