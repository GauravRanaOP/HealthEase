import Doctor from "../models/Doctor.js";
import Clinic from "../models/Clinic.js";
import User from "../models/User.js";
import Address from "../models/Address.js";

export const create = async (req, res) => {
  try {
    const data = req.body;
    if (!data) {
      res.status(404).json({ msg: "Doctor Data not found" });
    }
    const doc = new Doctor();

    const user = new User();
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.contactNo = data.contactNo;
    user.password = "Test";
    user.userRole = "Doctor";
    user.email = data.email;

    const address = new Address();
    address.streetAddress = data.streetAddress;
    address.city = data.city;
    address.province = data.province;
    address.country = data.country;
    address.postCode = data.postCode;

    const saveAddress = await address.save();
    const addressId = saveAddress._id;

    user.address = addressId;

    const clinic = new Clinic();

    const saveUser = await user.save();
    const userid = saveUser._id;

    doc.userid = userid;
    doc.clinicId = "66f4c5a76edc92597325f893";

    doc.speciality = data.speciality;

    const saveDoctor = await doc.save();
    res.status(200).json(saveDoctor);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getAll = async (req, res) => {
  try {
    const doctorsData = await Doctor.find()
      .populate("userid")
      .populate("clinicId");
    if (!doctorsData) {
      res.status(404).json({ msg: "Doctors Data not found" });
    }
    const data = doctorsData.forEach((doctor) => {
      console.log(doctor.userid.firstName);
    });
    res.status(200).json(doctorsData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const doctorExist = await Doctor.findById(id)
      .populate("userid")
      .populate("clinicId");
    if (!doctorExist) {
      res.status(404).json({ msg: "Doctors Data not found" });
    }
    res.status(200).json(doctorExist);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const id = req.params.id;

    // Find the doctor
    const doctorExist = await Doctor.findById(id)
      .populate("userid")
      .populate("clinicId");
    if (!doctorExist) {
      return res.status(404).json({ msg: "Doctor Data not found" });
    }

    // Check if there is user data to update
    if (req.body.userid) {
      const userUpdateData = req.body.userid;
      // Update the User document using the doctorExist.userid (which is an ObjectId)
      await User.findByIdAndUpdate(doctorExist.userid._id, userUpdateData, {
        new: true,
      });
    }

    // Check if there is clinic data to update
    if (req.body.clinicId) {
      const clinicUpdateData = req.body.clinicId;
      // Update the Clinic document using the doctorExist.clinicId (which is an ObjectId)
      await Clinic.findByIdAndUpdate(
        doctorExist.clinicId._id,
        clinicUpdateData,
        { new: true }
      );
    }

    // Update the Doctor data
    const doctorUpdateData = {
      speciality: req.body.speciality || doctorExist.speciality, // Update speciality if provided
    };

    const updatedDoctor = await Doctor.findByIdAndUpdate(id, doctorUpdateData, {
      new: true,
    });

    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteDoctor = async (req, res) => {
  try {
    const id = req.params.id;
    const doctorExist = await Doctor.findById(id);
    if (!doctorExist) {
      res.status(404).json({ msg: "Doctor not exist" });
    }
    await Doctor.findByIdAndDelete(id);
    res.status(200).json({ msg: "Doctor Data delete succssfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
