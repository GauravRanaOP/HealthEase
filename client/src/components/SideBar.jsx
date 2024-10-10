import { useState } from 'react';
import '../assets/css/SideBar.css';

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navLinks = {
    admin: [
      { icon: 'fa-solid fa-house', label: 'Dashboard' },
      { icon: 'fa-solid fa-stethoscope', label: 'Clinics' },
      { icon: 'fas fa-hospital', label: 'Diagnostics Centers' },
      { icon: 'fa-solid fa-flask-vial', label: 'Health Tests' },
    ],
    clinicAdmin: [
      { icon: 'fas fa-house', label: 'Dashboard' },
      { icon: 'fas fa-user-doctor', label: 'Add Doctor' },
      { icon: 'fa-solid fa-calendar-days', label: 'Add Availability' },
    ],
    diagnosticCenterAdmin: [
      { icon: 'fa-solid fa-calendar-check', label: 'View Bookings' },
    ],
  };

  const logoutLink = { icon: 'fa-solid fa-arrow-right-from-bracket', label: 'Logout' };

  const links = navLinks["admin"] || [];

  const handleLinkClick = (index) => {
    setActiveLink(index);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="toggle-btn" onClick={toggleSidebar}>
        <i className={`fas ${isCollapsed ? 'fa-angle-right' : 'fa-angle-left'}`}></i>
      </div>

      <ul>
        {links.map((link, index) => (
          <li
            key={index}
            className={`sidebar-item ${activeLink === index ? 'active' : ''}`}
            onClick={() => handleLinkClick(index)}
          >
            <i className={link.icon}></i>
            {!isCollapsed && <span>{link.label}</span>}
          </li>
        ))}
        <li className="sidebar-item" onClick={() => handleLinkClick(links.length)}>
          <i className={logoutLink.icon}></i>
          {!isCollapsed && <span>{logoutLink.label}</span>}
        </li>
      </ul>
    </div>
  );
};

export default SideBar;