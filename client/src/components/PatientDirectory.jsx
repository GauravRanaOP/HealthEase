import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import SearchDoctor from "./SearchDoctor";
import DoctorCard from "./DoctorCard";
import DoctorAppointmentCard from "./DoctorAppointmentCard";
import TestCard from "./TestCard";
import TestAppointmentCard from "./TestAppointmentCard";
import SearchTest from "./SearchTest";
import { useAuth } from "./authentication/AuthContext.jsx";

import "../assets/css/PatientDirectory.css";

import heroImg200 from "../assets/images/hero-img/hero_img_c_scale_w_200.png";
import heroImg790 from "../assets/images/hero-img/hero_img_c_scale_w_790.png";


export default function PatientDirectory() {

  const navigate = useNavigate();
  const { userData } = useAuth();

  // defines states
  const [doctors, setDoctors] = useState([]);
  const [postcodePrefix, setpostcodePrefix] = useState("");   // search for doctors is performed by postcode
  const [tests, setTests] = useState([]);
  const [testname, setTestname] = useState("");               // search for test is performed by the test name
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [testAppointments, setTestAppointments] = useState([]);
  //const [loading, setLoading] = useState(true);     // old loading state, replaced with 4 different loading states for each tab
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  // defines loading states for each tab
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [testsLoading, setTestsLoading] = useState(false);
  const [doctorAppointmentsLoading, setDoctorAppointmentsLoading] = useState(false);
  const [testAppointmentsLoading, setTestAppointmentsLoading] = useState(false);

  
  // ensures userData has a fallback to localStorage if it is not available
  const userId = userData || JSON.parse(localStorage.getItem("user_data"))?.userId;
  //console.log("userId outside useEffect:", userId);

  // fetches data only when userData is available and loading is complete
  useEffect(() => {
    //console.log("useEffect triggered");
    //console.log("userId from AuthContext or localStorage:", userId);

    if (userId) {
      fetchUserData(userId);
      fetchDoctorAppointments(userId);
      fetchTestAppointments(userId);
    } else {
      console.log("No userId found, user might not be logged in.");
    }
  }, [userId]);


  // fetches user details (if logged in )
  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3002/api/user?userId=${userId}`
      );
      setUserDetails(response.data.user);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };


  // fetches doctors based on postcode
  const fetchDoctors = async (postcodePrefix) => {
  setDoctorsLoading(true);
  try {
    const response = await axios.get(
      `http://localhost:3002/api/doctors/postcode/${postcodePrefix}`
    );
    setDoctors(response.data);
  } catch (error) {
    console.error("Error fetching doctors:", error);
  } finally {
    setDoctorsLoading(false);
  }
  };


  // fetches tests based on test name
  const fetchTests = async (testname) => {
    setTestsLoading(true);
    try {
      const response = await axios.get(
        // `http://localhost:3002/api/test/name/${testname}`
        `http://localhost:3002/api/test/name?name=${testname}`
      );
      // debugging
      //console.log("Test response:", response.data);
      setTests(response.data);    // stores the test with their diagnostic centers
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setTestsLoading(false);
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


  // fetches doctor appointments for the logged-in user
  const fetchDoctorAppointments = async (userId) => {
    setDoctorAppointmentsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3002/api/patient/appointments?patientId=${userId}`
      );
      //console.log("API Response data: ", response.data.appointments);
      if (response.data.appointments && response.status === 200) {
        setDoctorAppointments(response.data.appointments || []);
        //console.log("setDoctorAppointments: ", setDoctorAppointments);
      } else {
        console.error("No upcoming appointments found for this user:", userId);
        setError("No upcoming appointments found.");
      }
    } catch (error) {
      console.error("Error fetching appointment data: ", error);
      setError("Error fetching appointment data.");
    } finally {
      setDoctorAppointmentsLoading(false);
    }
  };


  // fetches test appointments for the logged-in user
  const fetchTestAppointments = async (userId) => {
    setTestAppointmentsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3002/api/patient/tests?patientId=${userId}`
      );
      //console.log("Response data: ", response.data.appointments);
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
      setTestAppointmentsLoading(false);
    }
  };

  
  return (
    <div className="patient-directory">
      {/* <h1 className="directory-title">Find a Doctor</h1> */}
      {/*<h1 className="directory-title">Patient Directory</h1> */}
      <div>
        <img className="hero-image"
          sizes="(max-width: 790px) 100vw, 790px"
          srcset={`${heroImg200} 200w, ${heroImg790} 790w`}
          src={heroImg790}
          alt="Graphic illustration of a hospital scene" 
          />
      </div>
      {userDetails ? <h3 className="welcome-msg">Welcome, {userDetails.firstName}</h3> : <p>Welcome back </p>}

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
      {/* {loading && <p>Loading data...</p>} */}

      {/* Conditional loading for individual sections */}
      {doctorsLoading && activeTab === "searchDoctors" && <p>Loading doctors...</p>}
      {testsLoading && activeTab === "searchTests" && <p>Loading tests...</p>}
      {doctorAppointmentsLoading && activeTab === "doctorAppointments" && <p>Loading appointments...</p>}
      {testAppointmentsLoading && activeTab === "testAppointments" && <p>Loading test appointments...</p>}

      
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
              !doctorsLoading && <p>No doctors found for this postcode.</p>
            )}
          </div>
        </div>
      )}

      {/* renders Doctor Appointments */}
      {activeTab === "doctorAppointments" && (
        <div className="appointment-section">
          {/* <h2>Appointments</h2> */}
          <div className="appointment-list"> 
            {doctorAppointments.length > 0 ? (
              doctorAppointments.map((appointment) => (
                <DoctorAppointmentCard key={appointment.id} appointment={appointment} />
              ))
             ) : (
              !doctorAppointmentsLoading && <p>No upcoming appointments found for the user.</p>
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
              : !testsLoading && <p>No tests found with this name.</p>}
          </div>
        </div>
      )}

      {/* renders Test Appointments */}
      {activeTab === "testAppointments" && (
      <div className="tests-section">
        {/* <h2>Tests</h2> */}
        <div className="test-list"> 
          {testAppointments.length > 0 ? (
            testAppointments.map((test) => (
              <TestAppointmentCard key={test.id} test={test} />
            ))
          ) : (
            !testAppointmentsLoading && <p>No upcoming appointments found for the user.</p>
          )}
        </div>
      </div>
      )}
      
    </div>
  );
  
} // end PatientDirectory
