import Clinic from "../models/Clinic.js";
import Address from "../models/Address.js";
import bcrypt from "bcrypt"; // Ensure bcrypt is imported
import { sendEmail } from "../utils/EmailService.js";

export const create = async (req, res) => {
  try {
    const data = req.body;
    if (!data) {
      res.status(404).json({ msg: "Clinic Data not found" });
    }

    const clinic = new Clinic();
    clinic.name = data.name;
    clinic.contactNo = data.contactNo;
    clinic.email = data.email;
    clinic.userRole = "ClinicAdmin";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("qwe", salt);

    clinic.password = hashedPassword;
    const address = new Address();
    address.streetAddress = data.streetAddress;
    address.city = data.city;
    address.province = data.province;
    address.country = data.country;
    address.postCode = data.postCode;

    const saveAddress = await address.save();
    const addressId = saveAddress._id;

    clinic.addressId = addressId;
    const saveClinic = await clinic.save();

    // Send email to the newly created clinic
    try {
      await sendEmail(
        clinic.email,
        'Welcome to HealthEase - Your Clinic Account',
        `
        <h1>Welcome to HealthEase</h1>
        <p>Dear ${clinic.name},</p>
        <p>Your clinic account has been successfully created. Here are your login details:</p>
        <p>Email: ${clinic.email}</p>
        <p>Password: qwe</p>
        <p>Please change your password after your first login for security reasons.</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,</p>
        <p>The HealthEase Team</p>
        `
      );
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Note: We're not returning here, as we still want to send the clinic data even if the email fails
    }
    res.status(200).json(saveClinic);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getAll = async (req, res) => {
  try {
    const clinicData = await Clinic.find()
      .populate("addressId")
    if (!clinicData) {
      res.status(404).json({ msg: "Clinic Data not found" });
    }
    const data = clinicData.forEach((clinic) => {
      console.log(clinic.name);
    });
    res.status(200).json(clinicData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const clinicExist = await Clinic.findById(id)
    .populate("addressId")
    if (!clinicExist) {
      res.status(404).json({ msg: "Clinics Data not found" });
    }
    res.status(200).json(clinicExist);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateClinic = async (req, res) => {
  try {
    const id = req.params.id;

    // Find the Clinic
    const clinicExist = await Clinic.findById(id)
      .populate("addressId")
    if (!clinicExist) {
      return res.status(404).json({ msg: "Clinic Data not found" });
    }

    // Check if there is address data to update
    if (req.body.addressId) {
      const addressUpdateData = req.body.addressId;
      // Update the Address document using the clinicExist.adressId (which is an ObjectId)
      await Address.findByIdAndUpdate(clinicExist.addressId._id, addressUpdateData, {
        new: true,
      });
    }

    // Update the Clinic data
    const addressUpdateData = {
      name: req.body.name,
      contactNo: req.body.contactNo,
      email: req.body.email,
    };

    const updatedClinic = await Clinic.findByIdAndUpdate(id, addressUpdateData, {
      new: true,
    });

    res.status(200).json(updatedClinic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteClinic = async (req, res) => {
  try {
    const id = req.params.id;
    const clinicExist = await Clinic.findById(id);
    if (!clinicExist) {
      res.status(404).json({ msg: "Clinic not exist" });
    }
    await Clinic.findByIdAndDelete(id);
    res.status(200).json({ msg: "Clinic Data delete succssfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};