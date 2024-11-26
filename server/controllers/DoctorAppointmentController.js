import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import Clinic from "../models/Clinic.js";
import Address from "../models/Address.js";


// helper function to increment time by 1 hour
function incrementTime(time, duration = 60) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setMinutes(date.getMinutes() + duration);
  return date.toTimeString().slice(0, 5);
}

// creates doctor appointments from availability
export const createDoctorAppointments = async (req, res) => {
  try {
    // fetches all availability records
    const availabilityRecords = await Availability.find();

    for (const availability of availabilityRecords) {
      const { startDate, endDate, startTime, endTime, doctorId } = availability;
      let currentTimeSlot = startTime;

      // loop through and create 1-hour slots
      while (currentTimeSlot < endTime) {
        const nextTimeSlot = incrementTime(currentTimeSlot, 60);

        if (nextTimeSlot <= endTime) {
          // checks if the appointment already exists for this date and time
          const existingAppointment = await Appointment.findOne({
            date: startDate,
            time: currentTimeSlot,
            doctorId: doctorId,
          });

          if (!existingAppointment) {
            // creates a new appointment if it doesnt exist
            const appointment = new Appointment({
              date: startDate,
              time: currentTimeSlot,
              isTimeSlotAvailable: true,
              visitType: "DoctorVisit",
              visitMode: "InPerson",
              doctorId: doctorId,
              status: "Pending",
              comments: "Pending",
              isDirectTest: false
            });

            // saves appointment to database
            await appointment.save();
            console.log(
              `Doctor Appointment created with doctor: ${doctorId} on ${startDate} at ${currentTimeSlot}`
            );
          } else {
            console.log(
              `Doctor Appointment already exists for doctor: ${doctorId} on ${startDate} at ${currentTimeSlot}`
            );
          }
        }

        // moves to next timeslot
        currentTimeSlot = nextTimeSlot;
      }
    }
    console.log("Doctor Appointments created successfully");
  } catch (error) {
    console.error("Error creating doctor appointments: ", error);
  }
};

// read operation: gets a specific doctor's appointment timeslots
export const getDoctorAppointmentTimeslots = async (req, res) => {
  let doctorId;

  // checks if doctorId is in the route parameter or query parameter
  if (req.params.doctorId) {
    // from path parameter
    doctorId = req.params.doctorId;
  } else if (req.query.doctorId) {
    // from query parameter
    doctorId = req.query.doctorId;
  } else {
    return res.status(400).json({ message: "doctorId is required" });
  }

  // gets the date from the query or defaults to today's date (yyyy-mm-dd) if not provided
  const date = req.query.date
    ? req.query.date
    : new Date().toISOString().split("T")[0];

  try {
    // fetches available timeslots using doctorId
    const availableTimeslots = await Appointment.find({
      doctorId: doctorId,
      date: date,
      isTimeSlotAvailable: true,
      status: "Pending",
      visitType: "DoctorVisit",
      isDirectTest: false
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
    res
      .status(500)
      .json({
        message: "Server error: Error fetching timeslots: ",
        error: error.message,
      });
  }
};

// update operation: books an appointment
export const updateDoctorAppointmentTimeslot = async (req, res) => {
  // const { appointmentId } = req.body;
  const { appointmentId } = req.params;
  const { userId, paymentStatus } = req.body;

  const updatedData = req.body;
  console.log(`appointmentId is : `, appointmentId);
  console.log(`userId is : `, userId);
  
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
        message: "The selected timeslot is no longer available. Please choose another timeslot.",
      });
    }

    if (paymentStatus !== "Paid") {
      return res.status(400).json({ message: "Payment is not completed. Booking cannot proceed." });
    }

    // retrieves doctor information
    const doctor = await Doctor.findById(appointment.doctorId);
    if(!doctor) {
      return res.status(404).json({
        message: "Doctor not found.",
      });
    }

    // retrives user details for the doctor
    const user = await User.findById(doctor.userid);
    if (!user) {
      return res.status(404).json({
        message: "User information for doctor not found",
      });
    }
    const doctorName = `${user.firstName} ${user.lastName}`;

    // updates the appointment to mark it as booked
    appointment.isTimeSlotAvailable = false;
    appointment.status = "Confirmed";
    appointment.patientId = userId;   // sets userId from local storage
    appointment.paymentStatus = paymentStatus;    // payment status updated as Paid
    appointment.comments = "Booking Confirmed";

    await appointment.save();

    res.status(200).json({
      message: `Appointment successfully booked with Dr. ${doctorName} on ${appointment.date} at ${appointment.time}. Please be available 30 min prior to appointment time`,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error: Error booking appointment.",
      error: error.message,
    });
  }
};

// check operation: gets one doctor appointment
export const getOneDoctorAppointmentTimeslot = async (req, res) => {
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

