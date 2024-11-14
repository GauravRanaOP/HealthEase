import React, { useEffect, useState } from "react";
import SearchDoctor from "./SearchDoctor";
import DoctorCard from "./DoctorCard";
import AppointmentCard from "./AppointmentCard";
import TestCard from "./TestCard";

import "../assets/css/PatientDirectory.css";
import axios from "axios";

export default function PatientDirectory() {
  // defines states
  const [doctors, setDoctors] = useState([]);
  const [postcodePrefix, setpostcodePrefix] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

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

  // fetches appointments and tests on component mount
  useEffect( () => {
    // function to check if user is logged in
    
    // for testing
    // const userId = "671e7a21ec143e564acc28eb";
    if (!userId) {
      navigate("/login");
    } else {
      fetchAppointments(userId);
      fetchTests(userId);
    }
  }, [navigate, userId]);

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
  useEffect(() => {
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

  // fetches appointments
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

  // fetches tests
  const fetchTests = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3002/api/patient/tests?patientId=${userId}`
      );
      // console.log("Response data: ", response.data.appointments);
      if (response.data.tests && response.status === 200) {
        setTests(response.data.tests || []);
      } else {
        console.error("No upcoming tests found for this user:", userId);
        setError("No upcoming tests found.");
      }
    } catch (error) {
      console.error("Error fetching test data: ", error);
      setError("Error fetching test data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-directory">
      {/* <h1 className="directory-title">Find a Doctor</h1> */}
      <h1 className="directory-title">Patient Directory</h1>
      
      <div className="tabs">
        <button
          className={`tab ${activeTab === "doctors" ? "active" : ""}`}
          onClick={() => setActiveTab("doctors")}
        >
          Doctors
        </button>
        <button
          className={`tab ${activeTab === "appointments" ? "active" : ""}`}
          onClick={() => setActiveTab("appointments")}
        >
          Appointments
        </button>
        <button
          className={`tab ${activeTab === "tests" ? "active" : ""}`}
          onClick={() => setActiveTab("tests")}
        >
          Tests
        </button>
      </div>

      {/* renders loading state */}
      {loading && <p>Loading appointments...</p>}

      {/* renders error state  */}
      {error && <p className="error-message">{error}</p>}

      {/* renders DoctorCard */}
      {activeTab === "doctors" && (
        <div className="doctor-section">
          <SearchDoctor onSearch={handleSearchDoctor} />
          <div className="doctor-list">
            {doctors.length > 0
              ? doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor._id || doctor.doctorId}
                    doctor={doctor}
                  />
                ))
              : !loading && <p>No doctors found for this postcode.</p>}
          </div>
        </div>
      )}

      {/* renders Appointment Card */}
      {activeTab === "appointments" && (
        <div className="appointment-section">
          <h2>Appointments</h2>
          <div className="appointment-list">
            {appointments.length > 0
              ? appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))
              : !loading && <p>No upcoming appointments found for the user.</p>}
          </div>
        </div>
      )}

      {/* renders Test Card */}
      {activeTab === "tests" && (
        <div className="tests-section">
          <h2>Tests</h2>
          <div className="test-list">
            {tests.length > 0
              ? tests.map((test) => (
                  <TestCard key={test.id} test={test} />
                ))
              : !loading && <p>No upcoming appointments found for the user.</p>}
          </div>
        </div>
      )}
    </div>
  );
  
  
} // end PatientDirectory
