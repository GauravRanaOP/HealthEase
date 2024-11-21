import cron from "node-cron";
import Appointment from "../models/Appointment.js";


// function to update appointment statuses
export const updateAppointmentStatuses = async () => {
  try {
    console.log("Scheduler: Checking appointments...");

    // updates Doctor appointments with a valid doctorId
    const doctorAppointments = await Appointment.find({
      visitType: "DoctorVisit",
      doctorId: { $exists: true },
      isTimeSlotAvailable: false,
      isDirectTest: false,
      // avoids processing already updated appointments
      status: { $ne: "Doctor Note Avaiable" },
    });

    for (const appointment of doctorAppointments) {
      if (appointment.doctorNote) {
        appointment.status = "Doctor Note Avaiable";
        await appointment.save();
        console.log(
          `Appointment ${appointment._id}: Status updated to Doctor Note Avaiable`
        );

        
      }
    }

    // updates Diagnostic Center appointments with a valid testResults
    const diagnosticAppointments = await Appointment.find({
      visitType: "DiagnosticTest",
      diagnosticCenterId: { $exists: true },
      isTimeSlotAvailable: false,
      isDirectTest: true,
    });

    for (const appointment of diagnosticAppointments) {
      if (appointment.testResult) {
        appointment.status = "Test Results Available";
        await appointment.save();
        console.log(
          `Appointment ${appointment._id}: Status updated to Test Results Available`
        );
        

      } else if (appointment.status !== "Result Pending At DC") {
        appointment.status = "Result Pending At DC";
        await appointment.save();
        console.log(`Appointment ${appointment._id}: Status updated to Result Pending At DC`);

      }
    }

    console.log("Scheduler: Appointment status update complete.");
  } catch (error) {
    console.error("Error in updating appointment statuses:", error);
    
  }
};

// function to revert previous appointment status updates
export const revertAppointmentStatuses = async () => {
  try {
    console.log("Scheduler: Reverting appointment statuses...");

    // Revert updates for Doctor appointments
    const doctorAppointments = await Appointment.find({
      visitType: "DoctorVisit",
      doctorId: { $exists: true },
      isTimeSlotAvailable: true,
      //isDirectTest: false,
    });

    for (const appointment of doctorAppointments) {
      if (appointment.status === "DoctorNoteAvaiable") {
        appointment.status = "Pending"; // Revert the status or set it to the previous value
        appointment.comments = "Reverted";
        await appointment.save();
        console.log(
          `Appointment ${appointment._id}: Status reverted and isTimeSlotAvailable set to false`
        );
      }
    }

    // Revert updates for Diagnostic test appointments
    const diagnosticAppointments = await Appointment.find({
      visitType: "DiagnosticTest",
      diagnosticCenterId: { $exists: true },
      isTimeSlotAvailable: true,
      //isDirectTest: true,
    });

    for (const appointment of diagnosticAppointments) {
      if (
        appointment.status === "TestResultsAvailable" ||
        appointment.status === "TestPendingAtDC"
      ) {
        appointment.status = "Pending"; // Revert the status
        appointment.comments = "Reverted";
        await appointment.save();
        console.log(
          `Appointment ${appointment._id}: Status reverted and isTimeSlotAvailable set to false`
        );
      }
    }

    console.log("Scheduler: Appointment status revert complete.");
  } catch (error) {
    console.error("Error in reverting appointment statuses:", error);
    // write code to send notification here
  }
};

//schedule the function to run every 15 minutes
cron.schedule("*/15 * * * *", updateAppointmentStatuses, {
    scheduled: true, // Start the cron job immediately upon app startup
    timezone: "UTC", // Optional: Change the timezone if needed
  });

// schedule the function to run every 15 minutes for reverting updates
// cron.schedule("*/15 * * * *", revertAppointmentStatuses, {
//   scheduled: true,
//   timezone: "UTC",
// });

console.log("Scheduler started: Runs every 15 minutes.");
