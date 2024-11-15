import express from "express";
import { createTestAppointments } from "../controllers/TestAppointmentController.js";
import { getTestAppointmentTimeslots } from "../controllers/TestAppointmentController.js";
import { updateTestAppointmentTimeslot } from "../controllers/TestAppointmentController.js";
import { getOneTestAppointmentTimeslot } from "../controllers/TestAppointmentController.js";
import { getAllTestByName } from "../controllers/TestController.js";

const TestAppointmentRoute = express.Router();

// route to get a test appointment timeslot
TestAppointmentRoute.get("/availableTimeslots/:diagnosticCenterId", getTestAppointmentTimeslots);

// route to get appointment timeslots using query parameter
TestAppointmentRoute.get("/availableTimeslots", getTestAppointmentTimeslots);

// route to update an appointment timeslot
TestAppointmentRoute.post("/updateTimeslot/:appointmentId", updateTestAppointmentTimeslot);

// route to get appointment timeslot (one)
TestAppointmentRoute.get("/availableTimeslot/:appointmentId", getOneTestAppointmentTimeslot);

// route to get tests by name
TestAppointmentRoute.get("/name", getAllTestByName);

export default TestAppointmentRoute;
