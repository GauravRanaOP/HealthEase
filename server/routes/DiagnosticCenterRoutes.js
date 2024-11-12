import express from "express";
import { createDiagnosticCenter, getAllDiagnosticCenters, getDiagnosticCenterById, updateDiagnosticCenter, deleteDiagnosticCenter } from "../controllers/DiagnosticCenterController.js";

const router = express.Router();

router.post("/", createDiagnosticCenter);
router.get("/", getAllDiagnosticCenters);
router.get("/:id", getDiagnosticCenterById);
router.put("/:id", updateDiagnosticCenter);
router.delete("/:id", deleteDiagnosticCenter);

export default router;