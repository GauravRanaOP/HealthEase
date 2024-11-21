import Appointment from "../models/Appointment.js";
import Address from "../models/Address.js";
import DiagnosticCenter from "../models/DiagnosticCenter.js";
import mongoose from "mongoose";


// fetches tests for a specific patient (userId) that are not marked as done
export const getPatientTests = async (req, res) => {
    const patientId = req.query.patientId;
  
    // gets the patientId
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
      

      // finds tests with visitType and status is not equal to "Done"
      const tests = await Appointment.find({
        patientId: patientId,
        visitType: "DiagnosticTest",
        diagnosticCenterId: { $exists: true},
        status: { $ne: "Done"},
        isTimeSlotAvailable: false,
        isDirectTest: true,
      }).sort({ date: 1, time: 1 });
  
      if (tests.length > 0) {
        // populates diagnostic center address
        const testsWithDiagnosticCenter = await Promise.all(
            tests.map(async (test) => {
            const diagnosticCenter = await DiagnosticCenter.findById(test.diagnosticCenterId);
            
            let fullAddress = null;
            let dcName = null;
  
            if (diagnosticCenter) {
              const address = await Address.findById(diagnosticCenter.addressId);
              if (address) {
                fullAddress = {
                  streetAddress: address.streetAddress,
                  city: address.city,
                  province: address.province,
                  country: address.country,
                  postCode: address.postCode
                };
              }
              dcName = diagnosticCenter.name;
            }
  
            // returns clinic address and name
            return {
              ...test.toObject(),
              diagnosticCenterAddress: fullAddress,
              diagnosticCenterName: dcName,
            };
          })
        );
  
        res.status(200).json({ tests: testsWithDiagnosticCenter });
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
  