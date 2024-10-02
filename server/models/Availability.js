import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AvailabilitySchema = new Schema({
    // id: {
    //     type: Number,
    //     required: true
    // },
    startDate: String,
    endDate: String,
    startTime: String,
    endTime: String,
    type: {                 // distinguishes between doctor or center(DC/Clinic)
        type: String, 
        required: true,
        enum: ['Doctor', 'DiagnosticCenter', 'Clinic']
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    }
});

// exports Availability module
const Availability = mongoose.model('Availability', AvailabilitySchema);
export default Availability;