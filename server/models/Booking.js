import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    timeSlot: {
        type: String,
        required: true,
    },
    test: {
        type: String,
        required: true,
    },
    patientId: {
        type: String,
        required: true,
    },
    doctorNote: {
        type: String,
        required: false,
    },
    testStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    result: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
