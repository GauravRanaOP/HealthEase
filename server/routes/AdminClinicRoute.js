import express from "express";
import { create, deleteClinic, getAll, getOne, updateClinic } from "../controllers/AdminClinicController.js";

const AdminClinicRoute = express.Router();

AdminClinicRoute.post("/addClinic", create);

AdminClinicRoute.get("/getClinic", getAll);

AdminClinicRoute.get("/getClinic/:id", getOne);

AdminClinicRoute.put("/updateClinic/:id", updateClinic);

AdminClinicRoute.delete("/deleteClinic/:id", deleteClinic);

export default AdminClinicRoute;