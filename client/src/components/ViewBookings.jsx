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

  //fetch real appointments from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3002/api/appointments/getBookedAppointments"
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

  return (
    <div className="app-layout">
      <Helmet>
        <title>Appointments | HealthEase</title>
        <meta
          name="description"
          content="Manage and review all booked diagnostic appointments. View patient details, appointment status, and results in one place."
        />
        <meta
          name="keywords"
          content="booked appointments, diagnostic tests, patient details, HealthEase"
        />
        <meta name="author" content="HealthEase Team" />
        <link rel="canonical" href="http://localhost:3002/getBookings" />
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
            </tr>
          </thead>
          <tbody>
            {currentAppointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>
                  {appointment.patientId?.email || "Unknown Patient"}
                </td>{" "}
                <td>{appointment.status}</td>
                <td>{appointment.testResult || "Pending"}</td>
                <td>{appointment.location}</td>
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
    </div>
  );
};

export default ViewBookings;
