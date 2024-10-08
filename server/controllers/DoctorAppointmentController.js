import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";

// helper function to increment time by 1 hour
function incrementTime(time, duration = 60) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setMinutes(date.getMinutes() + duration);
  return date.toTimeString().slice(0, 5);
}

// creates appointments from availability
// async function createDoctorAppointments() {
export const createDoctorAppointments = async (req,res) => {
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
            });

            // saves appointment to database
            await appointment.save();
            console.log(
              `Appointment created for doctor: ${doctorId} on ${startDate} at ${currentTimeSlot}`
            );
          } else {
            console.log(
              `Appointment already exists for doctor: ${doctorId} on ${startDate} at ${currentTimeSlot}`
            );
          }
        }

        // moves to next timeslot
        currentTimeSlot = nextTimeSlot;
      }
    }
    console.log("Appointments created successfully");
  } catch (error) {
    console.error("Error creating appointments: ", error);
  }
};


// gets a specific doctor's appointment timeslots
export const getDoctorAppointmentTimeslots = async(req,res) => {
  try {
      const { doctorId } = req.params;
      // debugging: doctorId received from frontend
      console.log("Doctor ID recevied from frontend : ", doctorId);
  
      // fetches available timeslots for the doctor
      const availableTimeslots = await Appointment.find({
          doctorId: doctorId,
          isTimeSlotAvailable: true,
          status: "Pending",
          visitType: "DoctorVisit",
      }).sort({ date: 1, time: 1});
      if (availableTimeslots.length > 0) {
          res.status(200).json(availableTimeslots);
      } else {
          res.status(404).json({message: "Server error: No available timeslots found for this doctor" });
      }

  } catch (error) {
      res.status(500).json({message: "Server error: Error fetching timeslots: ",error: error.message});
  }
};
