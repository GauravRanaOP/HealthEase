import express from "express";
import { createPaymentIntent } from "../controllers/PaymentController.js";

const PaymentRoute = express.Router();

// endpoint to create payment intent
PaymentRoute.get("/intent", createPaymentIntent);