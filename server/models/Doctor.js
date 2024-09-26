import mongoose, { Schema } from "mongoose";

const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic'
    },
    speciality: {
        type: String,
        required: true
    },
    availabilityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Availability'
    }
});

// exports Doctor modal
const Doctor = mongoose.model('Doctor', DoctorSchema);
export default Doctor; 