import React, { useState } from "react";
import axios from "axios";
import "../../assets/css/authentication/registration.css";

const RegistrationForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [userRole, setUserRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "error" or "success"

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3002/api/auth/register", {
        firstName,
        lastName,
        contactNo,
        userRole,
        email,
        password,
      });
      setMessage("User registered successfully!");
      setMessageType("success");
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.error);
      setMessage(error.response?.data?.error || "Registration failed.");
      setMessageType("error");
    }
  };

  
  return (
    <div id="registration-container">
      <h2 id="registration-title">Register</h2>
      <form className="registration-form" onSubmit={handleSubmit}>
        <input
          className="input-field"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          required
        />
        <input
          className="input-field"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
        />
        <input
          className="input-field"
          type="tel"
          value={contactNo}
          onChange={(e) => setContactNo(e.target.value)}
          placeholder="Contact Number"
          required
        />
        <input
          className="input-field"
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
          placeholder="User Role"
          required
        />
        <input
          className="input-field"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="input-field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button id="register-button" type="submit">
          Register
        </button>
      </form>
      {message && (
        <p className={`message ${messageType}`}>{message}</p>
      )}
    </div>
  );
};

export default RegistrationForm;