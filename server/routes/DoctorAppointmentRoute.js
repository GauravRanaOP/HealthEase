import express from "express";
import { createDoctorAppointments } from "../controllers/DoctorAppointmentController.js";
import { getDoctorAppointmentTimeslots } from "../controllers/DoctorAppointmentController.js";
import { updateDoctorAppointmentTimeslot } from "../controllers/DoctorAppointmentController.js";
import { getOneDoctorAppointmentTimeslot } from "../controllers/DoctorAppointmentController.js";
import { getDoctorsByPostcodePrefix } from "../controllers/DoctorByPostcodePrefixController.js";


const DoctorAppointmentRoute = express.Router();

// route to get a doctor appointment timeslot
DoctorAppointmentRoute.get("/availableTimeslots/:doctorId", getDoctorAppointmentTimeslots);

// route to get appointment timeslots using query parameter
DoctorAppointmentRoute.get("/availableTimeslots", getDoctorAppointmentTimeslots);

// route to update an appointment timeslot
DoctorAppointmentRoute.put("/updateTimeslot/:appointmentId", updateDoctorAppointmentTimeslot);

// route to get appointment timeslot (one)
DoctorAppointmentRoute.get("/availableTimeslot/:appointmentId", getOneDoctorAppointmentTimeslot);

// route to get doctor by postcode
DoctorAppointmentRoute.get("/postcode/:postcodePrefix", getDoctorsByPostcodePrefix);           // query ?name=hemo


export default DoctorAppointmentRoute;
