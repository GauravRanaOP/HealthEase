import express from "express";
import {
  getDoctorsClinic,
  getDoctorAvailability,
  addDoctorAvailability,
  updateDoctorAvailability,
  deleteDoctorAvailability,
  getOneDoctorAvailability,
} from "../controllers/DoctorAvailabilityController.js";

const DoctorAvailabilityRoute = express.Router();

DoctorAvailabilityRoute.get("/doctors/by-clinic/:clinicId", getDoctorsClinic);

DoctorAvailabilityRoute.get(
  "/getDoctorAvailability/:id",
  getDoctorAvailability
);

DoctorAvailabilityRoute.get(
  "/getOneDoctorAvailability/:id",
  getOneDoctorAvailability
);

DoctorAvailabilityRoute.post("/addDoctorAvailability", addDoctorAvailability);

DoctorAvailabilityRoute.put("/availability/:id", updateDoctorAvailability);

DoctorAvailabilityRoute.delete("/availability/:id", deleteDoctorAvailability);

export default DoctorAvailabilityRoute;
