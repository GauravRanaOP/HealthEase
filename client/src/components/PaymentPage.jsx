import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";

import CheckoutForm from "./CheckoutForm.jsx";
import "../assets/css/PaymentPage.css";

// loads stripe public key
const stripePromise = loadStripe("pk_test_51QKq0oG1yrsNhHzCilkqDVF2dLeu8QXyDP3fZ17SaRliXyVOcLoTjqU2NGUt5kpDoCLESapPqkz4jz5BGdtWsH6d00INEwhjtB");    // key from stripe dashboard


export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { timeslot, doctorId, userData } = location.state || {};

  // defines states
  const [bookingMessage, setBookingMessage] = useState("");

  if (!timeslot || !doctorId || !userData) {
    return <p>Error: Missing appointment details.</p>;
  }

  // function to handle payment
  const handlePaymentSuccess = async (paymentResult) => {
    const { appointmentId } = timeslot;
    const userId = userData;

    try {
        // calls the backend to update the timeslot status after successful payment
      const response = await axios.put(
        `http://localhost:3002/api/doctors/updateTimeslot/${appointmentId}`,
        {
          userId,
          paymentStatus: "Paid",
        }
      );
      setBookingMessage(response.data.message);

    } catch (error) {
      console.error("Error booking appointment after payment:", error);
      alert("Error booking appointment. Please try again.");
    }
  };


  return (
    <div className="payment-page">
      {bookingMessage ? (
        <div>
          <p className="booking-message">{bookingMessage}</p>
          <button
            onClick={() => navigate("/patientDirectory")}
            className="btn-custom"
          >
            Go to My Appointments
          </button>
        </div>
      ) : (
        <>
          <h2>Confirm Payment</h2>
          <p>Appointment with Dr. [Doctor Name]</p>
          <p>Date: {timeslot.date}</p>
          <p>Time: {timeslot.time}</p>
          <p>Total Amount: $40</p>

          <Elements stripe={stripePromise}>
            <CheckoutForm onSuccess={handlePaymentSuccess} />
          </Elements>
        </>
      )}
    </div>
  );
}
