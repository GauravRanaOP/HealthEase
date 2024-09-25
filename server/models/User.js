import mongoose from "mongoose";
import AddressSchema from "./Address.js";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    // id: {
    //     type: Number,
    //     required: true
    // },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    firstName: String,
    lastName: String,
    contactNo: {
        type: Number,
        required: true
    },
    userRole: {
        type: String,
        required: true,
        enum: ['Patient', 'Doctor', 'Admin', 'DiagnosticCenterAdmin', 'ClinicAdmin']
    },
    address: AddressSchema,
    lastLoginDateTime: Date
});


// exports User model
const User = mongoose.model('User', UserSchema);
module.exports = User;