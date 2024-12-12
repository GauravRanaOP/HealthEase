import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import "../assets/css/ViewBookings.css";
import Pagination from "./Pagination";
import SideBar from "./SideBar";

const ViewBookings = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //fetch real appointments from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "https://healthease-n5ra.onrender.com/api/appointments/getBookedAppointments"
        );
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

  //filter appointments based on search query
  const filteredAppointments = appointments.filter((appointment) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return Object.values(appointment).some((value) =>
      String(value).toLowerCase().includes(lowerCaseQuery)
    );
  });

  //paginate filtered appointments
  const currentAppointments = filteredAppointments.slice(
    (currentPage - 1) * appointmentsPerPage,
    currentPage * appointmentsPerPage
  );

  //handle page change
  const handlePageChange = (page) => setCurrentPage(page);

  //handle edit button click
  const handleEditClick = (appointment) => {
    setSelectedAppointment({ ...appointment });
    setIsModalOpen(true);
  };

  //handle input change in modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //handle update submission
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `https://healthease-n5ra.onrender.com/api/appointments/${selectedAppointment._id}`,
        {
          status: selectedAppointment.status,
          testResult: selectedAppointment.testResult,
        } //pass the updated appointment data
      );

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === selectedAppointment._id
            ? { ...appointment, ...selectedAppointment }
            : appointment
        )
      );

      setIsModalOpen(false);
      alert("Appointment updated successfully.");
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("Failed to update appointment.");
    }
  };

  return (
    <div className="app-layout">
      <Helmet>
        <title>View Booked Appointments | HealthEase</title>
        <meta
          name="description"
          content="Manage and review all booked diagnostic appointments. View patient details, appointment status, and results in one place."
        />
        <meta
          name="keywords"
          content="booked appointments, diagnostic tests, patient details, HealthEase"
        />
        <meta name="author" content="HealthEase Team" />
        <link
          rel="canonical"
          href="https://healthease-n5ra.onrender.com/appointments/view"
        />
      </Helmet>

      <SideBar />
      <div className="bookings-table-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Appointments"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Patient ID</th>
              <th>Test Status</th>
              <th>Result</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.patientId?.email || "Unknown Patient"}</td>
                <td>{appointment.status}</td>
                <td>{appointment.testResult || "Pending"}</td>
                <td>{appointment.location}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(appointment)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(
            filteredAppointments.length / appointmentsPerPage
          )}
          onPageChange={handlePageChange}
        />
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
            <h2>Edit Appointment</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Test Status:</label>
                <select
                  name="status"
                  value={selectedAppointment.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label>Result:</label>
                <input
                  type="text"
                  name="testResult"
                  value={selectedAppointment.testResult || ""}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit">Update</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBookings;
