import { useEffect, useState } from "react";
import { Link , useNavigate } from "react-router-dom"; // Import Link for navigation
import "../assets/css/SideBar.css";
import { useAuth } from "../components/authentication/AuthContext.jsx";


const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate(); 


  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navLinks = {
    admin: [
      { icon: "fa-solid fa-house", label: "Dashboard", path: "/" },
      { icon: "fa-solid fa-stethoscope", label: "Clinic", path: "/getDoctor" },
      { icon: "fas fa-hospital", label: "Diagnostics Center", path: "/getBookings" },
      { icon: "fa-solid fa-flask-vial", label: "Health Test", path: "/adminTest" },
      { icon: "fa-solid fa-flask-vial", label: "Health Clinic", path: "/adminClinic" },

    ],
    clinicAdmin: [
      { icon: "fas fa-house", label: "Dashboard", path: "/" },
      { icon: "fas fa-user-doctor", label: "Add Doctor", path: "/add-doctor" },
      { icon: "fa-solid fa-calendar-days", label: "Add Availability", path: "/add-availability" },
    ],
    diagnosticCenterAdmin: [
      { icon: "fa-solid fa-calendar-check", label: "View Bookings", path: "/view-bookings" },
    ],
  };

  const logoutLink = {
    icon: "fa-solid fa-arrow-right-from-bracket",
    label: "Logout",
    path: "/logout",
  };

  useEffect(()=> {

  }, []);

  const links = navLinks["admin"] || [];

  const handleLinkClick = (index) => {
    setActiveLink(index);
  };

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate("/login"); // Redirect to /login after logout
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
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
