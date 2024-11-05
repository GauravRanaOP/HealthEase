import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import SearchDoctor from "./SearchDoctor";
import DoctorCard from "./DoctorCard";
import AppointmentCard from "./AppointmentCard";

import "../assets/css/PatientDirectory.css";


export default function PatientDirectory() {
  
  // defines states
  const [doctors, setDoctors] = useState([]);
  const [postcodePrefix, setpostcodePrefix] = useState("");
  const [appointments, setAppointments] = useState([]);
  
  const navigate = useNavigate();

  const userId = "671e7a21ec143e564acc28eb";

  // fetch doctors based on postcode
  const fetchDoctors = async (postcodePrefix) => {
    try {
      const response = await axios.get(
        `http://localhost:3002/api/doctors/postcode/${postcodePrefix}`
      );

      const data = response.data;
      // console.log("Parsed doctor data:", data);
      setDoctors(data);

    } catch (error) {
      console.error("Error fetching doctors:", error);
      alert("catch error: An error occured while fetching doctors");
    }
  };

  // useEffect to fetch doctors when postcodePrefix changes
  useEffect(() => {
    if (postcodePrefix) {
      fetchDoctors(postcodePrefix);
    }
  }, [postcodePrefix]);

  // function to handle search
  const handleSearchDoctor = (postcode) => {
    setpostcodePrefix(postcode);
  };

  // checks if patient is logged in
  useEffect( () => {
    // function to check if user is logged in
    // const userId = localStorage.getItem("userId");
    // for testing
    const userId = "671e7a21ec143e564acc28eb";
    if (!userId) {
      navigate("/login");
    } else {
      // fetches appointments when patientId is set
      fetchAppointments(userId);
    }
  }, [navigate, userId]);

  const fetchAppointments = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3002/api/patient/appointments?patientId=${userId}`
      );

      console.log("Response data: ", response.data.appointments);
      // console.log("Response patientId: ", response.data.appointments.patientId);

      if (response.data.appointments && response.status === 200) {
        setAppointments(response.data.appointments);
      } else {
        console.error("No upcoming appointments found for this user:", userId);
          // setError("No upcoming appointments found.");
      }
    } catch (error) {
      console.error("Error fetching appointment data: ", error);
      // setError("Error fetching appointment data.");
    // } finally {
    //   setLoading(false);
    }
  };



  return (
    <div className="patient-directory">
      <h1 className="directory-title">Find a Doctor</h1>

      <SearchDoctor onSearch={handleSearchDoctor} />
      
      {/* renders DoctorCard */}
      <div className="doctor-list">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor._id || doctor.doctorId} doctor={doctor} />
        ))}
      </div>

      {/* renders Appointment Card */}
      <div className="appointment-list"> 
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))
        ) : (
          <p>No upcoming appointments found for the user.</p>
        )}
      </div>

    </div>
  );
  
} // end PatientDirectory
