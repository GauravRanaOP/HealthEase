import User from "../models/User.js";
import Address from "../models/Address.js"; // Assuming you also have Address model

// Create a new User
export const createUser = async (req, res) => {
  try {
    const data = req.body;

    if (!data) {
      return res.status(404).json({ msg: "User Data not found" });
    }

    // Check if email already exists
    const userExists = await User.findOne({ email: data.email });
    if (userExists) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    const user = new User({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      contactNo: data.contactNo,
      userRole: data.userRole,
      address: data.address, // Address ObjectId
      lastLoginDateTime: data.lastLoginDateTime,
    });

    const savedUser = await user.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('address'); // Populate address data
    if (!users || users.length === 0) {
      return res.status(404).json({ msg: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get one User by ID
export const getOneUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).populate('address'); // Populate address data
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a User
export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update user details
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }).populate('address');
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a User
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
