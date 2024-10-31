import PropTypes from "prop-types";

// delete modal component for delete bookings
const DeleteModal = ({ isOpen, booking, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Confirm Deletion</h2>
          <button className="modal-close-icon" onClick={onClose}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        <div className="modal-delete-confirmation">
          <p>
            Are you sure you want to delete the booking for{" "}
            <strong>{booking.patientId}</strong> on{" "}
            <strong>
              {new Date(booking.timeSlot).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </strong>
            ?
          </p>
        </div>
        <div className="modal-actions">
          <button
            type="button"
            onClick={onConfirm}
            className="modal-confirm-delete"
          >
            Yes, Delete
          </button>
          <button
            type="button"
            onClick={onClose}
            className="modal-cancel-delete"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// prop types for delete modal
DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  booking: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default DeleteModal;
