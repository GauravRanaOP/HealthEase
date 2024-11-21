import DiagnosticCenter from "../models/DiagnosticCenter.js";
import Address from "../models/Address.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

//create new diagnostic center
export const createDiagnosticCenter = async (req, res) => {
    const { name, email, password, contactNo, address } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAddress = new Address(address);
        const savedAddress = await newAddress.save();

        const newCenter = new DiagnosticCenter({
            name,
            contactNo,
            email,
            addressId: savedAddress._id,
        });
        const savedCenter = await newCenter.save();

        const newUser = new User({
            email,
            password: hashedPassword,
            contactNo,
            userRole: "DiagnosticCenterAdmin",
            addressId: savedAddress._id,
        });
        await newUser.save();

        const populatedCenter = await DiagnosticCenter.findById(savedCenter._id).populate("addressId");

        res.status(201).json(populatedCenter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//get all diagnostic centers
export const getAllDiagnosticCenters = async (req, res) => {
    try {
        const centers = await DiagnosticCenter.find().populate("addressId");
        res.status(200).json(centers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//get diagnostic center by id
export const getDiagnosticCenterById = async (req, res) => {
    try {
        const center = await DiagnosticCenter.findById(req.params.id).populate("addressId");
        if (!center) return res.status(404).json({ message: "Diagnostic center not found" });
        res.status(200).json(center);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//update diagnostic center
export const updateDiagnosticCenter = async (req, res) => {
    try {
        const updatedCenter = await DiagnosticCenter.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).populate("addressId");
        if (!updatedCenter) return res.status(404).json({ message: "Diagnostic center not found" });
        res.status(200).json(updatedCenter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//delete diagnostic center
export const deleteDiagnosticCenter = async (req, res) => {
    try {
        const center = await DiagnosticCenter.findById(req.params.id);

        if (!center) {
            return res.status(404).json({ message: "Diagnostic center not found" });
        }

        const deletedAddress = await Address.findByIdAndDelete(center.addressId);

        if (!deletedAddress) {
            console.warn(`Address with ID ${center.addressId} not found. It may have been deleted already.`);
        }

        await DiagnosticCenter.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Diagnostic center and associated address deleted successfully." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};