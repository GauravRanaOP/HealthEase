import Booking from "../models/Booking.js";

// get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find(); // find all bookings

    // check if there are any bookings
    if (!bookings.length) {
      return res.status(404).json({ msg: "No bookings found." });
    }
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get a single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId); // find the booking by Id

    // check if the booking exists
    if (!booking) {
      return res.status(404).json({ msg: "Booking not found." });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update a booking
export const updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const updatedBooking = await Booking.findByIdAndUpdate(bookingId, req.body, { new: true }); // update the booking with the new data

    // check if the booking exists
    if (!updatedBooking) {
      return res.status(404).json({ msg: "Booking not found." });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete a booking
export const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const deletedBooking = await Booking.findByIdAndDelete(bookingId); // delete the booking by Id

    // check if the booking exists
    if (!deletedBooking) {
      return res.status(404).json({ msg: "Booking not found." });
    }
    res.status(200).json({ msg: "Booking deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
