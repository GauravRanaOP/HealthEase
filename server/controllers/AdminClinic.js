import Clinic from "../models/Clinic.js";
import Address from "../models/Address.js";

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