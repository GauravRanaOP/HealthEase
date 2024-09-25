// loads .env file
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

if (!MONGO_CONNECTION_STRING) {
    throw new Error("MONGO_CONNECTION_STRING is not defined");
}

//console.log(MONGO_CONNECTION_STRING);
mongoose.connect(MONGO_CONNECTION_STRING);

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