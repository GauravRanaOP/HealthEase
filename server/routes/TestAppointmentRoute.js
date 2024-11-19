import express from "express";
import { createTestAppointments } from "../controllers/TestAppointmentController.js";
import { getTestAppointmentTimeslots } from "../controllers/TestAppointmentController.js";
import { updateTestAppointmentTimeslot } from "../controllers/TestAppointmentController.js";
import { getOneTestAppointmentTimeslot } from "../controllers/TestAppointmentController.js";
import { getTestByName } from "../controllers/TestController.js";
import { getTestById } from "../controllers/TestController.js";

const TestAppointmentRoute = express.Router();

// route to get a test appointment timeslot
TestAppointmentRoute.get("/availableTimeslots/:diagnosticCenterId", getTestAppointmentTimeslots);

// route to get appointment timeslots using query parameter
TestAppointmentRoute.get("/availableTimeslots", getTestAppointmentTimeslots);

// route to update an appointment timeslot
TestAppointmentRoute.put("/updateTimeslot/:appointmentId", updateTestAppointmentTimeslot);

// route to get appointment timeslot (one)
TestAppointmentRoute.get("/availableTimeslot/:appointmentId", getOneTestAppointmentTimeslot);

// route to get tests by name
TestAppointmentRoute.get("/name", getTestByName);           // query ?name=hemo
TestAppointmentRoute.get("/name/:name", getTestByName);     // path /name/hemo

// route to get tests by id
TestAppointmentRoute.get("/:id", getTestById);


export default TestAppointmentRoute;
