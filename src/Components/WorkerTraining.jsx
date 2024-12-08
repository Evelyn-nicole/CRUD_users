import React, { useState, useEffect } from "react";
import { doc, getDoc, collection, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../FireBaseConfig/FireBase";
import { useParams } from "react-router-dom";
import imagePerfil from "../assets/perfil.png";
import '../Styles/WorkerTraining.css';

const WorkerTraining = () => {
  const { id: userId } = useParams(); 
  const [user, setUser] = useState(null); 
  const [trainings, setTrainings] = useState([]); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = doc(db, `users/${userId}`); 
        const userSnapshot = await getDoc(userDoc); 
        if (userSnapshot.exists()) {
          setUser(userSnapshot.data()); 
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (userId) {
      fetchUser(); 
    }
  }, [userId]);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const trainingsCollection = collection(db, "training"); 
        const trainingSnapshot = await getDocs(trainingsCollection);
        const trainingList = trainingSnapshot.docs.map((doc) => {
          const trainingData = doc.data();
          const isEnrolled = trainingData.enrolledUsers && trainingData.enrolledUsers.includes(userId);
          return {
            id: doc.id,
            ...trainingData,
            isEnrolled
          };
        });
        console.log("Trainings fetched in WorkerTraining:", trainingList); 
        setTrainings(trainingList); 
      } catch (error) {
        console.error("Error fetching trainings:", error);
      }
    };

    fetchTrainings();
  }, [userId]);

  const handleEnroll = async (trainingId) => {
    try {
      const userDocRef = doc(db, `users/${userId}`);
      const trainingDocRef = doc(db, `training`, trainingId);

      await updateDoc(userDocRef, {
        enrolledTrainings: arrayUnion(trainingId),
      });

      await updateDoc(trainingDocRef, {
        enrolledUsers: arrayUnion(userId),
      });

      setTrainings((prevTrainings) =>
        prevTrainings.map((training) =>
          training.id === trainingId
            ? { ...training, isEnrolled: true }
            : training
        )
      );

      console.log(`Trabajador ${userId} inscrito en la capacitación ${trainingId}`);
    } catch (error) {
      console.error("Error enrolling in training:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <div className="worker-background">
      <div className="worker-content">
        {/* Sección de datos personales */}
        <div className="card worker-card">
          <img src={imagePerfil} alt="Perfil" className="worker-img-perfil" />
          <div className="card-body">
            <h5 className="card-title worker-card-title">
              {capitalizeFirstLetter(user.userName)} {capitalizeFirstLetter(user.lastName)}
            </h5>
            <p className="worker-card-text">Email: {user.email}</p>
            <p className="worker-card-text">Address: {capitalizeFirstLetter(user.address)}</p>
            <p className="worker-card-text">DNI: {user.dni}</p>
            <p className="worker-card-text">Country: {capitalizeFirstLetter(user.country)}</p>
            <p className="worker-card-text">Phone: {user.phone}</p>
            <p className="worker-card-text">Rol: {capitalizeFirstLetter(user.role)}</p>
          </div>
        </div>

        {/* Sección para mostrar las capacitaciones */}
        <div className="worker-trainings-section">
          <h3 className="worker-trainings-title">Capacitaciones Disponibles</h3>
          <div className="worker-trainings-container">
            {trainings.length > 0 ? (
              trainings.map((training) => (
                <div key={training.id} className="worker-training-item">
                  <h5 className="training-title">{capitalizeFirstLetter(training.title)}</h5>
                  <p className="training-description">{capitalizeFirstLetter(training.description)}</p>
                  <button
                    className={`enroll-button ${training.isEnrolled ? 'enrolled' : ''}`}
                    onClick={() => !training.isEnrolled && handleEnroll(training.id)}
                    disabled={training.isEnrolled}
                  >
                    {training.isEnrolled ? "Inscrito" : "Inscribirse"}
                  </button>
                </div>
              ))
            ) : (
              <p className="no-trainings">No hay capacitaciones disponibles.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerTraining;
