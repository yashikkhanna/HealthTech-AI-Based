import { useContext, useState } from "react";
import { Context } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const navigateTo = useNavigate();

  // Open dropdown
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close dropdown
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:4000/api/v1/user/patient/logout", {
        withCredentials: true,
      });
      toast.success("Logged out Successfully!");
      setIsAuthenticated(false);
      navigateTo("/");
    } catch (e) {
      toast.error(e.response?.data?.message || "Logout failed");
    }
    handleClose();
  };

  const goToLogin = () => {
    navigateTo("/login");
  };

  return (
    <nav className="container">
      <div className="logo">
        <img src="/logo.png" alt="logo" className="logo-img" />
      </div>

      <div className={show ? "navLinks showmenu" : "navLinks"}>
        <div className="links">
          <Link to={"/"} onClick={() => setShow(!show)}>Home</Link>
          <Link to={"/appointment"} onClick={() => setShow(!show)}>Appointment</Link>
          <Link to={"/about"} onClick={() => setShow(!show)}>About Us</Link>
          <Link to={"/donationCentersList"} onClick={()=>setShow(!show)}>Blood Donation</Link>
          <Link to={"/getBlood"} onClick={()=>setShow(!show)}>Request Blood</Link>
        </div>

        {isAuthenticated ? (
          <>
            <Avatar
              alt="User Avatar"
              sx={{ bgcolor: "#1976d2", cursor: "pointer" }}
              onClick={handleAvatarClick}
            >
              U
            </Avatar>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={() => { navigateTo("/profile"); handleClose(); }}>
                My Profile
              </MenuItem>
              <MenuItem onClick={() => { navigateTo("/prescriptions"); handleClose(); }}>
                My Prescriptions
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <button className="loginBtn btn" onClick={goToLogin}>
            LOGIN
          </button>
        )}
      </div>

      <div className="hamburger" onClick={() => setShow(!show)}>
        <GiHamburgerMenu />
      </div>
    </nav>
  );
};

export default Navbar;
