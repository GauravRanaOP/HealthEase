import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/ViewBookings.css";

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://localhost:3002/api/bookings/getBookings"
      );
      setBookings(response.data);
    };
    fetchData();
  }, []);

  const formatTimeSlot = (timeSlot) => {
    const date = new Date(timeSlot);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="bookings-table-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Patients"
          className="search-input"
        />
      </div>
      <table className="bookings-table" cellPadding="10">
        <thead>
          <tr>
            <th>Time Slot</th>
            <th>Test</th>
            <th>Patient ID</th>
            <th>Doctor&#39;s Note</th>
            <th>Test Status</th>
            <th>Result</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{formatTimeSlot(booking.timeSlot)}</td>
              <td>{booking.test}</td>
              <td>{booking.patientId}</td>
              <td>{booking.doctorNote}</td>
              <td>{booking.testStatus}</td>
              <td>{booking.result}</td>
              <td>{booking.location}</td>
              <td>
                <button className="view">
                  <i className="fa-solid fa-eye"></i>
                </button>
                <button className="edit">
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button className="delete">
                  <i className="fas fa-trash-can"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button className="disabled">Previous</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>Next</button>
      </div>
    </div>
  );
};

export default ViewBookings;
