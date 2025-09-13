import React, { useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  FaUserMd,
  FaCalendarCheck,
  FaClock,
  FaNotesMedical,
  FaComments,
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaSignInAlt
} from "react-icons/fa";
import axios from "axios";
import { Context } from "../main"; // using the same context as App
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { isAuthenticated, setIsAuthenticated, doctor } = useContext(Context);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const iconStyle = { height: "4vh", width: "4vh" };
   const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:4000/api/v1/user/doctor/logout", { withCredentials: true });
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      {/* Header */}
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={toggleSidebar}>
          ☰
        </button>
        {isOpen && doctor?.name && <h3>{doctor.name}</h3>}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item">
          <FaHome style={iconStyle} />
          {isOpen && <span>Dashboard</span>}
        </NavLink>
        <NavLink to="/availability" className="nav-item">
          <FaClock style={iconStyle} />
          {isOpen && <span>My Availability</span>}
        </NavLink>
        <NavLink to="/details" className="nav-item">
          <FaUserMd style={iconStyle} />
          {isOpen && <span>My Details</span>}
        </NavLink>
        <NavLink to="/appointment" className="nav-item">
          <FaCalendarCheck style={iconStyle} />
          {isOpen && <span>Appointments</span>}
        </NavLink>
        <NavLink to="/prescriptions" className="nav-item">
          <FaNotesMedical style={iconStyle} />
          {isOpen && <span>Prescriptions</span>}
        </NavLink>
        <NavLink to="/messages" className="nav-item">
          <FaComments style={iconStyle} />
          {isOpen && <span>Messages</span>}
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {isAuthenticated ? (
          <>
            <NavLink to="/settings" className="nav-item">
              <FaCog style={iconStyle} />
              {isOpen && <span>Settings</span>}
            </NavLink>
            <button onClick={handleLogout} className="nav-item logout">
              <FaSignOutAlt style={{ ...iconStyle, color: "red" }} />
              {isOpen && <span>Logout</span>}
            </button>
          </>
        ) : (
          <NavLink to="/login" className="nav-item">
            <FaSignInAlt style={iconStyle} />
            {isOpen && <span>Login</span>}
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
