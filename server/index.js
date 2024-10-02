import express from "express";
import cors from "cors"; // Importing CORS


// imports the db.js file to establish the MongoDB connection
import "./config/db.js";

// imports controllers
import DoctorRoute from "./routes/DoctorsRoute.js";
import { getDoctorsByPostcodePrefix } from "./controllers/doctorByPostCodePrefixController.js";

// initializes the app
const app = express();

// middleware to parse JSON data
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // Allow only your frontend's origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
}));

// Basic route to check if the server is running
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Routes for doctors
app.use("/api", DoctorRoute);

// route to get doctors by postcode prefix
app.get('/api/doctors/postcode/:postcodePrefix', getDoctorsByPostcodePrefix);


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