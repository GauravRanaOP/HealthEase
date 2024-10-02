import React from "react";
import Clinic from "../../../server/models/Clinic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function DoctorCard({ doctor }) {
  // checks if doctor is available
  if (!doctor) {
    return <div>Loading doctors...</div>;
  }

  // destructure clinic address
  const { streetAddress, city, province, postCode } =
    doctor.clinicAddress || {};
  return (
    <div className="doctor-card">
      <h3>
        {doctor.firstName} {doctor.lastName}
      </h3>
      <div className="doctor-card-address-container">
        <p>
          <FontAwesomeIcon icon={faLocationDot} className="location-icon" />
          {streetAddress}, {city} ,{province}
           {/* ,{postCode} */}
        </p>
      </div>

      <div>
        <p>Speciality: {doctor.speciality}</p>
      </div>

      <div className="doctor-card-open-container">
        <div>Open</div>
        <div>
          <button>
            Book Now
            <FontAwesomeIcon icon={faArrowRight} className="arrow-right-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
