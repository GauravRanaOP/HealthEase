import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faClock, faCommentDots, faLocationDot, faUser } from "@fortawesome/free-solid-svg-icons";


export default function AppointmentCard({ appointment }) {
  // defines state
  const [showDetails, setShowDetails] = useState(false);
  const [showDoctorNote, setShowDoctorNote] = useState(false);

  if (!appointment) return null;

  // clinic address
  const { streetAddress, city, province, country, postCode } = appointment.clinicAddress || {};
  const { doctorNote, comments, date, time, status, visitMode } = appointment;

  // function to toggle details button
  const handleDetailsToggle = () => {
    setShowDetails((prevShowDetails) => !prevShowDetails);
  };

  // function to toggle visibility of doctor's note
  const handleViewDoctorNote = () => {
    setShowDoctorNote((prevState) => !prevState); 
    console.log('Doctor note visibility:', !showDoctorNote);
  };



  return (
    <div className="appointment-card">
      <h3>
        {appointment.clinicName}
        <span className="visit-type">
          {appointment.status}
        </span>
      </h3>
      <div className="appointment-card-items">
        <div className="appointment-card-address">
          {streetAddress && (
            <p>
              <FontAwesomeIcon icon={faLocationDot} className="icon" />
              {streetAddress}, {city}, {province}, {country}, {postCode}
            </p>
          )}
        </div>
        <div className="appointment-card-date-time">
          <p>
            <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
            {appointment.date}
          </p>
          <p>
            <FontAwesomeIcon icon={faClock} className="icon" />
            {appointment.time}
          </p>
        </div>

        <div className="appointment-card-details-btn">
          <button onClick={handleDetailsToggle}>
            {showDetails ? "Hide Details" : "Details"}
          </button>
        </div>
        {/* doctors note */}
        
        {doctorNote && (
          <div className="appointment-card-view-note">
            <button onClick={handleViewDoctorNote}>
              {showDoctorNote ? "Hide Doctor's Note" : "View Doctor's Note"}
            </button>
          </div>
        )}

      </div>

      {/* renders doctor's note */}
      {showDoctorNote && (
        <div className="appointment-doctors-note">
          <p><strong>Doctor's Note:</strong></p>
          <p>{doctorNote}</p>
        </div>
      )}

      
      {/* renders details when showDetails is true */}
      {showDetails && (
        <div className="appointment-card-p-container">
          <p>
            <strong>Visit Mode: </strong>
            {appointment.visitMode}
          </p>
          <p>
            <strong>Status: </strong>
            {appointment.status}
          </p>
          <p>
            <FontAwesomeIcon icon={faCommentDots} className="icon" />
            <strong>Comments: </strong>
            {appointment.comments}
          </p>
        </div>
      )}
    </div>
  );
}