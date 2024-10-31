
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// load .env file
dotenv.config();
// dotenv.config({ path: "../.env" });          // to execute addDoctorAvailabilityData.js, addDoctorAppointmentsData.js

// dotenv.config({ path: path.join(__dirname, ".." ".env") });

const { MONGO_CONNECTION_STRING } = process.env;
// console.log("process.env: ", process.env);

if (!MONGO_CONNECTION_STRING) {
    throw new Error("MONGO_CONNECTION_STRING is not defined");
}

mongoose.connect(MONGO_CONNECTION_STRING);
// console.log(MONGO_CONNECTION_STRING);

// to execute addDoctorAppointmentsData.js
const connectToDatabase = async () => {
  await mongoose.connect(MONGO_CONNECTION_STRING);
  console.log("MongoDB Connected...");
};

// listen connection event
mongoose.connection.on("connected", () => {
    console.log("MongoDB Connected...");
});

mongoose.connection.on("error", (err) => {
    console.log("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
});

export default mongoose;

// to execute addDoctorAppointmentsData.js
// export default connectToDatabase;