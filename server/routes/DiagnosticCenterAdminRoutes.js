import express from "express";
import {
    addAvailability,
    getDiagnosticCenterByAddress,
    getAvailabilities,
    updateAvailability,
    deleteAvailability,
    getAllTests,
    updateTestsOffered,
    getDiagnosticCenterDetails,
    removeTestFromCenter,
} from "../controllers/DiagnosticCenterAdminController.js";

const router = express.Router();

//fetch all tests
router.get("/tests/all", getAllTests);

//fetch diagnostic center details
router.get("/:centerId", getDiagnosticCenterDetails);

//add availability
router.post("/:centerId/availability", addAvailability);

//fetch diagnostic center by user's address id
router.get("/find-by-address/:userId", getDiagnosticCenterByAddress);

//fetch all availabilities for diagnostic center
router.get("/:centerId/availabilities", getAvailabilities);

//update availability
router.put("/:centerId/availabilities/:availabilityId", updateAvailability);

//delete availability
router.delete("/:centerId/availabilities/:availabilityId", deleteAvailability);

//update tests offered by the center
router.put("/:centerId/tests", updateTestsOffered);

//remove a test from the center
router.delete("/:centerId/tests/:testId", removeTestFromCenter);

export default router;