import mongoose from "mongoose";
import Address from "./Address.js";
const Schema = mongoose.Schema;

const DiagnosticCenterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    contactNo: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    testsOffered: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true,
    }],
    availabilityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Availability'
    }
});

// exports DiagnosticCenter model
const DiagnosticCenter = mongoose.model('DiagnosticCenter', DiagnosticCenterSchema);
export default DiagnosticCenter; 