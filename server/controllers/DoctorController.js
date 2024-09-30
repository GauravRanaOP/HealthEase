import Doctor from "../models/Doctor.js";
import Clinic from "../models/Clinic.js";
import User from "../models/User.js";

export const getAll = async (req, res) => {
  try {
    const doctorsData = await Doctor.find().populate("userid").populate("clinicId");
    if (!doctorsData) {
      res.status(404).json({ msg: "Doctors Data not found" });
    }
    const data = doctorsData.forEach(doctor => {
      console.log(doctor.userid.firstName);
    });
    res.status(200).json(doctorsData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

