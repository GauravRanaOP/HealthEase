import express from "express";
import { getPatientAppointments } from "../controllers/PatientAppointmentController.js";
import { getPatientTests } from "../controllers/PatientTestController.js";



const PatientRoute = express.Router();

// route to get appointments booked by patients
PatientRoute.get("/appointments", getPatientAppointments);

// route to get tests booked by patients
PatientRoute.get("/tests", getPatientTests);


export default PatientRoute;
