import mongoose from "mongoose";

const Schema = mongoose.Schema;

const diagnosticCenterSchema = new Schema({
    name: { type: String, required: true },
    contactNo: { type: String, required: true },
    email: { type: String, required: true },
    testsOffered: { type: [String], required: true },
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    availabilityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Availability' },
}, { timestamps: true });

const DiagnosticCenter = mongoose.model("DiagnosticCenter", diagnosticCenterSchema);

export default DiagnosticCenter; 