import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/HeaderPatient.css";
import logo from "../assets/images/logo.png";
import { useAuth } from "../components/authentication/AuthContext.jsx";

const HeaderPatient = () => {
  const [isLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const user = useMemo(() => ({ name: "John Doe", role: "Admin" }), []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate("/login"); // Redirect to /login after logout
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
            {isAuthenticated ? (
              <div className="login-btns">
                <button className="login-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="login-btns">
                <button className="login-btn">Login</button>
              </div>
            )}
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
