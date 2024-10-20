import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { app } from "./FireBaseConfig/FireBase";
import { useState, useEffect } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import Users from "./Components/Users";
import Edit from "./Components/Edit";
import Home from "./Components/Home";
import Login from "./Components/Login";
import CreateUserForm from "./Components/CreateUserform";
import ViewTrainings from "./Components/ViewTrainings";
import WorkerTraining from "./Components/WorkerTraining";
import Training from "./Components/Training";
import CreateTraining from "./Components/CreateTraining";
import EditTraining from "./Components/EditTraining";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import AccidentInvestigation from './Components/AccidentInvestigation';
import AccidentList from './Components/AccidentList';


// Inicializa Firestore y Auth
const firestore = getFirestore(app);
const auth = getAuth(app);

const App = () => {
  const [user, setUser] = useState(null);
  const [getUser, setGetUser] = useState(null);

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

  if (!getUser && user) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar user={user} getUser={getUser} /> {/* Utiliza el componente Navbar */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<Users />} />
            <Route path="/create" element={<CreateUserForm />} />
            <Route path="/training/:id" element={<Training />} />
            <Route path="/worker-training/:id" element={<WorkerTraining />} />
            <Route path="/create-training/:id" element={<CreateTraining />} />
            <Route path="/view-trainings/:id" element={<ViewTrainings />} />
            <Route path="/accident-investigation/:id" element={<AccidentInvestigation />} />
            <Route path="/view-accidents/:id" element={<AccidentList />} />
            <Route path="/edit-training/:trainingId" element={<EditTraining />} />
            <Route path="/edit/:id" element={<Edit />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
