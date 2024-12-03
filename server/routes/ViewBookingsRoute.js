import express from "express";
import { getBookedAppointments } from "../controllers/ViewBookingsController.js";

const ViewBookingsRoute = express.Router();

//route to fetch booked appointments
ViewBookingsRoute.get("/getBookedAppointments", getBookedAppointments);

export default ViewBookingsRoute;