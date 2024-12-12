import express from "express";
import cors from "cors"; // Importing CORS
import { updateAppointmentStatuses } from "./utils/scheduler.js";

// imports the db.js file to establish the MongoDB connection
import "./config/db.js";

// imports controllers
import DoctorRoute from "./routes/DoctorsRoute.js";
import AdminTestRoute from "./routes/AdminTestRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import ViewBookingsRoute from "./routes/ViewBookingsRoute.js";
import AdminClinicRoute from "./routes/AdminClinicRoute.js";
import DiagnosticCenterRoutes from "./routes/DiagnosticCenterRoutes.js";
import UserRoute from "./routes/UserRoute.js";
import TestAppointmentRoute from "./routes/TestAppointmentRoute.js";
import DiagnosticCenterAdminRoutes from "./routes/DiagnosticCenterAdminRoutes.js";
import PaymentRoute from "./routes/PaymentRoute.js";
import DoctorAppointmentRoute from "./routes/DoctorAppointmentRoute.js";
import PatientRoute from "./routes/PatientRoute.js";
import DoctorAvailabilityRoute from "./routes/DoctorAvailabilityRoute.js";

// initializes the app
const app = express();

// middleware to parse JSON data
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://musical-marzipan-1ecaac.netlify.app/",
    ], // Allow only your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
  })
);

// Routes for doctors
app.use("/api", DoctorRoute);
app.use("/api", AdminTestRoute);
app.use("/api", AdminClinicRoute);
app.use("/api", DoctorAvailabilityRoute);

// Routes for Authentication
app.use("/api/auth", AuthRoute);

// View Bookings routes for Diagnostic Center
app.use("/api/appointments", ViewBookingsRoute);

// Routes for Diagnostic Center
app.use("/api/diagnostic-centers", DiagnosticCenterRoutes);

// Routes for Diagnostic Center Admin
app.use("/api/diagnostic-centers", DiagnosticCenterAdminRoutes);

// routes for user
app.use("/api/user", UserRoute);

// routes for test appointment
app.use("/api/test", TestAppointmentRoute);

// routes for payment
app.use("/api/payment", PaymentRoute);

// routes for doctor appointment
app.use("/api/doctor", DoctorAppointmentRoute);

// routes for patient
app.use("/api/patient", PatientRoute);

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
