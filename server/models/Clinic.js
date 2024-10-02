import mongoose from "mongoose";
// import Address from "./Address.js";
import { AddressSchema } from "./Address.js";

const Schema = mongoose.Schema;

const ClinicSchema = new Schema({
    // id: {
    //     type: Number,
    //     required: true
    // },
    name: {
        type: String,
        required: true
    },
    // address: Address.schema,             // address schema
    address: AddressSchema,
    contactNo: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    doctorIds: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    // availabilityId: {           // is it necessary to add availability for clinic? we are adding availability for doctors.
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Availability'
    // }
});

// exports clinic module
const Clinic = mongoose.model('Clinic', ClinicSchema);
export default Clinic; 