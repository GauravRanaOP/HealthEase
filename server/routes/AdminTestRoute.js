import express from "express";
import { createTest } from "../controllers/AdminTestController";
import { getAllTest } from "../controllers/AdminTestController";
import { getOneTest } from "../controllers/AdminTestController";
import { updateTest } from "../controllers/AdminTestController";
import { deleteTest } from "../controllers/AdminTestController";

const AdminTestRoute = express.Router();

AdminTestRoute.post("/addTest", createTest);

AdminTestRoute.get("/getTest", getAllTest);

AdminTestRoute.get("/getTest/:id", getOneTest);

AdminTestRoute.put("/updateTest/:id", updateTest);

AdminTestRoute.delete("/deleteTest/:id", deleteTest);

export default AdminTestRoute;