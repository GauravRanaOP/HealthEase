import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

//get all booked appointments
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

//update an existing appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, testResult } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status, testResult },
      { new: true }
    ); //set true to get the updated data

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};