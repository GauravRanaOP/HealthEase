import express from "express";
import { getBookedAppointments, updateAppointment } from "../controllers/ViewBookingsController.js";

const ViewBookingsRoute = express.Router();

//route to fetch booked appointments
ViewBookingsRoute.get("/getBookedAppointments", getBookedAppointments);

// Route to update an appointment's Test Status and Result
ViewBookingsRoute.put("/:id", updateAppointment);

export default ViewBookingsRoute;