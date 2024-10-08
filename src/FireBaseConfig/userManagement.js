import { auth, db } from './FireBase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useActionData } from 'react-router-dom';

// Crear usuario en Firebase Authentication y almacenar datos en Firestore
const createUser = async (email, password, userData) => {
  try {
    // Crear el usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('Usuario creado en Firebase Authentication:', user.uid);

    // Guardar los datos adicionales en Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      userName: userData.userName,
      lastName: userData.lastName,
      password: userData.password,
      address: userData.address,
      dni: userData.dni,
      country: userData.country,
      phone: userData.phone,
      role: userData.role,
      created_at: new Date(),
    });

    console.log('Datos adicionales guardados en Firestore para el UID:', user.uid);
    return true;  // Devolver éxito
  } catch (error) {
    console.error('Error creando usuario:', error);
    throw error;  // Lanzar el error para manejarlo en el frontend
  }
};

export { createUser };
