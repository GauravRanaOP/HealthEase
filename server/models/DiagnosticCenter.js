import mongoose from "mongoose";
import Address from "./Address.js";
// import { AddressSchema } from "./Address.js";

const Schema = mongoose.Schema;

const DiagnosticCenterSchema = new Schema({
    // id: {
    //     type: Number,
    //     required: true
    // },
    name: {
        type: String,
        required: true
    },
    // address: Address.schema,     // address schema
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
    testsOffered: {
        type: [String],
        required: true,
    },
    availabilityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Availability'
    }
});

// exports DiagnosticCenter model
const DiagnosticCenter = mongoose.model('DiagnosticCenter', DiagnosticCenterSchema);
export default DiagnosticCenter; 