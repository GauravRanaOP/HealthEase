import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import DoctorTimeslots from "./DoctorTimeslots";

export default function DoctorCard({ doctor }) {
  
  const [showTimeslots, setshowTimeslots] = useState(false);

  // debugging: logs the entire doctor object
  // useEffect( () => {
  //   console.log("Doctor object passed to DoctorCard: ", doctor);
  // }, [doctor]);

  // checks if doctor is available
  if (!doctor) {
    return <div>Loading doctors...</div>;
  }

  // destructures clinic address
  const { streetAddress, city, province, postCode } = doctor.clinicAddress || {};

  // toggles timeslots visibility
  const handleBookNowClick = () => {
    if (doctor.doctorId) {
      console.log("DoctorCard, BookNow: DoctorId when toggling timeslots ", doctor);
      setshowTimeslots(!showTimeslots);
    } else {
      console.log("DoctorId is undefined");
    }
  };

  return (
    <div className="doctor-card">
      <h3>
        {doctor.firstName} {doctor.lastName}
      </h3>
      <div className="doctor-card-p-container">
        <p>
          <FontAwesomeIcon icon={faLocationDot} className="location-icon" />
          {streetAddress}, {city} ,{province}, {postCode}
        </p>
        {/* <p>Email: {doctor.email}</p>
                <p>Contact No: {doctor.contactNo}</p> */}
        <p>Speciality: {doctor.speciality}</p>
      </div>
      <div className="doctor-card-open-container">
        <div>Open</div>
        <div>
          <button onClick={handleBookNowClick}>
            {showTimeslots? "Hide Timeslots" : "Book Now"}
            <FontAwesomeIcon icon={faArrowRight} className="arrow-right-icon" />
          </button>
        </div>
      </div>
  
      {showTimeslots && <DoctorTimeslots doctorId={doctor.doctorId} />}

    </div>
  );
}
