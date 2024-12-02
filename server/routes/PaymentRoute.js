import express from "express";
import { createPaymentIntent } from "../controllers/PaymentController.js";

const PaymentRoute = express.Router();

// endpoint to create payment intent
PaymentRoute.post("/intent", createPaymentIntent);

export default PaymentRoute;