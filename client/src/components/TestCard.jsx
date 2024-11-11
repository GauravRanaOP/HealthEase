import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faClock,
  faCommentDots,
  faLocationDot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";


export default function TestCard({ test }) {

  // defines state
  const [showDetails, setShowDetails] = useState(false);
 
  if (!test) return null;

  // diagnostic center address
  const { streetAddress, city, province, country, postCode } = test.diagnosticCenterAddress || {};

  // function to toggle details button
  const handleDetailsToggle = () => {
    setShowDetails(prevShowDetails => !prevShowDetails);
  }

  return (
    <div className="test-card">
      <h3>
        {test.diagnosticCenterName}
        <span className="visit-type">
          {/* {test.visitType === "DoctorVisit" ? "At Clinic" : "At Lab"} */}
          {test.status}
          </span>
      </h3>
      <div className="test-card-items"> 

        <div className="test-card-address">
          {streetAddress && (
            <p>
              <FontAwesomeIcon icon={faLocationDot} className="icon"  />
              {streetAddress}, {city}, {province}, {country}, {postCode}
            </p>
          )}
        </div>
        <div className="test-card-date-time">
          <p><FontAwesomeIcon icon={faCalendarAlt} className="icon"/>{test.date}</p>  
          <p><FontAwesomeIcon icon={faClock} className="icon"/>{test.time}</p>
        </div>
        
        <div className="test-card-details-btn">
          <button onClick={handleDetailsToggle}>
            {showDetails ? "Hide Details" : "Details"}
          </button>
          
        </div>
        
      </div>
      
      
      {/* renders details when showDetails is true */}
      {showDetails && (
        <div className="test-card-p-container">
          <p>Visit Mode: {test.visitMode}</p>
          <p>Status: {test.status}</p>
          <p><FontAwesomeIcon icon={faCommentDots} className="icon"/>
            Comments: {test.comments}
          </p>
        </div>
      )}
    </div>
  );
}
