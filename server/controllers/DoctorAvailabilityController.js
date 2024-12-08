import Doctor from "../models/Doctor.js";
import Availability from "../models/Availability.js";

export const getDoctorsClinic = async (req, res) => {
  const { clinicId } = req.params;

  try {
    // Find doctors associated with the clinicId
    const doctors = await Doctor.find({ clinicId })
      .populate({
        path: "userid", // Populate the referenced User document
        select: "firstName lastName", // Include only firstName and lastName from User
      })
      .select("_id userid"); // Include only doctorId and populated userid

    // Map the response to include only the required fields
    const formattedDoctors = doctors.map((doctor) => ({
      doctorId: doctor._id,
      fullName: `${doctor.userid.firstName} ${doctor.userid.lastName}`,
    }));

    res.status(200).json(formattedDoctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDoctorAvailability = async (req, res) => {
  try {
    const id = req.params.id;
    const doctors = await Doctor.find({ clinicId: id });
    const doctorIds = doctors.map((doctor) => doctor._id);

    const doctorAvailability = await Availability.find({
      type: "Doctor",
      doctorId: { $in: doctorIds },
    }).populate({
      path: "doctorId",
      populate: {
        path: "userid",
      },
    });
    if (!doctorAvailability) {
      res.status(404).json({ msg: "Availability for Doctor not found" });
    }
    res.status(200).json(doctorAvailability);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getOneDoctorAvailability = async (req, res) => {
    try {
      const { id } = req.params; // Assuming the availability ID is passed in the URL
      const availability = await Availability.findById(id)
        .populate({
          path: "doctorId",
          populate: {
            path: "userid",
          },
        });
  
      if (!availability) {
        return res.status(404).json({ msg: "Availability for this Doctor not found" });
      }
  
      res.status(200).json(availability);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

export const addDoctorAvailability = async (req, res) => {
  try {
    // Extract details from the request body
    const { doctorId, startDate, endDate, startTime, endTime, type } = req.body;

    // Validate required fields
    if (
      !doctorId ||
      !startDate ||
      !endDate ||
      !startTime ||
      !endTime ||
      !type
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Ensure type is "Doctor" (Optional Validation)
    if (type !== "Doctor") {
      return res.status(400).json({ msg: "Invalid type, must be 'Doctor'" });
    }

    // Create a new Availability instance
    const newAvailability = new Availability({
      doctorId,
      startDate,
      endDate,
      startTime,
      endTime,
      type,
    });

    // Save the availability to the database
    const savedAvailability = await newAvailability.save();

    // Respond with the saved availability
    res.status(201).json({
      msg: "Availability added successfully",
      data: savedAvailability,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDoctorAvailability = async (req, res) => {
  try {
    const availabilityId = req.params.id; // ID of the availability to update
    const { doctorId, startDate, endDate, startTime, endTime, type } = req.body;

    // Validate required fields
    if (
      !doctorId &&
      !startDate &&
      !endDate &&
      !startTime &&
      !endTime &&
      !type
    ) {
      return res
        .status(400)
        .json({ msg: "At least one field must be provided to update" });
    }

    // Ensure type is "Doctor" (Optional Validation)
    if (type && type !== "Doctor") {
      return res.status(400).json({ msg: "Invalid type, must be 'Doctor'" });
    }

    // Find the availability by ID and update it
    const updatedAvailability = await Availability.findByIdAndUpdate(
      availabilityId,
      { doctorId, startDate, endDate, startTime, endTime, type },
      { new: true } // Return the updated document
    );

    if (!updatedAvailability) {
      return res.status(404).json({ msg: "Availability not found" });
    }

    res.status(200).json({
      msg: "Availability updated successfully",
      data: updatedAvailability,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDoctorAvailability = async (req, res) => {
  try {
    const availabilityId = req.params.id; // ID of the availability to delete

    // Find the availability and delete it
    const deletedAvailability = await Availability.findByIdAndDelete(
      availabilityId
    );

    if (!deletedAvailability) {
      return res.status(404).json({ msg: "Availability not found" });
    }

    res.status(200).json({
      msg: "Availability deleted successfully",
      data: deletedAvailability,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
