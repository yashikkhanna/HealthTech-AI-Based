import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const hours = [
    {
      id: 1,
      day: "Mon-Sat",
      time: "10:00 AM - 11:00 PM",
    },
    {
      id: 2,
      day: "Sunday",
      time: "10:00 AM - 11:00 PM",
    },
  ];

  return (
    <>
      <footer className={"container"}>
        <hr />
        <div className="content">
          <div>
            <img src="/logo.png" alt="logo" className="logo-img" />
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <Link to={"/"}>Home</Link>
              <Link to={"/appointment"}>Appointment</Link>
              <Link to={"/about"}>About</Link>
            </ul>
          </div>
          <div>
            <h4>Hours</h4>
            <ul>
              {hours.map((element) => (
                <li key={element.id}>
                  <span>{element.day}</span>
                  <span>{element.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Developed By</h4>
            <div style={{ marginBottom: "1rem" }}>
              <p>Sanya Batra</p>
              <a
                href="https://www.linkedin.com/in/sanya-batra-51b974283/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin size={24} color="#0A66C2" />
              </a>
            </div>
            <div>
              <p>Yashik Khanna</p>
              <a
                href="https://www.linkedin.com/in/yashik-khanna-453448216/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin size={24} color="#0A66C2" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
