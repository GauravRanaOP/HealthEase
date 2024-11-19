import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Address from "../models/Address.js";
import mongoose from "mongoose";


// fetches appointments for a specific patient (userId) that are not marked as done
export const getPatientAppointments = async (req, res) => {
    const patientId = req.query.patientId;
    console.log("Fetching appointments for patientId:", patientId);
  
    if (!patientId) {
      return res.status(400).json({ message: "User ID is required. "});
    }
  
    try {
      // converts the string `patientId` to ObjectId
      const objectId = mongoose.Types.ObjectId.isValid(patientId)
      ? new mongoose.Types.ObjectId(patientId)
      : null;

      if (!objectId) {
        return res.status(400).json({ message: "Invalid User ID format." });
      }
      console.log("Fetching appointments for objectId:", objectId);

      // finds appointments for the logged-in user where status is not done
      const appointments = await Appointment.find({
        patientId: objectId,
        visitType: "DoctorVisit",
        doctorId: { $exists: true},
        status: { $ne: "Done"},
        isTimeSlotAvailable: false,
        isDirectTest: false,
      }).sort({ date: 1, time: 1 });
      console.log("Appointments fetched: ", appointments);
  
      if (appointments.length > 0) {
        // populates clinic address
        const appointmentWithClinicAddress = await Promise.all(
          appointments.map(async (appointment) => {
            const doctor = await Doctor.findById(appointment.doctorId).populate('clinicId');
            const clinic = doctor?.clinicId;
  
            let fullAddress = null;
            let clinicName = null;
  
            if (clinic) {
              const address = await Address.findById(clinic.addressId);
              if (address) {
                fullAddress = {
                  streetAddress: address.streetAddress,
                  city: address.city,
                  province: address.province,
                  country: address.country,
                  postCode: address.postCode
                };
                clinicName = clinic.name;
              }
            }
  
            // returns clinic address and name
            return {
              ...appointment.toObject(),
              clinicAddress: fullAddress,
              clinicName: clinicName,
            };
          })
        );
  
        res.status(200).json({ appointments: appointmentWithClinicAddress });
      } else {
        res.status(200).json({ message: "Server error: No upcoming appointments found." });
      }
    } catch (error) {
      console.error("Server error: Error fetching patient appointments:", error);
      res.status(500).json({
        message: "Server error: Error fetching appointments",
        error: error.message,
      });
    }
  
  };
