import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faClock,
  faCommentDots,
  faLocationDot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function AppointmentCard({ appointment }) {

  // defines state
  const [showDetails, setShowDetails] = useState(false);
 
  if (!appointment) return null;

  // clinic address
  const { streetAddress, city, province, country, postCode } = appointment.clinicAddress || {};

  // function to toggle details button
  const handleDetailsToggle = () => {
    setShowDetails(prevShowDetails => !prevShowDetails);
  }

  return (
    <div className="appointment-card">
      <h3>
        {appointment.clinicName}
        <span className="visit-type">
          {/* {appointment.visitType === "DoctorVisit" ? "At Clinic" : "At Lab"} */}
          {appointment.status}
          </span>
      </h3>
      <div className="appointment-card-items"> 

        <div className="appointment-card-address">
          {streetAddress && (
            <p>
              <FontAwesomeIcon icon={faLocationDot} className="icon"  />
              {streetAddress}, {city}, {province}, {country}, {postCode}
            </p>
          )}
        </div>
        <div className="appointment-card-date-time">
          <p><FontAwesomeIcon icon={faCalendarAlt} className="icon"/>{appointment.date}</p>  
          <p><FontAwesomeIcon icon={faClock} className="icon"/>{appointment.time}</p>
        </div>
        
        <div className="appointment-card-details-btn">
          <button onClick={handleDetailsToggle}>
            {showDetails ? "Hide Details" : "Details"}
          </button>
          
        </div>
        
      </div>
      
      
      {/* renders details when showDetails is true */}
      {showDetails && (
        <div className="appointment-card-p-container">
          <p>Visit Mode: {appointment.visitMode}</p>
          <p>Status: {appointment.status}</p>
          <p><FontAwesomeIcon icon={faCommentDots} className="icon"/>
            Comments: {appointment.comments}
          </p>
        </div>
      )}
    </div>
  );
}
