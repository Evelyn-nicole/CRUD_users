import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../FireBaseConfig/FireBase';

const AccidentList = () => {
  const [accidents, setAccidents] = useState([]);

  useEffect(() => {
    const fetchAccidents = async () => {
      const accidentsCollection = collection(db, 'accident_investigations');
      const accidentSnapshot = await getDocs(accidentsCollection);
      const accidentList = accidentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAccidents(accidentList);
    };

    fetchAccidents();
  }, []);

  return (
    <div className="accident-list">
      <h2>Listado de Accidentes</h2>
      {accidents.length > 0 ? (
        <ul>
          {accidents.map(accident => (
            <li key={accident.id}>
              <strong>{accident.date}</strong> - {accident.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay accidentes registrados.</p>
      )}
    </div>
  );
};

export default AccidentList;
