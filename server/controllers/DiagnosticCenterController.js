import DiagnosticCenter from "../models/DiagnosticCenter.js";
import Address from "../models/Address.js";
import Availability from "../models/Availability.js";
import Appointment from "../models/Appointment.js";

//create new diagnostic center
export const createDiagnosticCenter = async (req, res) => {
    const { name, address, contactNo, email, testsOffered, availability } = req.body;

    try {
        const newAddress = new Address(address);
        const savedAddress = await newAddress.save();

        const newAvailability = new Availability(availability);
        const savedAvailability = await newAvailability.save();

        const newCenter = new DiagnosticCenter({
            name,
            contactNo,
            email,
            testsOffered,
            addressId: savedAddress._id,
            availabilityId: savedAvailability._id
        });
        await newCenter.save();

        const timeSlots = generateTimeSlots(availability.startDate, availability.endDate, availability.startTime, availability.endTime, newCenter._id);
        await Appointment.insertMany(timeSlots);

        res.status(201).json(newCenter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//function to generate one-hour time slots
const generateTimeSlots = (startDate, endDate, startTime, endTime, diagnosticCenterId) => {
    const timeSlots = [];
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    for (let date = new Date(startDateObj); date <= endDateObj; date.setDate(date.getDate() + 1)) {
        let currentHour = startHour;
        let currentMinute = startMinute;

        while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
            const slotTime = `${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}`;
            const slotDate = date.toISOString().split("T")[0];

            timeSlots.push({
                date: slotDate,
                time: slotTime,
                isTimeSlotAvailable: true,
                diagnosticCenterId,
                visitType: "DiagnosticTest",
                visitMode: "InPerson",
                status: "Pending",
                comments: "Pending"
            });

            currentHour += 1;
            currentMinute = 0;
        }
    }

    return timeSlots;
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