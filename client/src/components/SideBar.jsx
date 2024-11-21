import { useEffect, useState } from "react";
import { Link , useNavigate } from "react-router-dom"; // Import Link for navigation
import "../assets/css/SideBar.css";
import { useAuth } from "../components/authentication/AuthContext.jsx";


const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const { userDataRole, logout } = useAuth();
  const navigate = useNavigate(); 


  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navLinks = {
    Admin: [
      // { icon: "fa-solid fa-house", label: "Dashboard", path: "/" },
      { icon: "fa-solid fa-house", label: "Tests", path: "/adminTest" },
      { icon: "fa-solid fa-flask-vial", label: "Clinics", path: "/adminClinic" },
      { icon: "fa-solid fa-hospital", label: "Diagnostic Centers", path: "/diagnostic-center" },
    ],
    ClinicAdmin: [
      // { icon: "fas fa-house", label: "Dashboard", path: "/" },
      { icon: "fa-solid fa-stethoscope", label: "Clinic", path: "/getDoctor" },
      { icon: "fa-solid fa-calendar-days", label: "Add Availability", path: "/add-availability" },
    ],
    DiagnosticCenterAdmin: [
      // { icon: "fa-solid fa-house", label: "Dashboard", path: "/" },
      // { icon: "fas fa-hospital", label: "Diagnostics Center", path: "/getBookings" },
      { icon: "fa-solid fa-calendar-check", label: "Appointments", path: "/getBookings" },
    ],
  };

  const logoutLink = {
    icon: "fa-solid fa-arrow-right-from-bracket",
    label: "Logout",
    path: "/logout",
  };



  const links = navLinks[userDataRole] || [];

  const handleLinkClick = (index) => {
    setActiveLink(index);
  };

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate("/login"); // Redirect to /login after logout
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {console.log(userDataRole)}
      <div className="toggle-btn" onClick={toggleSidebar}>
        <i className={`fas ${isCollapsed ? "fa-angles-right" : "fa-angles-left"}`}></i>
      </div>

      <ul>
        {links.map((link, index) => (
          <li
            key={index}
            className={`sidebar-item ${activeLink === index ? "active" : ""}`}
            onClick={() => handleLinkClick(index)}
          >
            <Link to={link.path} className="sidebar-link">
              <i className={link.icon}></i>
              {!isCollapsed && <span>{link.label}</span>}
            </Link>
          </li>
        ))}
        <li className="sidebar-item" onClick={handleLogout}>
          <Link to="/logout" className="sidebar-link">
            <i className={logoutLink.icon}></i>
            {!isCollapsed && <span>{logoutLink.label}</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
