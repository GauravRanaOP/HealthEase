import React, { useState } from "react";
import axios from "axios";
import "../../assets/css/authentication/AuthenticationStyle.css";
import { useAuth } from "./AuthContext";

const AuthenticationPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [userRole, setUserRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const handleLogin = async () => {
    // e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3002/api/auth/login",
        {
          loginEmail,
          loginPassword,
        }
      );
      console.log("Login Response: ", response.data);
      if (response.status === 200) {
        login(response.data.token, response.data.user._id);
      }
    } catch (error) {
      console.error("Login Error: ", error);
    }
  };

  const handleRegister = async () => {
    // e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3002/api/auth/register",
        {
          firstName,
          lastName,
          contactNo,
          userRole: "Patient",
          email,
          password,
        }
      );

      console.log(response.data);

      if (response.status === 201) {
        login(response.data.token, response.data.userId);
      }

      console.log("Registration Response: ", response.data);
      // Optionally, you can redirect the user to another page or reset the form
    } catch (error) {
      console.error("Registration Error: ", error);
    }
  };

  const toggleForm = (isSignUpForm) => {
    setIsSignUp(isSignUpForm);
  };

  const handleContactNoChange = (e) => {
    const value = e.target.value;

    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setContactNo(value);
    }
  };

  return (
    <div className={`container ${isSignUp ? "active" : ""}`} id="container">
      {/* Sign Up Form */}
      {isSignUp && (
        <div className="form-container sign-up">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            <h1>Create Account</h1>

            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="text" // Changed type to text to allow regex-based validation
              placeholder="Contact Number"
              value={contactNo}
              onChange={handleContactNoChange}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>
      )}

      {/* Sign In Form */}
      {!isSignUp && (
        <div className="form-container sign-in">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <h1>Sign In</h1>
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <a href="#">Forget Your Password?</a>
            <button>Sign In</button>
          </form>
        </div>
      )}

      {/* Toggle between Sign Up and Sign In */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of HealthEase features</p>
            <button onClick={() => toggleForm(false)} className="hidden">
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>
              Register with your personal details to use all of HealthEase
              features
            </p>
            <button onClick={() => toggleForm(true)} className="hidden">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;