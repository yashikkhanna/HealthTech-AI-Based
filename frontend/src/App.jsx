import "./App.css";
import { useContext, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Context } from "./main";

const App = () => {
  const { setIsAuthenticated, setUser } = useContext(Context);

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
  }, []);

  return (
    <>
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
