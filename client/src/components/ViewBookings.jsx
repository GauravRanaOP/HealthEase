import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/ViewBookings.css";
import Pagination from "./Pagination";
import BookingModal from "./BookingModal";
import DeleteModal from "./DeleteModal";
import SideBar from "./SideBar";

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(8);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // hook to fetch bookings data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3002/api/bookings/getBookings"
        );
        setBookings(data); // set bookings
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchData();
  }, []);

  // function to format time slot
  const formatTimeSlot = (timeSlot) => {
    return new Date(timeSlot).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  // function to handle booking view/edit
  const handleViewEdit = (booking, editMode = false) => {
    setSelectedBooking(booking);
    setIsEditMode(editMode);
    setIsModalOpen(true);
  };

  // function to save booking
  const handleSaveBooking = async (updatedBooking) => {
    try {
      await axios.put(
        `http://localhost:3002/api/bookings/updateBooking/${updatedBooking._id}`,
        updatedBooking
      );
      setIsModalOpen(false);
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === updatedBooking._id ? updatedBooking : booking
        )
      ); // update local state
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  // function to handle delete action
  const handleDelete = (booking) => {
    setBookingToDelete(booking);
    setIsDeleteModalOpen(true);
  };

  // function to confirm delete
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3002/api/bookings/deleteBooking/${bookingToDelete._id}`
      );
      setIsDeleteModalOpen(false);
      setBookings((prevBookings) =>
        prevBookings.filter((b) => b._id !== bookingToDelete._id)
      ); // update local state
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  // function to cancel delete
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setBookingToDelete(null);
  };

  // function to filter bookings based on search query
  const filteredBookings = bookings.filter((booking) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return Object.values(booking).some((value) =>
      String(value).toLowerCase().includes(lowerCaseQuery)
    ); // check if any field contains the search query
  });

  // paginate as per search query
  const currentBookings = filteredBookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

  // handle page change
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="app-layout">
      <SideBar />
      <div className="bookings-table-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Patients"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="table-responsive">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Time Slot</th>
                <th>Test</th>
                <th>Patient ID</th>
                <th>Test Status</th>
                <th>Result</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{formatTimeSlot(booking.timeSlot)}</td>
                  <td>{booking.test}</td>
                  <td>{booking.patientId}</td>
                  <td>{booking.testStatus}</td>
                  <td>{booking.result}</td>
                  <td>{booking.location}</td>
                  <td className="action-buttons">
                    <i
                      className="fa-solid fa-eye"
                      onClick={() => handleViewEdit(booking)}
                    ></i>
                    <i
                      className="fa-solid fa-pen-to-square"
                      onClick={() => handleViewEdit(booking, true)}
                    ></i>
                    <i
                      className="fa-solid fa-trash-can"
                      onClick={() => handleDelete(booking)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredBookings.length / bookingsPerPage)}
          onPageChange={handlePageChange}
        />

        <BookingModal
          booking={selectedBooking}
          isOpen={isModalOpen}
          isEditMode={isEditMode}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveBooking}
        />

        <DeleteModal
          isOpen={isDeleteModalOpen}
          booking={bookingToDelete}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
        />

        {(isModalOpen || isDeleteModalOpen) && (
          <div
            className="modal-overlay"
            onClick={() => {
              isModalOpen ? setIsModalOpen(false) : cancelDelete();
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default ViewBookings;
