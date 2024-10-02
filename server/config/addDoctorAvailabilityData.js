import "./db.js";
import Availability from "../models/Availability.js";
import Doctor from "../models/Doctor.js";

(async () => {
    try {
        // fetches existing doctors by their userIDd
        const doctorMary = await Doctor.findOne({userid: "66f4c5a66edc92597325f887"});
        const doctorJack = await Doctor.findOne({userid: "66f4c5a66edc92597325f889"});
        const doctorMathew = await Doctor.findOne({userid: "66f4c5a66edc92597325f88b"});
        
        // inserts availablity data for doctor Mary: (9am-2pm on Mon, Tue, Thu)
        const availabilityMary = [
            {
                startDate: "2024-10-07",
                endDate: "2024-10-07",
                startTime: "09:00",
                endTime: "14:00",
                type: "Doctor",
                doctorId: doctorMary._id,
            },
            {
                startDate: "2024-10-08",
                endDate: "2024-10-08",
                startTime: "09:00",
                endTime: "14:00",
                type: "Doctor",
                doctorId: doctorMary._id,
            },
            {
                startDate: "2024-10-10",
                endDate: "2024-10-10",
                startTime: "09:00",
                endTime: "14:00",
                type: "Doctor",
                doctorId: doctorMary._id,
            },
        ];

        // inserts availablity data for doctor Jack: (1pm-6pm on Mon, Wed, Fri)
        const availabilityJack = [
            {
                startDate: "2024-10-07",
                endDate: "2024-10-07",
                startTime: "13:00",
                endTime: "18:00",
                type: "Doctor",
                doctorId: doctorJack._id,
            },
            {
                startDate: "2024-10-09",
                endDate: "2024-10-09",
                startTime: "13:00",
                endTime: "18:00",
                type: "Doctor",
                doctorId: doctorJack._id,
            },
            {
                startDate: "2024-10-11",
                endDate: "2024-10-11",
                startTime: "13:00",
                endTime: "18:00",
                type: "Doctor",
                doctorId: doctorJack._id,
            },
        ];

        // inserts availablity data for doctor Mathew: (3pm-8pm on Tue, Wed, Fri)
        const availabilityMathew = [
            {
                startDate: "2024-10-08",
                endDate: "2024-10-08",
                startTime: "15:00",
                endTime: "20:00",
                type: "Doctor",
                doctorId: doctorMathew._id,
            },
            {
                startDate: "2024-10-09",
                endDate: "2024-10-09",
                startTime: "15:00",
                endTime: "20:00",
                type: "Doctor",
                doctorId: doctorMathew._id,
            },
            {
                startDate: "2024-10-11",
                endDate: "2024-10-11",
                startTime: "15:00",
                endTime: "20:00",
                type: "Doctor",
                doctorId: doctorMathew._id,
            },
        ];

        const allAvailability = [...availabilityMary, ...availabilityJack, ...availabilityMathew];

        // inserts the availability to the database
        await Availability.create(allAvailability);
        console.log("Availability data inserted successfully");

        process.exit(0);

    } catch (error) {
        console.error("Error inserting availability data:", error);
        process.exit(1);
    }

}) ();