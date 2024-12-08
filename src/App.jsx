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
import CreateMiper from './Components/CreateMiper';
import ViewMiper from './Components/ViewMiper';
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import NotFound from "./Components/NotFound";


// Inicializa Firestore y Auth
const firestore = getFirestore(app);
const auth = getAuth(app);

const App = () => {
  const [user, setUser] = useState(null); // Usuario autenticado
  const [getUser, setGetUser] = useState(null); // Datos del usuario desde Firestore
  const [loading, setLoading] = useState(true); // Indicador de carga

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setGetUser(null);
        setLoading(false); // Deja de cargar si no hay usuario
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUser = async () => {
        try {
          const docRef = doc(firestore, `users/${user.uid}`);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setGetUser(docSnap.data());
          } else {
            console.error("No user data found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false); // Deja de cargar al finalizar la consulta
        }
      };
      fetchUser();
    }
  }, [user]);

  // Mostrar un mensaje de carga mientras se obtienen los datos del usuario
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar user={user} getUser={getUser} /> {/* Utiliza el componente Navbar */}
        <div className="content">

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login"
              element={
                <PublicRoute user={user}>
                  <Login />
                </PublicRoute>
              }
            />
            <Route path="/" element={<Home />} />


            <Route path="/users"
              element={
                <ProtectedRoute
                  user={user}
                  getUser={getUser}
                  allowedRoles={["admin"]}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route path="/create"
              element={
                <ProtectedRoute user={user} getUser={getUser} allowedRoles={["admin"]}>
                  <CreateUserForm />
                </ProtectedRoute>
              }
            />
            <Route path="/training/:id"
              element={
                <ProtectedRoute user={user} getUser={getUser} allowedRoles={["supervisor", "prevencionista"]}>
                  <Training />
                </ProtectedRoute>
              }
            />
            <Route path="/worker-training/:id"
              element={
                <ProtectedRoute user={user} getUser={getUser} allowedRoles={["trabajador"]}>
                  <WorkerTraining />
                </ProtectedRoute>
              }
            />
            <Route path="/create-training/:id"
              element={
                <ProtectedRoute user={user} getUser={getUser} allowedRoles={["supervisor", "prevencionista"]}>
                  <CreateTraining />
                </ProtectedRoute>
              }
            />
            <Route path="/view-trainings/:id"
              element={
                <ProtectedRoute user={user} getUser={getUser} allowedRoles={["supervisor", "prevencionista"]}>
                  <ViewTrainings />
                </ProtectedRoute>
              }
            />
            <Route path="/accident-investigation/:id"
              element={
                <ProtectedRoute user={user} getUser={getUser} allowedRoles={["supervisor", "prevencionista"]}>
                  <AccidentInvestigation />
                </ProtectedRoute>
              }
            />
            <Route path="/view-accidents/:id"
              element={
                <ProtectedRoute user={user} getUser={getUser} allowedRoles={["supervisor", "prevencionista"]}>
                  <AccidentList />
                </ProtectedRoute>
              }
            />
            <Route path="/edit-training/:trainingId"
              element={
                <ProtectedRoute user={user} getUser={getUser} allowedRoles={["supervisor", "prevencionista"]}>
                  <EditTraining />
                </ProtectedRoute>
              }
            />
            <Route path="/edit/:id"
              element={
                <ProtectedRoute user={user} getUser={getUser} allowedRoles={["admin"]}>
                  <Edit />
                </ProtectedRoute>
              }
            />
            <Route path="/create-miper/:id"
              element={
                <ProtectedRoute user={user} getUser={getUser} allowedRoles={["prevencionista"]}>
                  <CreateMiper />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-miper/:id"
              element={
                <ProtectedRoute user={user} getUser={getUser} allowedRoles={["prevencionista", "supervisor"]}>
                  <ViewMiper user={user} getUser={getUser} />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
