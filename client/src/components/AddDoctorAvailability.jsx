import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/admintest.css";
import SideBar from "./SideBar";
import Pagination from "./Pagination";
import { useAuth } from "../components/authentication/AuthContext.jsx";

const DoctorAvailability = () => {
  const { userData } = useAuth();
  const [DoctorAvailability, setDoctorAvailability] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState(null); // For selected test details
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    doctorId: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // To track if edit mode is enabled
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage] = useState(4);
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://healthease-n5ra.onrender.com/api/getDoctorAvailability/${userData}`
      );
      setDoctorAvailability(response.data);
    };

    fetchData();
  }, []);

  // Add Test
  const handleAddAvailablility = async (availabilityData) => {
    await axios.post(
      "https://healthease-n5ra.onrender.com/api/addDoctorAvailability",
      availabilityData
    );
    const response = await axios.get(
      `https://healthease-n5ra.onrender.com/api/getDoctorAvailability/${userData}`
    );
    setDoctorAvailability(response.data); // Update the list
    setIsAddModalOpen(false);
  };

  // Fetch doctors by clinicId
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          `https://healthease-n5ra.onrender.com/api/doctors/by-clinic/${userData}`
        );
        setDoctors(response.data); // Set the doctor list
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  // View Test
  const handleViewAvailability = async (id) => {
    const response = await axios.get(
      `https://healthease-n5ra.onrender.com/api/getOneDoctorAvailability/${id}`
    );
    setSelectedAvailability(response.data);
    setIsViewModalOpen(true);
  };

  // Edit Test
  const handleEditAvailability = async (id, updatedData) => {
    await axios.put(
      `https://healthease-n5ra.onrender.com/api/availability/${id}`,
      updatedData
    );
    const response = await axios.get(
      `https://healthease-n5ra.onrender.com/api/getDoctorAvailability/${userData}`
    );
    setDoctorAvailability(response.data); // Update the list
    setIsEditModalOpen(false);
  };

  // Delete Test
  const handleDeleteAvailability = async (id) => {
    await axios.delete(
      `https://healthease-n5ra.onrender.com/api/availability/${id}`
    );
    const response = await axios.get(
      `https://healthease-n5ra.onrender.com/api/getDoctorAvailability/${userData}`
    );
    setDoctorAvailability(response.data); // Update the list
  };

  const handleEditClick = (availability) => {
    setCurrentTest(availability); // Set the selected test data in state
    setIsEditModalOpen(true); // Enable the edit mode to show the modal
  };

  const filteredTests = DoctorAvailability.filter((test) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return Object.values(test).some((value) =>
      String(value).toLowerCase().includes(lowerCaseQuery)
    ); // check if any field contains the search query
  });

  // paginate as per search query
  const currentAvailability = filteredTests.slice(
    (currentPage - 1) * testsPerPage,
    currentPage * testsPerPage
  );

  // handle page change
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="app-layout">
      <SideBar />
      <div className="admin-test-table-container">
        <div className="admin-test-search-container">
          <input
            type="text"
            placeholder="Search Doctor Availability"
            className="admin-test-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="admin-test-add-button"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Doctor Availability
          </button>
        </div>
        <table className="admin-test-table" cellPadding="10">
          <thead className="admin-test-thead">
            <tr>
              <th className="admin-test-th">Start Date</th>
              <th className="admin-test-th">Start Time</th>
              <th className="admin-test-th">End Time</th>
              <th className="admin-test-th">Doctor</th>
              <th className="admin-test-th">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentAvailability.map((availability) => (
              <tr className="admin-test-tr" key={availability._id}>
                <td className="admin-test-td">{availability.startDate}</td>
                <td className="admin-test-td">{availability.startTime}</td>
                <td className="admin-test-td">{availability.endTime}</td>
                <td className="admin-test-td">
                  {availability.doctorId.userid.firstName +
                    " " +
                    availability.doctorId.userid.lastName}
                </td>
                <td className="admin-test-td">
                  <button
                    className="admin-test-view"
                    onClick={() => handleViewAvailability(availability._id)}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="admin-test-edit"
                    onClick={() => handleEditClick(availability)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="admin-test-delete"
                    onClick={() => handleDeleteAvailability(availability._id)}
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
          totalPages={Math.ceil(filteredTests.length / testsPerPage)}
          onPageChange={handlePageChange}
        />

        {/* Add Test Modal */}
        {isAddModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add New Availability</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddAvailablility({
                    startDate: e.target.startDate.value,
                    endDate: e.target.endDate.value,
                    startTime: e.target.startTime.value,
                    endTime: e.target.endTime.value,
                    doctorId: selectedDoctor, // Include selected doctorId
                    type: "Doctor",
                  });
                }}
              >
                <label className="label">Start Date:</label>
                <input
                  type="date"
                  name="startDate"
                  required
                  className="input"
                />
                <label className="label">End Date:</label>
                <input type="date" name="endDate" required className="input" />
                <label className="label">Start Time:</label>
                <input
                  type="time"
                  name="startTime"
                  required
                  className="input"
                />
                <label className="label">End Time:</label>
                <input type="time" name="endTime" required className="input" />
                <label className="label">Doctor:</label>
                <select
                  name="doctor"
                  required
                  className="input"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  <option value="" disabled>
                    Select a doctor
                  </option>
                  {doctors.map((doctor) => (
                    <option key={doctor.doctorId} value={doctor.doctorId}>
                      {doctor.fullName}
                    </option>
                  ))}
                </select>
                <div className="button-group">
                  <button type="submit" className="modal-button submit">
                    Submit
                  </button>
                  <button
                    type="button"
                    className="modal-button cancel"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Test Modal */}
        {isViewModalOpen && selectedAvailability && (
          <div className="modal">
            <div className="modal-content">
              <h3>View Availability</h3>
              <p>
                <strong>Start Date:</strong> {selectedAvailability.startDate}
              </p>
              <p>
                <strong>End Date:</strong> {selectedAvailability.endDate}
              </p>
              <p>
                <strong>Start Time:</strong> {selectedAvailability.startTime}
              </p>
              <p>
                <strong>End Time:</strong> {selectedAvailability.endTime}
              </p>
              <p>
                <strong>Doctor's First Name:</strong>{" "}
                {selectedAvailability.doctorId.userid.firstName}
              </p>
              <p>
                <strong>Doctor's Last Name:</strong>{" "}
                {selectedAvailability.doctorId.userid.lastName}
              </p>
              <p>
                <strong>Doctor's Speciality:</strong>{" "}
                {selectedAvailability.doctorId.speciality}
              </p>

              <button type="button" onClick={() => setIsViewModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* Edit Test Modal */}
        {isEditModalOpen && selectedAvailability && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit Availability</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditAvailability({
                    startDate: e.target.startDate.value,
                    endDate: e.target.endDate.value,
                    startTime: e.target.startTime.value,
                    endTime: e.target.endTime.value,
                    doctorId: selectedDoctor, // Include selected doctorId
                    type: "Doctor",
                  });
                }}
              >
                <label className="label">Start Date:</label>
                <input
                  type="date"
                  name="startDate"
                  required
                  className="input"
                  defaultValue={selectedAvailability.startDate}
                />
                <label className="label">End Date:</label>
                <input
                  type="date"
                  name="endDate"
                  required
                  className="input"
                  defaultValue={selectedAvailability.endDate}
                />
                <label className="label">Start Time:</label>
                <input
                  type="time"
                  name="startTime"
                  required
                  className="input"
                  defaultValue={selectedAvailability.startTime}
                />
                <label className="label">End Time:</label>
                <input
                  type="time"
                  name="endTime"
                  required
                  className="input"
                  defaultValue={selectedAvailability.endTime}
                />
                <label className="label">Doctor:</label>
                <select
                  name="doctor"
                  required
                  className="input"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  <option value="" disabled>
                    Select a doctor
                  </option>
                  {doctors.map((doctor) => (
                    <option key={doctor.doctorId} value={doctor.doctorId}>
                      {doctor.fullName}
                    </option>
                  ))}
                </select>
                <div className="button-group">
                  <button type="submit" className="modal-button submit">
                    Update
                  </button>
                  <button
                    type="button"
                    className="modal-button cancel"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAvailability;
