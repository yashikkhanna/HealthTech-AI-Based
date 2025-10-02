import "./App.css";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Appointment from "./pages/Appointment";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useContext, useEffect } from "react";
import axios from "axios";
import { Context } from "./main";
import DonationCentersList from "./Pages/DonationCentersList";
import CreatePrescriptionForm from "./components/CreatePrescriptionForm";
import DonationRequestForm from "./components/DonationRequestForm";
import CompatibleDonors from "./components/CompatibleDonors";
// import Chatbot from "./pages/Chatbot";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/patient/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
        toast.error("Failed to fetch user. Please log in.");
      }
    };
    fetchUser();
  }, []); // Only run once on component mount

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/appointment" 
            element={isAuthenticated ? <Appointment /> : <Navigate to="/login" />}
          />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/donationCentersList" element={isAuthenticated ? <DonationCentersList /> : <Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/prescriptions" element={<CreatePrescriptionForm/>}/>
          <Route path="/getBlood" element={<CompatibleDonors/>}/>
          {/* <Route path="/chatbot" element={<Chatbot/>}/> */}
        </Routes>
        <Footer />
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
}

export default App;