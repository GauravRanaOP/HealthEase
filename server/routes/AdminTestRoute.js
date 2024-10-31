import express from "express";
import { createTest } from "../controllers/AdminTestController.js";
import { getAllTest } from "../controllers/AdminTestController.js";
import { getOneTest } from "../controllers/AdminTestController.js";
import { updateTest } from "../controllers/AdminTestController.js";
import { deleteTest } from "../controllers/AdminTestController.js";

const AdminTestRoute = express.Router();

AdminTestRoute.post("/addTest", createTest);

AdminTestRoute.get("/getTest", getAllTest);

AdminTestRoute.get("/getTest/:id", getOneTest);

AdminTestRoute.put("/updateTest/:id", updateTest);

AdminTestRoute.delete("/deleteTest/:id", deleteTest);

export default AdminTestRoute;