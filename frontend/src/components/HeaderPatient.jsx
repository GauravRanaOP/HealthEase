import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "../assets/css/HeaderPatient.css";

const HeaderPatient = () => {
  const [isLoggedIn] = useState(false);

  const user = useMemo(() => ({ name: "John Doe", role: "Admin" }), []);

  return (
    <header className="header">
      <div className="logo">HealthEase</div>

      <div className="nav-links">
        {!isLoggedIn ? (
          <>
            <form>
              <input
                type="text"
                placeholder="Search Doctors or Clinics"
                aria-label="Search Doctors or Clinics"
              />
            </form>
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
