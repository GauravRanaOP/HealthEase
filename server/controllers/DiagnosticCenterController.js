import DiagnosticCenter from "../models/DiagnosticCenter.js";

//create new diagnostic center
export const createDiagnosticCenter = async (req, res) => {
    const { name, address, contactNo, email, testsOffered, availabilityId } = req.body;

    try {
        const newCenter = new DiagnosticCenter({ name, contactNo, email, testsOffered });
        await newCenter.save();
        res.status(201).json(newCenter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//get all diagnostic centers
export const getAllDiagnosticCenters = async (req, res) => {
    try {
        const centers = await DiagnosticCenter.find();
        res.status(200).json(centers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//get diagnostic center by id
export const getDiagnosticCenterById = async (req, res) => {
    try {
        const center = await DiagnosticCenter.findById(req.params.id);
        if (!center) return res.status(404).json({ message: "Diagnostic center not found" });
        res.status(200).json(center);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//update diagnostic center
export const updateDiagnosticCenter = async (req, res) => {
    try {
        const updatedCenter = await DiagnosticCenter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCenter) return res.status(404).json({ message: "Diagnostic center not found" });
        res.status(200).json(updatedCenter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//delete diagnostic center
export const deleteDiagnosticCenter = async (req, res) => {
    try {
        const deletedCenter = await DiagnosticCenter.findByIdAndDelete(req.params.id);
        if (!deletedCenter) return res.status(404).json({ message: "Diagnostic center not found" });
        res.status(200).json({ message: "Diagnostic center deleted" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};