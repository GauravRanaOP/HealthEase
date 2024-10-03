import express from "express";
import { create, deleteDoctor, getAll, getOne, updateDoctor } from "../controllers/DoctorController.js";

const DoctorRoute = express.Router();

DoctorRoute.post("/addDoctor", create);

DoctorRoute.get("/getDoctor", getAll);

DoctorRoute.get("/getDoctor/:id", getOne);

DoctorRoute.put("/updateDoctor/:id", updateDoctor);

DoctorRoute.delete("/deleteDoctor/:id", deleteDoctor);

export default DoctorRoute;