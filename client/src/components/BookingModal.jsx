import PropTypes from "prop-types";

// booking modal component for view and edit bookings
const BookingModal = ({ booking, isOpen, isEditMode, onClose, onSave }) => {
  if (!isOpen) return null;

  // function to format time slot
  const formatTimeSlot = (timeSlot) => {
    const date = new Date(timeSlot);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditMode ? "Edit Booking" : "View Booking"}</h2>
          <button className="modal-close-icon" onClick={onClose}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        {isEditMode ? (
          <div className="modal-edit-booking-form">
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
                        value={formatTimeSlot(booking.timeSlot)}
                        onChange={(e) =>
                          onSave({ ...booking, timeSlot: e.target.value })
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
                        value={booking.test}
                        onChange={(e) =>
                          onSave({ ...booking, test: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>Patient ID:</label>
                    </td>
                    <td>
                      <input type="text" value={booking.patientId} disabled />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>Doctor&apos;s Note:</label>
                    </td>
                    <td>
                      <textarea
                        rows="3"
                        value={booking.doctorNote}
                        onChange={(e) =>
                          onSave({ ...booking, doctorNote: e.target.value })
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
                        value={booking.testStatus}
                        onChange={(e) =>
                          onSave({ ...booking, testStatus: e.target.value })
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
                        value={booking.result}
                        onChange={(e) =>
                          onSave({ ...booking, result: e.target.value })
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
                        value={booking.location}
                        onChange={(e) =>
                          onSave({ ...booking, location: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="modal-actions">
                <button type="button" onClick={() => onSave(booking)}>
                  Save
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="modal-view-booking-details">
            <table>
              <tbody>
                <tr>
                  <td>Time Slot</td>
                  <td>{formatTimeSlot(booking.timeSlot)}</td>
                </tr>
                <tr>
                  <td>Test</td>
                  <td>{booking.test}</td>
                </tr>
                <tr>
                  <td>Patient ID</td>
                  <td>{booking.patientId}</td>
                </tr>
                <tr>
                  <td>Doctor&apos;s Note</td>
                  <td>{booking.doctorNote || "N/A"}</td>
                </tr>
                <tr>
                  <td>Test Status</td>
                  <td>{booking.testStatus}</td>
                </tr>
                <tr>
                  <td>Result</td>
                  <td>{booking.result || "N/A"}</td>
                </tr>
                <tr>
                  <td>Location</td>
                  <td>{booking.location}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// prop types for booking modal
BookingModal.propTypes = {
  booking: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default BookingModal;
