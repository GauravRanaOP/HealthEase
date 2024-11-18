import PropTypes from "prop-types";

// delete modal component for delete bookings
const DeleteModal = ({ isOpen, booking, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modals">
      <div className="modals-content">
          <h2>Confirm Deletion</h2>
          <span className="close" onClick={onClose}>&times;</span>
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
  booking: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default DeleteModal;
