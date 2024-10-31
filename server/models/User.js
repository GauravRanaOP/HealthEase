import mongoose from "mongoose";
import Address from "./Address.js";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  // id: {
  //     type: Number,
  //     required: true
  // },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  firstName: String,
  lastName: String,
  contactNo: {
    type: Number,
    required: true,
  },
  userRole: {
    type: String,
    required: true,
    enum: [
      "Patient",
      "Doctor",
      "Admin",
      "DiagnosticCenterAdmin",
      "ClinicAdmin",
    ],
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    // required: true,
  },
  lastLoginDateTime: Date,
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.methods.verifyPassword = async function (password) {
  const user = this;
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch;
};


// exports User model
const User = mongoose.model("User", UserSchema);
export default User;
