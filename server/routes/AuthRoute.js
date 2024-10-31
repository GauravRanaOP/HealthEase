import express from "express";

import { login } from "../controllers/AuthRouteController.js";
import { register } from "../controllers/AuthRouteController.js";

const AuthRoute = express.Router();

AuthRoute.post("/login", login);

AuthRoute.post("/register", register);

export default AuthRoute;
