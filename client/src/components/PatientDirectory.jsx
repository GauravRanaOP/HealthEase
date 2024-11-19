import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchDoctor from "./SearchDoctor";
import DoctorCard from "./DoctorCard";
import DoctorAppointmentCard from "./DoctorAppointmentCard";
import TestCard from "./TestCard";
import TestAppointmentCard from "./TestAppointmentCard";
import SearchTest from "./SearchTest";

import "../assets/css/PatientDirectory.css";
import axios from "axios";

export default function PatientDirectory() {
  // defines states
  const [doctors, setDoctors] = useState([]);
  const [postcodePrefix, setpostcodePrefix] = useState("");
  const [testname, setTestname] = useState("");
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [tests, setTests] = useState([]);
  const [testAppointments, setTestAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  const navigate = useNavigate();

  const userId = "671e7a21ec143e564acc28eb";


  // fetches appointments and tests on component mount
  useEffect(() => {
    if (userId) {
      
      fetchDoctorAppointments(userId);
      fetchTestAppointments(userId);
    } else {
      navigate("/login");
    }
  }, [userId, navigate]);


  // fetches doctors based on postcode
  const fetchDoctors = async (postcodePrefix) => {
    try {
      const response = await axios.get(
        `http://localhost:3002/api/doctors/postcode/${postcodePrefix}`
      );
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };


  // fetches tests based on test name
  const fetchTests = async (testname) => {
    try {
      const response = await axios.get(
        // `http://localhost:3002/api/test/name/${testname}`
        `http://localhost:3002/api/test/name?name=${testname}`
      );
      // debugging
      console.log("Test response:", response.data);
      setTests(response.data);    // stores the test with their diagnostic centers
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };


  // useEffect to fetch doctors when postcodePrefix changes
  useEffect(() => {
    if (postcodePrefix) {
      fetchDoctors(postcodePrefix);
    }
  }, [postcodePrefix]);

  // useEffect to fetch tests when test name changes
  useEffect(() => {
    if (testname) {
      fetchTests(testname);
    }
  }, [testname]);


  // function to handle search doctor
  const handleSearchDoctor = (postcode) => {
    setpostcodePrefix(postcode);
  };


  // function to handle search test
  const handleSearchTest = (name) => {
    setTestname(name);
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
      fetchDoctorAppointments(userId);
    }
  }, [navigate, userId]);


  // fetches doctor appointments for the user
  const fetchDoctorAppointments = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3002/api/patient/appointments?patientId=${userId}`
      );
      // console.log("Response data: ", response.data.appointments);
      if (response.data.appointments && response.status === 200) {
        setDoctorAppointments(response.data.appointments || []);
      } else {
        console.error("No upcoming appointments found for this user:", userId);
        setError("No upcoming appointments found.");
      }
    } catch (error) {
      console.error("Error fetching appointment data: ", error);
      setError("Error fetching appointment data.");
    } finally {
      setLoading(false);
    }
  };

  // fetches test appointments for the user
  const fetchTestAppointments = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3002/api/patient/tests?patientId=${userId}`
      );
      // console.log("Response data: ", response.data.appointments);
      if (response.data.tests && response.status === 200) {
        setTestAppointments(response.data.tests || []);
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
          className={`tab ${activeTab === "searchDoctors" ? "active" : "" }` }
          onClick={ () => setActiveTab("searchDoctors")}>
        Search Doctors
        </button>
        <button 
          className={`tab ${activeTab === "doctorAppointments" ? "active" : "" }` }
          onClick={ () => setActiveTab("doctorAppointments")}>
        Doctor Appointments
        </button>
        <button 
          className={`tab ${activeTab === "searchTests" ? "active" : "" }` }
          onClick={ () => setActiveTab("searchTests")}>
        Search Tests
        </button>
        <button 
          className={`tab ${activeTab === "testAppointments" ? "active" : "" }` }
          onClick={ () => setActiveTab("testAppointments")}>
        Test Appointments
        </button>
      </div>


      {/* renders loading state */}
      {loading && <p>Loading appointments...</p>}

      {/* renders error state  */}
      {error && <p className="error-message">{error}</p>}

      {/* renders Search Doctor */}
      {activeTab === "searchDoctors" && (
        <div className="doctor-section">
          <SearchDoctor onSearch={handleSearchDoctor} />  
          <div className="doctor-list">
            {doctors.length > 0 ? (
              doctors.map( (doctor) => (
                <DoctorCard key={doctor._id || doctor.doctorId} doctor={doctor} />
              ))
            ) : (
              !loading && <p>No doctors found for this postcode.</p>
            )}
          </div>
        </div>
      )}

      {/* renders Doctor Appointments */}
      {activeTab === "doctorAppointments" && (
        <div className="appointment-section">
          <h2>Appointments</h2>
          <div className="appointment-list"> 
            {doctorAppointments.length > 0 ? (
              doctorAppointments.map((appointment) => (
                <DoctorAppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              !loading && <p>No upcoming appointments found for the user.</p>
            )}
          </div>
        </div>
      )}

      {/* renders Search Test */}
      {activeTab === "searchTests" && (
        <div className="test-section">
          <SearchTest onSearch={handleSearchTest} />
          <div className="test-list">
            {tests.length > 0
              ? tests.map((test) => (
                  <TestCard key={test.test._id} test={test.test} />
                ))
              : !loading && <p>No tests found with this name.</p>}
          </div>
        </div>
      )}

      {/* renders Test Appointment Card */}
      {activeTab === "tests" && (
        <div className="tests-section">
          <h2>Tests</h2>
          <div className="test-list">
            {tests.length > 0
              ? tests.map((test) => <TestCard key={test.id} test={test} />)
              : !loading && <p>No upcoming appointments found for the user.</p>}
          </div>
        </div>
      )}
    </div>
  );
} // end PatientDirectory
