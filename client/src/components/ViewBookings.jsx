import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/ViewBookings.css";

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  // function to fetch bookings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/api/bookings/getBookings"
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchData();
  }, []);

  // function to format time slot
  const formatTimeSlot = (timeSlot) => {
    const date = new Date(timeSlot);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  // function to handle view/edit booking
  const handleViewEdit = (booking, editMode = false) => {
    setSelectedBooking(booking);
    setIsEditMode(editMode);
    setIsModalOpen(true);
  };

  // function to handle save booking
  const handleSaveBooking = async () => {
    try {
      await axios.put(
        `http://localhost:3002/api/bookings/updateBooking/${selectedBooking._id}`,
        selectedBooking
      ); // update the booking by Id
      setIsModalOpen(false);
      setBookings(
        (prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === selectedBooking._id ? selectedBooking : booking
          ) // update the bookings with the selected booking
      );
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  // function to handle delete booking
  const handleDelete = (booking) => {
    setBookingToDelete(booking);
    setIsDeleteModalOpen(true);
  };

  // function to confirm delete
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3002/api/bookings/deleteBooking/${bookingToDelete._id}`
      ); // delete the booking by Id
      setIsDeleteModalOpen(false);
      setBookings((prevBookings) =>
        prevBookings.filter((b) => b._id !== bookingToDelete._id)
      ); // remove the deleted booking from the bookings state
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  // function to cancel delete
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setBookingToDelete(null);
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
                <button
                  className="view"
                  onClick={() => handleViewEdit(booking, false)}
                >
                  <i className="fa-solid fa-eye"></i>
                </button>
                <button
                  className="edit"
                  onClick={() => handleViewEdit(booking, true)}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  className="delete"
                  onClick={() => handleDelete(booking)}
                >
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

      {isModalOpen && selectedBooking && !isEditMode && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>View Booking</h2>
              <button
                className="close-icon"
                onClick={() => setIsModalOpen(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="view-booking-details">
              <table>
                <tbody>
                  <tr>
                    <td>Time Slot</td>
                    <td>{formatTimeSlot(selectedBooking.timeSlot)}</td>
                  </tr>
                  <tr>
                    <td>Test</td>
                    <td>{selectedBooking.test}</td>
                  </tr>
                  <tr>
                    <td>Patient ID</td>
                    <td>{selectedBooking.patientId}</td>
                  </tr>
                  <tr>
                    <td>Doctor&#39;s Note</td>
                    <td>{selectedBooking.doctorNote || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Test Status</td>
                    <td>{selectedBooking.testStatus}</td>
                  </tr>
                  <tr>
                    <td>Result</td>
                    <td>{selectedBooking.result || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Location</td>
                    <td>{selectedBooking.location}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && selectedBooking && isEditMode && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Booking</h2>
              <button
                className="close-icon"
                onClick={() => setIsModalOpen(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="edit-booking-form">
              <form>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <label>Time Slot:</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={formatTimeSlot(selectedBooking.timeSlot)}
                          onChange={(e) =>
                            setSelectedBooking({
                              ...selectedBooking,
                              timeSlot: e.target.value,
                            })
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Test:</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={selectedBooking.test}
                          onChange={(e) =>
                            setSelectedBooking({
                              ...selectedBooking,
                              test: e.target.value,
                            })
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Patient ID:</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={selectedBooking.patientId}
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Doctor&#39;s Note:</label>
                      </td>
                      <td>
                        <textarea
                          rows="3"
                          value={selectedBooking.doctorNote}
                          onChange={(e) =>
                            setSelectedBooking({
                              ...selectedBooking,
                              doctorNote: e.target.value,
                            })
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Test Status:</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={selectedBooking.testStatus}
                          onChange={(e) =>
                            setSelectedBooking({
                              ...selectedBooking,
                              testStatus: e.target.value,
                            })
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Result:</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={selectedBooking.result}
                          onChange={(e) =>
                            setSelectedBooking({
                              ...selectedBooking,
                              result: e.target.value,
                            })
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Location:</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={selectedBooking.location}
                          onChange={(e) =>
                            setSelectedBooking({
                              ...selectedBooking,
                              location: e.target.value,
                            })
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="modal-actions">
                  <button type="button" onClick={handleSaveBooking}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && bookingToDelete && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Confirm Deletion</h2>
              <button className="close-icon" onClick={cancelDelete}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="delete-confirmation">
              <p>
                Are you sure you want to delete the booking for{" "}
                <strong>{bookingToDelete.patientId}</strong> on{" "}
                <strong>{formatTimeSlot(bookingToDelete.timeSlot)}</strong>?
              </p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                onClick={confirmDelete}
                className="confirm-delete"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={cancelDelete}
                className="cancel-delete"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {(isModalOpen || isDeleteModalOpen) && (
        <div
          className="modal-overlay"
          onClick={() => {
            if (isModalOpen) setIsModalOpen(false);
            if (isDeleteModalOpen) cancelDelete();
          }}
        ></div>
      )}
    </div>
  );
};

export default ViewBookings;
