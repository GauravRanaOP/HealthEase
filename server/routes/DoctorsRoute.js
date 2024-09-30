import express from "express";
import { getAll } from "../controllers/DoctorController.js";

const DoctorRoute = express.Router();

DoctorRoute.get("/getDoctor", getAll);

export default DoctorRoute;