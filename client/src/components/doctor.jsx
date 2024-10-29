import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/doctor.css";

const Doctor = () => {
  const [Doctors, setDoctors] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const [addShowCard, setAddShowCard] = useState(false);
  const [showEditCard, setShowEditCard] = useState(false);
  const [viewDoctorData, setViewDoctorData] = useState(null);
  const [saveId, setSaveId] = useState();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNo: "",
    email: "",
    speciality: "",
    // streetAddress: "",
    // city: "",
    // province: "",
    // country: "",
    // postCode: "",
  });

  const [editFormData, setEditFormData] = useState({
    userid: {
      firstName: "",
      lastName: "",
      contactNo: "",
      email: "",
    },
    speciality: "",
    // streetAddress: "",
    // city: "",
    // province: "",
    // country: "",
    // postCode: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3002/api/getDoctor");
      setDoctors(response.data);
    };

    fetchData();
  }, []);

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
      // If the field belongs to `userid`, update it accordingly
      userid: {
        ...prevData.userid,
        [name]: name in prevData.userid ? value : prevData.userid[name],
      },
      // If it’s a root-level field (e.g., `speciality`), update it directly
      ...(name in prevData ? { [name]: value } : {}),
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
      const response = await axios.post("http://localhost:3002/api/addDoctor", formData);
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
      const response = await axios.get(`http://localhost:3002/api/getDoctor/${id}`);
      setViewDoctorData(response.data);
      setShowCard(true); // Show doctor details in a card view
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    }
  };

  // Delete Doctor
  const handleDeleteDoctor = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/api/deleteDoctor/${id}`);
      setDoctors(Doctors.filter((doctor) => doctor._id !== id)); // Remove from the local state
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  // Edit Doctor
  const handleEditDoctor = async (id) => {
    try {
      setSaveId(id);
      const response = await axios.get(`http://localhost:3002/api/getDoctor/${id}`);
      console.log(response);
      setEditFormData({
        userid: {
          firstName: response.data.userid.firstName,
          lastName: response.data.userid.lastName,
          contactNo: response.data.userid.contactNo,
          email: response.data.userid.email,
        },
        speciality: response.data.speciality,
        // streetAddress: response.data.clinicId.address.streetAddress,
        // city: response.data.clinicId.address.city,
        // province: response.data.clinicId.address.province,
        // country: response.data.clinicId.address.country,
        // postCode: response.data.clinicId.address.postCode,
      }); // Prefill form with existing data
      setShowEditCard(true); // Show edit form card
    } catch (error) {
      console.error("Error fetching doctor data for edit:", error);
    }
  };


  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      const id = saveId; // Assuming formData includes the doctor's ID
      const response = await axios.put(`http://localhost:3002/api/updateDoctor/${id}`, editFormData);
      console.log(response.data);
      setShowEditCard(false); // Close the edit form card
      // Optionally refresh the doctor list after updating
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  return (
    <div className="doctor-table-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Patients"
          className="search-input"
        />
        <button className="add-button" onClick={handleAddDoctor}>Add Doctor</button>
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
          {Doctors.map((Doctor, index) => (
            <tr key={Doctor._id}>
              <td>{Doctor.userid.firstName}</td>
              <td>{Doctor.userid.lastName}</td>
              <td>{Doctor.speciality}</td>
              <td>{Doctor.email || "johndoe123@gmail.com"}</td>
              <td>
                <button className="view" onClick={() => handleViewDoctor(Doctor._id)}>
                  <i className="fas fa-eye"></i>
                </button>
                <button className="edit" onClick={() => handleEditDoctor(Doctor._id)}>
                  <i className="fas fa-edit"></i>
                </button>
                <button className="delete" onClick={() => handleDeleteDoctor(Doctor._id)}>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Card View */}
      {addShowCard && (
        <div className="card-container">
          <div className="card">
            <span className="close-card" onClick={handleCloseCard}>&times;</span>
            <h2>Add Doctor</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.userid.firstName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.userid.lastName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="contactNo"
                placeholder="Contact Number"
                value={formData.userid.contactNo}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.userid.email}
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
         {/*     <input
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
                placeholder="Post Code"
                value={formData.postCode}
                onChange={handleInputChange}
                required
              /> */}
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* View Doctor Card */}
      {showCard && (
        <div className="card-container">
          <div className="card">
            <span className="close-card" onClick={handleCloseCard}>&times;</span>
            <h2>Doctor Details</h2>
            <p><strong>First Name:</strong> {viewDoctorData.userid.firstName}</p>
            <p><strong>Last Name:</strong> {viewDoctorData.userid.lastName}</p>
            <p><strong>Specialty:</strong> {viewDoctorData.speciality}</p>
            <p><strong>Email:</strong> {viewDoctorData.userid.email}</p>
            <p><strong>Contact No:</strong> {viewDoctorData.userid.contactNo}</p>
            {/* <p><strong>Address:</strong> {viewDoctorData.clinicId.address.streetAddress}, {viewDoctorData.clinicId.address.city}, {viewDoctorData.clinicId.address.province}, {viewDoctorData.clinicId.address.country}, {viewDoctorData.clinicId.address.postCode}</p> */}
          </div>
        </div>
      )}

      {/* Edit Doctor Card */}
      {showEditCard && (
        <div className="card-container">
          <div className="card">
            <span className="close-card" onClick={handleCloseCard}>&times;</span>
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
           {/*   <input
                type="text"
                name="streetAddress"
                placeholder="Street Address"
                value={editFormData.streetAddress}
                onChange={handleEditInputChange}
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={editFormData.city}
                onChange={handleEditInputChange}
                required
              />
              <input
                type="text"
                name="province"
                placeholder="Province"
                value={editFormData.province}
                onChange={handleEditInputChange}
                required
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={editFormData.country}
                onChange={handleEditInputChange}
                required
              />
              <input
                type="text"
                name="postCode"
                placeholder="Post Code"
                value={editFormData.postCode}
                onChange={handleEditInputChange}
                required
              /> */}
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctor;
