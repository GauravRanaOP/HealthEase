import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "../../assets/css/authentication/AuthenticationStyle.css"

const AuthenticationPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://healthease-n5ra.onrender.com/api/auth/login",
        { loginEmail, loginPassword }
      );

      if (response.status === 200) {
        const { token, user } = response.data;
        login(token, { userId: user._id, userRole: user.userRole });

        switch (user.userRole) {
          case "Patient":
            navigate("/patientDirectory");
            break;
          case "Admin":
            navigate("/adminTest");
            break;
          case "ClinicAdmin":
            navigate("/getDoctor");
            break;
          case "DiagnosticCenterAdmin":
            navigate("/getBookings");
            break;
          default:
            navigate("/");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.response?.data || "Login failed.");
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "https://healthease-n5ra.onrender.com/api/auth/register",
        {
          firstName,
          lastName,
          contactNo,
          userRole: "Patient",
          email,
          password,
        }
      );

      if (response.status === 201) {
        login(response.data.token, response.data.userId);
        navigate("/patientDirectory");
      }
    } catch (error) {
      console.error("Registration Error: ", error);
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const handleContactNoChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setContactNo(value);
    }
  };

  return (
    <div className={`container ${isSignUp ? "active" : ""}`} id="container">
      {isSignUp && (
        <div className="form-container sign-up">
          <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
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
              type="text"
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
            {isMobile && (
              <button type="button" onClick={toggleForm} className="mobile-toggle-button">
                Switch to Sign In
              </button>
            )}
          </form>
        </div>
      )}

      {!isSignUp && (
        <div className="form-container sign-in">
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
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
            <button type="submit">Sign In</button>
            {isMobile && (
              <button type="button" onClick={toggleForm} className="mobile-toggle-button">
                Switch to Sign Up
              </button>
            )}
          </form>
        </div>
      )}


      {!isMobile && (
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of HealthEase features</p>
              <button onClick={() => toggleForm()} className="hidden">
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>
                Register with your personal details to use all of HealthEase
                features
              </p>
              <button onClick={() => toggleForm()} className="hidden">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthenticationPage;

