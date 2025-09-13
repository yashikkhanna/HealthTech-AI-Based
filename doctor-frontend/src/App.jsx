import  { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css'
import Sidebar from './components/Sidebar';
import MyDetails from './components/MyDetails';
import Login from "./Pages/Login";
import MyAppointments from "./components/MyAppointments";
import DoctorAppointments from "./components/DoctorAppointments.jsx";
import CreatePrescriptionForm from "./components/CreatePrescriptionForm.jsx";
function App() {
  const { isAuthenticated, setIsAuthenticated, doctor, setDoctor} = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/doctor/me",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
        setDoctor(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setDoctor({});
      }
    };
    fetchUser();
  }, []);


  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route 
            path="/details" 
            element={isAuthenticated ? <MyDetails /> : <Navigate to="/login" />}
          />
          <Route 
            path="/appointment" 
            element={isAuthenticated ? <MyAppointments /> : <Navigate to="/login"/>}
          />
          <Route path="/login" element={<Login />} />
          
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  )
}


export default App
