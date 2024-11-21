import express from "express";
import { getUserDetails } from "../controllers/UserController.js";

const UserRoute = express.Router();

// endpoint to get user details by ID
UserRoute.get("/", getUserDetails);

export default UserRoute;