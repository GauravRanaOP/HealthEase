import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Address from "../models/Address.js";


// fetches appointments for a specific patient (userId) that are not marked as done
export const getPatientAppointments = async (req, res) => {
    const patientId = req.query.patientId;
  
    // gets the patientId
    if (!patientId) {
      return res.status(400).json({ message: "User ID is required. "});
    }
  
    try {
      // finds appointments for the logged-in user where status is not done
      const appointments = await Appointment.find({
        patientId: patientId,
        status: { $ne: "Done"},
      }).sort({ date: 1, time: 1 });
  
      if (appointments.length > 0) {
        // populated clinic address
        const appointmentWithClinicAddress = await Promise.all(
          appointments.map(async (appointment) => {
            const doctor = await Doctor.findById(appointment.doctorId).populate('clinicId');
            const clinic = doctor?.clinicId;
  
            // retrieves clinic address
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
  