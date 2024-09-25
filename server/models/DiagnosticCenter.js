import mongoose from "mongoose";
import AddressSchema from "./Address.js";

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
    address: AddressSchema,     // address schema
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
model.export = DiagnosticCenter;