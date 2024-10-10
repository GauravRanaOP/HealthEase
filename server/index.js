import express from "express";
import cors from "cors"; // Importing CORS


// imports the db.js file to establish the MongoDB connection
import "./config/db.js";

// imports controllers
import DoctorRoute from "./routes/DoctorsRoute.js";
import { getDoctorsByPostcodePrefix } from "./controllers/doctorByPostCodePrefixController.js";
import AdminTestRoute from "./routes/AdminTestRoute.js";
import { getDoctorAppointmentTimeslots } from "./controllers/DoctorAppointmentController.js";


// initializes the app
const app = express();

// middleware to parse JSON data
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // Allow only your frontend's origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
}));


// Routes for doctors
app.use("/api", DoctorRoute);
app.use("/api", AdminTestRoute);

// route to get doctors by postcode prefix
app.get('/api/doctors/postcode/:postcodePrefix', getDoctorsByPostcodePrefix);

// route to get a doctors appointment timeslot
app.get('/api/doctors/availableTimeslots/:doctorId', getDoctorAppointmentTimeslots);

// route to get appointment timeslot using query parameter
app.get('/api/doctors/availableTimeslots', getDoctorAppointmentTimeslots);

// basic route to check if the server is running
app.get("/", (req, res) => {
  res.send("Backend is running");
});


// Error handling for unhandled routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Generic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Listen on port
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`HealthEase app is listening on port ${port}`);
});