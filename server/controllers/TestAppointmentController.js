import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";
import User from "../models/User.js";
import DiagnosticCenter from "../models/DiagnosticCenter.js"

// creates test appointments for tests based on availability
export const createTestAppointments = async (req, res) => {
  try {
    // fetches all availability records
    const availabilityRecords = await Availability.find();

    for (const availability of availabilityRecords) {
      const { startDate, endDate, startTime, endTime, diagnosticCenterId } =
        availability;
      let currentTimeSlot = startTime;

      // loop through and create 1-hour slots
      while (currentTimeSlot < endTime) {
        const nextTimeSlot = incrementTime(currentTimeSlot, 60);

        if (nextTimeSlot <= endTime) {
          // checks if the appointment already exists for this date and time
          const existingAppointment = await Appointment.findOne({
            date: startDate,
            time: currentTimeSlot,
            diagnosticCenterId: diagnosticCenterId,
          });

          if (!existingAppointment) {
            // creates a new appointment if it doesnt exist
            const appointment = new Appointment({
              date: startDate,
              time: currentTimeSlot,
              isTimeSlotAvailable: true,
              visitType: "DiagnosticTest",
              visitMode: "InPerson",
              diagnosticCenterId: diagnosticCenterId,
              status: "Pending",
              comments: "Pending",
              isDirectTest: true,
            });

            // saves appointment to database
            await appointment.save();
            console.log(
              `Diagnostic Center Test Appointment created at diagnostic center: ${diagnosticCenterId} on ${startDate} at ${currentTimeSlot}`
            );
          } else {
            console.log(
              `Diagnostic Center Test Appointment already exists at diagnostic center: ${diagnosticCenterId} on ${startDate} at ${currentTimeSlot}`
            );
          }
        }

        // moves to next timeslot
        currentTimeSlot = nextTimeSlot;
      }
    }
    console.log("Diagnostic Center Test Appointments created successfully");
  } catch (error) {
    console.error("Error creating DC test appointments: ", error);
  }
};

// read operation: gets a specific diagnostic center's appointment timeslots
export const getTestAppointmentTimeslots = async (req, res) => {
  let diagnosticCenterId;

  // checks if doctorId is in the route parameter or query parameter
  if (req.params.diagnosticCenterId) {
    // from path parameter
    diagnosticCenterId = req.params.diagnosticCenterId;
  } else if (req.query.diagnosticCenterId) {
    // from query parameter
    diagnosticCenterId = req.query.diagnosticCenterId;
  } else {
    return res.status(400).json({ message: "diagnosticCenterId is required" });
  }

  // gets the date from the query or defaults to today's date (yyyy-mm-dd) if not provided
  const date = req.query.date
    ? req.query.date
    : new Date().toISOString().split("T")[0];

  try {
    // fetches available test timeslots
    const availableTimeslots = await Appointment.find({
      diagnosticCenterId: diagnosticCenterId,
      date: date,
      isTimeSlotAvailable: true,
      status: "Pending",
      visitType: "DiagnosticTest",
      isDirectTest: true,
      // }).sort({ date: 1, time: 1});
    }).sort({ time: 1 });

    if (availableTimeslots.length > 0) {
      res.status(200).json(availableTimeslots);
    } else {
      // res.status(404).json({message: "Server error: No available timeslots found for this doctor on the selected date." });
      // no timeslots found, returns empty array to remove console error
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error: Error fetching timeslots: ",
      error: error.message,
    });
  }
};

// update operation: books an appointment
export const updateTestAppointmentTimeslot = async (req, res) => {
    // const { appointmentId } = req.body;
    const { appointmentId } = req.params;
    const { userId, paymentStatus } = req.body;

    const updatedData = req.body;
    console.log(`appointmentId is : `, appointmentId);
    console.log(`userId is : `, userId);
    console.log(`paymentStatus is : `, paymentStatus);
    
    if (!appointmentId || !userId || !paymentStatus) {
      return res.status(404).json({
        message: "appointmentId, userId, and paymentStatus are required",
      });
    }
  
    try {
      // finds the appointment by Id
      const appointment = await Appointment.findById(appointmentId);
      console.log(`Updating appointment ID: ${appointmentId} with data: `, updatedData);
  
      if (!appointment) {
        return res.status(404).json({
          message: "Server: The selected timeslot is no longer available. Please choose another timeslot.",
        });
      }

      if (paymentStatus !== "Paid") {
        return res.status(400).json({ message: "Payment is not completed. Booking cannot proceed." });
      }
  
      // retrieves diagnostic center information
      const diagnosticCenter = await DiagnosticCenter.findById(appointment.diagnosticCenterId);
      if(!diagnosticCenter) {
        return res.status(404).json({
          message: "Server: Diagnostic Center not found.",
        });
      }
      const diagnosticCenterName = diagnosticCenter.name;
  
      // updates the appointment to mark it as booked
      appointment.isTimeSlotAvailable = false;
      appointment.status = "Confirmed";
      appointment.patientId = userId;    // sets userId from local storage
      appointment.paymentStatus = paymentStatus;    // payment status updated as Paid
      appointment.comments = "Booking Confirmed";
  
      await appointment.save();
  
      res.status(200).json({
        message: `Appointment successfully booked at Diagnostic Center ${diagnosticCenterName} on ${appointment.date} at ${appointment.time}. Please be available 30 min prior to appointment time`,
      });
  
    } catch (error) {
      res.status(500).json({
        message: "Server error: Error booking appointment.",
        error: error.message,
      });
    }
  };

// check operation: gets one diagnostic center appointment (same as doctor one appointment, so can be removed, just keeping for now for testing)
export const getOneTestAppointmentTimeslot = async (req, res) => {
    // const { appointmentId } = req.body;
  
    let appointmentId;
    // checks if appointmentId is in the route parameter or query parameter
    if (req.params.appointmentId) {
      // from path parameter
      appointmentId = req.params.appointmentId;
    } else if (req.query.appointmentId) {
      // from query parameter
      appointmentId = req.query.appointmentId;
    } else {
      return res.status(400).json({ message: "appointmentId is required" });
    }
  
    if (!appointmentId) {
      return res.status(404).json({ message: "appointmentId is required." });
    }
  
    try {
      // fetches the timeslots
      const timeslot = await Appointment.findById(appointmentId);
  
      if (timeslot) {
        res.status(200).json(timeslot);
      } else {
        res.status(200).json([]);
      }
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Server error: Error fetching the timeslot: ",
          error: error.message,
        });
    }
  };

