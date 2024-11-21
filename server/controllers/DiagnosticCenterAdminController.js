import DiagnosticCenter from "../models/DiagnosticCenter.js";
import User from "../models/User.js";
import Availability from "../models/Availability.js";
import Appointment from "../models/Appointment.js";
import Test from "../models/Test.js";

//add availability for diagnostic center
export const addAvailability = async (req, res) => {
    const { centerId } = req.params;
    const { startDate, endDate, startTime, endTime } = req.body;

    try {
        //check if diagnostic center exists
        const center = await DiagnosticCenter.findById(centerId);
        if (!center) {
            return res.status(404).json({ message: "Diagnostic center not found" });
        }

        //create and save availability
        const newAvailability = new Availability({
            startDate,
            endDate,
            startTime,
            endTime,
            diagnosticCenterId: centerId,
            type: "DiagnosticCenter",
        });

        const savedAvailability = await newAvailability.save();

        //generate and save time slots in Appointment model
        const timeSlots = generateTimeSlots(startDate, endDate, startTime, endTime, centerId);
        await Appointment.insertMany(timeSlots);

        res.status(201).json({ message: "Availability and time slots created successfully." });
    } catch (error) {
        console.error("Error in addAvailability:", error.message);
        res.status(500).json({ message: error.message });
    }
};

//find diagnostic center by user's address id
export const getDiagnosticCenterByAddress = async (req, res) => {
    const { userId } = req.params;

    try {
        //find user document
        const user = await User.findById(userId);
        if (!user || !user.addressId) {
            return res.status(404).json({ message: "User or Address ID not found." });
        }

        //find diagnostic center by address id
        const center = await DiagnosticCenter.findOne({ addressId: user.addressId });
        if (!center) {
            return res.status(404).json({ message: "Diagnostic center not found." });
        }

        res.status(200).json(center);
    } catch (error) {
        console.error("Error fetching Diagnostic Center:", error.message);
        res.status(500).json({ message: error.message });
    }
};

//fetch diagnostic center details
export const getDiagnosticCenterDetails = async (req, res) => {
    const { centerId } = req.params;

    try {
        const center = await DiagnosticCenter.findById(centerId).populate({
            path: 'testsOffered',
            select: 'name _id',
        });
        if (!center) {
            return res.status(404).json({ message: "Diagnostic center not found." });
        }

        res.status(200).json(center);
    } catch (error) {
        console.error("Error fetching diagnostic center details:", error.message);
        res.status(500).json({ message: error.message });
    }
};

//fetch all availabilities for a diagnostic center
export const getAvailabilities = async (req, res) => {
    const { centerId } = req.params;

    try {
        const availabilities = await Availability.find({ diagnosticCenterId: centerId });
        res.status(200).json(availabilities);
    } catch (error) {
        console.error("Error fetching availabilities:", error.message);
        res.status(500).json({ message: error.message });
    }
};

//update availability
export const updateAvailability = async (req, res) => {
    const { centerId, availabilityId } = req.params;

    try {
        const updatedAvailability = await Availability.findOneAndUpdate(
            { _id: availabilityId, diagnosticCenterId: centerId },
            req.body,
            { new: true }
        );

        if (!updatedAvailability) {
            return res.status(404).json({ message: "Availability not found." });
        }

        res.status(200).json(updatedAvailability);
    } catch (error) {
        console.error("Error updating availability:", error.message);
        res.status(500).json({ message: error.message });
    }
};

//delete availability
export const deleteAvailability = async (req, res) => {
    const { centerId, availabilityId } = req.params;

    try {
        const deletedAvailability = await Availability.findOneAndDelete({
            _id: availabilityId,
            diagnosticCenterId: centerId,
        });

        if (!deletedAvailability) {
            return res.status(404).json({ message: "Availability not found." });
        }

        res.status(200).json({ message: "Availability deleted successfully." });
    } catch (error) {
        console.error("Error deleting availability:", error.message);
        res.status(500).json({ message: error.message });
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
                comments: "Pending",
            });

            currentHour += 1;
            currentMinute = 0;
        }
    }

    return timeSlots;
};

//update tests offered by diagnostic center
export const updateTestsOffered = async (req, res) => {
    const { centerId } = req.params;
    const { tests } = req.body;

    try {
        //validate test ids
        const validTests = await Test.find({ _id: { $in: tests } });
        if (validTests.length !== tests.length) {
            return res.status(400).json({ message: "Some test IDs are invalid." });
        }

        //update the diagnostic center with selected tests
        const updatedCenter = await DiagnosticCenter.findByIdAndUpdate(
            centerId,
            { testsOffered: tests },
            { new: true }
        ).populate({
            path: 'testsOffered',
            select: 'name _id',
        });

        if (!updatedCenter) {
            return res.status(404).json({ message: "Diagnostic center not found." });
        }

        res.status(200).json({
            message: "Tests updated successfully.",
            center: updatedCenter,
        });
    } catch (error) {
        console.error("Error updating tests offered:", error.message);
        res.status(500).json({ message: error.message });
    }
};

//remove a test from diagnostic center
export const removeTestFromCenter = async (req, res) => {
    const { centerId, testId } = req.params;

    try {
        const center = await DiagnosticCenter.findById(centerId);
        if (!center) {
            return res.status(404).json({ message: "Diagnostic center not found." });
        }

        //remove the testId from testsOffered
        center.testsOffered = center.testsOffered.filter(
            (test) => test.toString() !== testId
        );

        await center.save();

        //populate the updated testsOffered
        const populatedCenter = await DiagnosticCenter.findById(centerId).populate('testsOffered');

        res.status(200).json({
            message: "Test removed successfully.",
            center: populatedCenter,
        });
    } catch (error) {
        console.error("Error removing test:", error.message);
        res.status(500).json({ message: error.message });
    }
};

//fetch all tests
export const getAllTests = async (req, res) => {
    try {
        const tests = await Test.find();
        res.status(200).json(tests);
    } catch (error) {
        console.error("Error fetching tests:", error.message);
        res.status(500).json({ message: error.message });
    }
};
