import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PatientSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    healthCardNo: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    appointmentId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }]
});

// export Patient module
const Patient = mongoose.model('Patient', PatientSchema);
export default Patient; 