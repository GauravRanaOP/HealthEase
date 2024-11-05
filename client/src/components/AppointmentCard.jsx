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
  // const [appointments, setAppointments] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // // fetches the appointments for the logged-in user
  // useEffect(() => {
  //   const fetchAppointments = async () => {
  //       setLoading(true);
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:3002/api/patient/appointments?patientId=${patientId}`
  //       );

  //       console.log("Response data: ", response.data.appointments);
  //       // console.log("Response patientId: ", response.data.appointments.patientId);

  //       if (response.data && response.data.appointments) {
  //         setAppointments(response.data.appointments);
  //       } else {
  //       //   console.error("No upcoming appointments found for this user:", patientId);
  //           setError("No upcoming appointments found.");
  //       }
  //     } catch (error) {
  //       // console.error("Error fetching appointment data: ", error);
  //       setError("Error fetching appointment data.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (patientId) {
  //     fetchAppointments();
  //   }
  // }, [patientId]);

  // if (loading) {
  //   return <p>Loading appointments...</p>
  // }

  // if (error) {
  //   return <p>{ error }</p>
  // }

  // // displays a message if no appointments are found
  // if (!appointments || appointments.length === 0) {
  //   return <p>No upcoming appointments found..</p>;
  // }

  if (!appointment) return null;

  return (
    <div className="appointment-card">
      <h3>Appointment Details</h3>
      <p>
        <FontAwesomeIcon icon={faCalendarAlt} />
        Date: {appointment.date}
      </p>
      <p>
        <FontAwesomeIcon icon={faClock} />
        Time: {appointment.time}
      </p>
      <p>
        <FontAwesomeIcon icon={faUser} />
        Visit Type: {appointment.visitType}
      </p>
      <p>Visit Mode: {appointment.visitMode}</p>
      <p>Status: {appointment.status}</p>
      <p>
        <FontAwesomeIcon icon={faCommentDots} />
        Comments: {appointment.comments}
      </p>
    </div>
  );
}
