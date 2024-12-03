import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

export const getBookedAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      visitType: "DiagnosticTest",
      isTimeSlotAvailable: false,
    })
      .populate({
        path: "patientId",
        model: User,
        select: "email",
      }) //populate patientId to get email from User model
      .lean();

    //add visitMode to each appointment's diagnostic center value
    appointments.forEach((appointment) => {
      appointment.location = appointment.visitMode;
    });

    if (!appointments.length) {
      return res.status(404).json({ msg: "No booked appointments found." });
    }
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching booked appointments:", error.message);
    res.status(500).json({ error: error.message });
  }
};