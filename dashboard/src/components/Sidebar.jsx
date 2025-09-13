import React, { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [show, setShow] = useState(false);

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/user/admin/logout", {
        withCredentials: true,
      });
  
      // Show the toast with the message from the backend
      toast.success(response.data.message); // Use response.data.message
  
      // Set isAuthenticated to false after a short delay
      setTimeout(() => {
        setIsAuthenticated(false);
      }, 100); // Short delay to allow toast display
    } catch (error) {
      // Handle errors
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const gotoHomePage = () => {
    navigateTo("/");
    setShow(!show);
  };

  const gotoDoctorsPage = () => {
    navigateTo("/doctors");
    setShow(!show);
  };

  const gotoMessagesPage = () => {
    navigateTo("/messages");
    setShow(!show);
  };

  const gotoAddNewDoctor = () => {
    navigateTo("/doctor/addnew");
    setShow(!show);
  };

  const gotoAddNewAdmin = () => {
    navigateTo("/admin/addnew");
    setShow(!show);
  };

  return (
    <>
      <nav
        // Use visibility: hidden instead of display: none to keep the component mounted
        style={isAuthenticated ? { visibility: "visible" } : { visibility: "hidden" }}
        className={show ? "show sidebar" : "sidebar"}
      >
        <div className="links">
          <TiHome onClick={gotoHomePage} />
          <FaUserDoctor onClick={gotoDoctorsPage} />
          <MdAddModerator onClick={gotoAddNewAdmin} />
          <IoPersonAddSharp onClick={gotoAddNewDoctor} />
          <AiFillMessage onClick={gotoMessagesPage} />
          <RiLogoutBoxFill onClick={handleLogout} />
        </div>
      </nav>
      <div
        className="wrapper"
        style={isAuthenticated ? { visibility: "visible" } : { visibility: "hidden" }}
      >
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </div>
    </>
  );
};

export default Sidebar;
