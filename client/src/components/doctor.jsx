import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/doctor.css";
import SideBar from "../components/SideBar";
import Pagination from "../components/Pagination";
import useSpeechRecognition from "../hooks/useSpeechRecognization";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../components/authentication/AuthContext.jsx";

const Doctor = () => {
  const [Doctors, setDoctors] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const [addShowCard, setAddShowCard] = useState(false);
  const [showEditCard, setShowEditCard] = useState(false);
  const [viewDoctorData, setViewDoctorData] = useState(null);
  const [saveId, setSaveId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(4);
  const [searchQuery, setSearchQuery] = useState("");
  const { userData } = useAuth();
  const [count, setCount] = useState(0);

  const {
    text,
    startListening,
    stopListening,
    isListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNo: "",
    email: "",
    speciality: "",
    streetAddress: "",
    city: "",
    province: "",
    country: "",
    postCode: "",
  });

  const [editFormData, setEditFormData] = useState({
    userid: {
      firstName: "",
      lastName: "",
      contactNo: "",
      email: "",
    },
    speciality: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userData) {
          const response = await axios.get(
            "https://healthease-n5ra.onrender.com/api/getDoctor"
          );
          const filteredDoctors = response.data.filter(
            (doctor) => doctor.clinicId._id === userData
          );
          setDoctors(filteredDoctors);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchData();
  }, [userData]); // Add userData as a dependency

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddDoctor = () => {
    setAddShowCard(true);
  };

  const handleCloseCard = () => {
    setShowCard(false);
    setShowEditCard(false);
    setAddShowCard(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://healthease-n5ra.onrender.com/api/addDoctor",
        formData
      );
      console.log(response.data);
      setAddShowCard(false);
      // Optionally refresh the doctor list after submitting
    } catch (error) {
      console.error("Error creating doctor:", error);
    }
  };

  // View Doctor Details
  const handleViewDoctor = async (id) => {
    try {
      const response = await axios.get(
        `https://healthease-n5ra.onrender.com/api/getDoctor/${id}`
      );
      setViewDoctorData(response.data);
      setShowCard(true); // Show doctor details in a card view
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    }
  };

  // Delete Doctor
  const handleDeleteDoctor = async (id) => {
    try {
      await axios.delete(
        `https://healthease-n5ra.onrender.com/api/deleteDoctor/${id}`
      );
      setDoctors(Doctors.filter((doctor) => doctor._id !== id)); // Remove from the local state
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  // Edit Doctor
  const handleEditDoctor = async (id) => {
    try {
      const response = await axios.get(
        `https://healthease-n5ra.onrender.com/api/getDoctor/${id}`
      );
      console.log(response);
      setSaveId(id);
      setEditFormData({
        userid: {
          firstName: response.data.userid.firstName,
          lastName: response.data.userid.lastName,
          contactNo: response.data.userid.contactNo,
          email: response.data.userid.email,
        },
        speciality: response.data.speciality,
      }); // Prefill form with existing data
      setShowEditCard(true); // Show edit form card
    } catch (error) {
      console.error("Error fetching doctor data for edit:", error);
    }
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      const id = formData._id; // Assuming formData includes the doctor's ID
      const response = await axios.put(
        `https://healthease-n5ra.onrender.com/api/updateDoctor/${saveId}`,
        editFormData
      );
      console.log(response.data);
      setShowEditCard(false); // Close the edit form card
      // Optionally refresh the doctor list after updating
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  // function to filter doctors based on search query
  const filteredDoctors = Doctors.filter((doctor) => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    // Extracting values to search in, including nested `userid` and `clinicId`
    const searchValues = [
      doctor.speciality,
      doctor.userid.firstName,
      doctor.userid.lastName,
      doctor.userid.email,
      doctor.clinicId?.name, // Optional chaining to handle null values
    ];

    // Check if any value matches the search query
    return searchValues.some(
      (value) => value && String(value).toLowerCase().includes(lowerCaseQuery)
    );
  });

  useEffect(() => {
    if (text) {
      console.log("we are inside text", text);
      setSearchQuery(text); // Update the search input with the recognized text
    }
  }, [text]);

  // paginate as per search query
  const currentDoctors = filteredDoctors.slice(
    (currentPage - 1) * doctorsPerPage,
    currentPage * doctorsPerPage
  );

  // handle page change
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="doctor-table-container app-layout">
      {console.log(userData)}
      <SideBar />
      <div className="content">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Doctors"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="voice-recognization">
            {hasRecognitionSupport ? (
              <>
                <div className="button-container">
                  <button
                    className="add-button"
                    onClick={() => {
                      startListening(),
                        toast("Your Browser is currently listening");
                    }}
                  >
                    Start
                  </button>
                  <ToastContainer />

                  {isListening ? (
                    <>
                      <button
                        className="stop-button"
                        onClick={() => {
                          stopListening(), toast("Voice Recognization stopped");
                        }}
                      >
                        Stop
                      </button>
                    </>
                  ) : null}
                </div>
              </>
            ) : (
              <h1>Your browser has no speech support</h1>
            )}
          </div>
          <button className="add-button" onClick={handleAddDoctor}>
            Add Doctor
          </button>
        </div>

        <table className="doctor-table" cellPadding="10">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Specialty</th>
              <th>Email Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentDoctors.map((Doctor, index) => (
              <tr key={Doctor._id}>
                <td>{Doctor.userid.firstName}</td>
                <td>{Doctor.userid.lastName}</td>
                <td>{Doctor.speciality}</td>
                <td>{Doctor.userid.email || "johndoe123@gmail.com"}</td>
                <td>
                  <button
                    className="view"
                    onClick={() => handleViewDoctor(Doctor._id)}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="edit"
                    onClick={() => handleEditDoctor(Doctor._id)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDeleteDoctor(Doctor._id)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredDoctors.length / doctorsPerPage)}
          onPageChange={handlePageChange}
        />

        {/* Card View */}
        {addShowCard && (
          <div className="card-container">
            <div className="card">
              <span className="close-card" onClick={handleCloseCard}>
                &times;
              </span>
              <h2>Add Doctor</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="contactNo"
                  placeholder="Contact Number"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="speciality"
                  placeholder="Speciality"
                  value={formData.speciality}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="streetAddress"
                  placeholder="Street Address"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="province"
                  placeholder="Province"
                  value={formData.province}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="postCode"
                  placeholder="Postal Code"
                  value={formData.postCode}
                  onChange={handleInputChange}
                  required
                />
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        )}

        {/* View Doctor Card */}
        {showCard && (
          <div className="card-container">
            <div className="card">
              <span className="close-card" onClick={handleCloseCard}>
                &times;
              </span>
              <h2>Doctor Details</h2>
              <p>
                <strong>First Name:</strong> {viewDoctorData.userid.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {viewDoctorData.userid.lastName}
              </p>
              <p>
                <strong>Specialty:</strong> {viewDoctorData.speciality}
              </p>
              <p>
                <strong>Email:</strong> {viewDoctorData.userid.email}
              </p>
              <p>
                <strong>Contact No:</strong> {viewDoctorData.userid.contactNo}
              </p>
            </div>
          </div>
        )}

        {/* Edit Doctor Card */}
        {showEditCard && (
          <div className="card-container">
            <div className="card">
              <span className="close-card" onClick={handleCloseCard}>
                &times;
              </span>
              <h2>Edit Doctor</h2>
              <form onSubmit={handleUpdateDoctor}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={editFormData.userid.firstName}
                  onChange={handleEditInputChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={editFormData.userid.lastName}
                  onChange={handleEditInputChange}
                  required
                />
                <input
                  type="text"
                  name="contactNo"
                  placeholder="Contact Number"
                  value={editFormData.userid.contactNo}
                  onChange={handleEditInputChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={editFormData.userid.email}
                  onChange={handleEditInputChange}
                  required
                />
                <input
                  type="text"
                  name="speciality"
                  placeholder="Speciality"
                  value={editFormData.speciality}
                  onChange={handleEditInputChange}
                  required
                />
                <button type="submit">Update</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctor;
