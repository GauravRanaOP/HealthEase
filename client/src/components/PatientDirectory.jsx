import React, { useEffect, useState } from "react";
import SearchDoctor from "./SearchDoctor";
import DoctorCard from "./DoctorCard";
import "../assets/css/PatientDirectory.css";
import axios from "axios";

export default function PatientDirectory() {
  // state to store doctors
  const [doctors, setDoctors] = useState([]);
  // state to store postcode
  const [postcodePrefix, setpostcodePrefix] = useState("");

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

  return (
    <div className="patient-directory">
      <h1 className="directory-title">Find a Doctor</h1>

      <SearchDoctor onSearch={handleSearchDoctor} />
      <div className="doctor-list">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor._id || doctor.doctorId} doctor={doctor} />
        ))}
      </div>
    </div>
  );
} // end PatientDirectory
