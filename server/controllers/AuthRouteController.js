import User from "../models/User.js";
import bcrypt from "bcrypt"; // Ensure bcrypt is imported
import jwt from "jsonwebtoken"; // Ensure jwt is imported

export const login = async (req, res) => {
  const { loginEmail, loginPassword } = req.body;

  const user = await User.findOne({ email: loginEmail });

  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(loginPassword, user.password);

  if (!validPassword)
    return res.status(400).send("Invalid username or password.");

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

  res.status(200).json({
    token,
    status: "success",
    user
  })
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, contactNo, userRole, email, password } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      contactNo,
      userRole,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET);


    res.status(201).json({
      message: "User registered successfully",
      userId: savedUser._id,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
