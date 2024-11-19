import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    isTimeSlotAvailable: {
        type: Boolean,
        default: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    visitType: {  // type is visit a doctor at a clinic or take a test at DC
        type: String, 
        required: true,
        enum: ['DoctorVisit', 'DiagnosticTest']
    },
    visitMode: { // mode is at DC or at home
        type: String,
        required: true,
        enum: ['InPerson','AtHome']
    },
    diagnosticCenterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DiagnosticCenter'
    },
    testResult: String,
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    doctorNote: String,
    status: {
        type: String,
        default: ['Pending', 'Confirmed', 'Test Results Available', 'Doctor Note Avaiable', 'Test Pending At DC', 'Completed']
    },
    comments: {
        type: String,
        default: 'Pending'
    },
    isDirectTest: {
        type: Boolean,
        default: false
    }
});

// exports Appointment module
const Appointment = mongoose.model('Appointment', AppointmentSchema);
export default Appointment;