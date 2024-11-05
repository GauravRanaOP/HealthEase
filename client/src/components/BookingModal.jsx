import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";

const BookingModal = ({ booking, isOpen, isEditMode, onClose, onSave }) => {
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    if (isOpen && booking) {
      // Using a functional update for the initial state
      setFormValues((prevValues) => ({
        ...prevValues,
        timeSlot: booking.timeSlot,
        test: booking.test,
        patientId: booking.patientId,
        doctorNote: booking.doctorNote,
        testStatus: booking.testStatus,
        result: booking.result,
        location: booking.location,
      }));
    }
  }, [isOpen, booking]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }, []);

  const formatTimeSlot = useCallback((timeSlot) => {
    return new Date(timeSlot).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...booking, ...formValues });
  };

  if (!isOpen) return null;

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
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="timeSlot">Time Slot:</label>
                <input
                  type="text"
                  id="timeSlot"
                  name="timeSlot"
                  value={formatTimeSlot(formValues.timeSlot) || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="test">Test:</label>
                <input
                  type="text"
                  id="test"
                  name="test"
                  value={formValues.test || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="patientId">Patient ID:</label>
                <input
                  type="text"
                  id="patientId"
                  name="patientId"
                  value={formValues.patientId || ""}
                  disabled
                />
              </div>
              <div className="form-group">
                <label htmlFor="doctorNote">Doctor&apos;s Note:</label>
                <textarea
                  id="doctorNote"
                  name="doctorNote"
                  rows="3"
                  value={formValues.doctorNote || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="testStatus">Test Status:</label>
                <input
                  type="text"
                  id="testStatus"
                  name="testStatus"
                  value={formValues.testStatus || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="result">Result:</label>
                <input
                  type="text"
                  id="result"
                  name="result"
                  value={formValues.result || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formValues.location || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-actions">
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="modal-view-booking-details">
            <div className="booking-details-card">
              <div className="detail-label">Time Slot</div>
              <div className="detail-value">
                {formatTimeSlot(booking.timeSlot)}
              </div>
            </div>
            <div className="booking-details-card">
              <div className="detail-label">Test</div>
              <div className="detail-value">{booking.test}</div>
            </div>
            <div className="booking-details-card">
              <div className="detail-label">Patient ID</div>
              <div className="detail-value">{booking.patientId}</div>
            </div>
            <div className="booking-details-card">
              <div className="detail-label">Doctor&apos;s Note</div>
              <div className="detail-value">{booking.doctorNote || "N/A"}</div>
            </div>
            <div className="booking-details-card">
              <div className="detail-label">Test Status</div>
              <div className="detail-value">{booking.testStatus}</div>
            </div>
            <div className="booking-details-card">
              <div className="detail-label">Result</div>
              <div className="detail-value">{booking.result || "N/A"}</div>
            </div>
            <div className="booking-details-card">
              <div className="detail-label">Location</div>
              <div className="detail-value">{booking.location}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

BookingModal.propTypes = {
  booking: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default BookingModal;
