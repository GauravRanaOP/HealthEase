import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";


export default function DoctorCard({ doctor }) {
  // const [showTimeslots, setshowTimeslots] = useState(false);   // ** removed as we are navigating to seperate page now

  const navigate = useNavigate();

  // checks if doctor is available
  if (!doctor) {
    return <div>Loading doctors...</div>;
  }

  // destructures clinic address
  const { streetAddress, city, province, postCode } =
    doctor.clinicAddress || {};

  // navigates to DoctorTimeslots page
  const handleBookNowClick = () => {
    if (doctor.doctorId) {
      // console.log("DoctorCard, BookNow: DoctorId when toggling timeslots ", doctor);
      navigate(`/doctorTimeslots/${doctor.doctorId}`); //** */
      // setshowTimeslots(!showTimeslots);
    } else {
      console.log("DoctorId is undefined");
    }
  };

  return (
    <div className="doctor-card">
      <h3>
        {doctor.firstName} {doctor.lastName}
      </h3>
      <div className="doctor-card-body">
        <p className="speciality">
          <strong>Speciality: </strong>
          {doctor.speciality}
        </p>
        <p>
          <FontAwesomeIcon icon={faLocationDot} className="location-icon" />
          {streetAddress}, {city}, {province}, {postCode}
        </p>
      </div>
      <div className="doctor-card-footer">
        <button onClick={handleBookNowClick}>
          Book Now
          <FontAwesomeIcon icon={faArrowRight} className="arrow-right-icon" />
        </button>
      </div>
    </div>
  );
}
