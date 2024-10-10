import mongoose from "mongoose";
import { createDoctorAppointments } from "../controllers/DoctorAppointmentController.js";
import connectToDatabase from "./db.js";

const run = async () => {
  await connectToDatabase();

  // calls the function to create doctor's appointment timeslots
  await createDoctorAppointments();

  // closes the connection
  mongoose.connection.close();
};

// execute the run function
run().catch((error) => {
  console.error("Error running the appointment creation script: ", error);
  // closes the connection on error
  mongoose.connection.close();
});
