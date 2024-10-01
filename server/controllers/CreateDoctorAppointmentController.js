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
async function createDoctorAppointments() {
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
}

// exports the function createAppointmentTimeslots
export default createDoctorAppointments;
