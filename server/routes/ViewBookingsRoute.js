import express from "express";
import {
  deleteBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
} from "../controllers/ViewBookingsController.js";

const ViewBookingsRoute = express.Router();

// route to get all bookings
ViewBookingsRoute.get("/getBookings", getAllBookings);

// route to get a specific booking by ID
ViewBookingsRoute.get("/getBooking/:id", getBookingById);

// route to update a booking
ViewBookingsRoute.put("/updateBooking/:id", updateBooking);

// route to delete a booking
ViewBookingsRoute.delete("/deleteBooking/:id", deleteBooking);

export default ViewBookingsRoute;