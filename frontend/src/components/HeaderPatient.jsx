import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "../assets/css/HeaderPatient.css";
import logo from "../assets/images/logo.png";

const HeaderPatient = () => {
  const [isLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const user = useMemo(() => ({ name: "John Doe", role: "Admin" }), []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="HealthEase Logo" />
      </div>

      <div
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={toggleMenu}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        {!isLoggedIn ? (
          <>
            <div className="login-btns">
              <button className="login-btn">Login</button>
              <button className="register-btn">Register</button>
            </div>
          </>
        ) : (
          <>
            <nav>
              <Link to="/home">Home</Link>
              <Link to="/book-test">Book Test</Link>
              <Link to="/book-doctor">Book Doctor</Link>
            </nav>
            <div className="user-info">
              <img src="/path-to-avatar-image" alt="avatar" />
              <span>{user.name}</span>
              <span>{user.role}</span>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default HeaderPatient;
