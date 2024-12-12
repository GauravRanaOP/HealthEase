import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import CheckoutForm from "./CheckoutForm.jsx";
import "../assets/css/PaymentPage.css";

// loads stripe public key
const stripePromise = loadStripe("pk_test_51QKq0oG1yrsNhHzCilkqDVF2dLeu8QXyDP3fZ17SaRliXyVOcLoTjqU2NGUt5kpDoCLESapPqkz4jz5BGdtWsH6d00INEwhjtB");    // key from stripe dashboard


export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
          selectedDate,
          timeslot, 
          doctorId, 
          diagnosticCenterId, 
          userData, 
          appointmentType, 
          testId, 
          doctorFirstName, 
          doctorLastName, 
          testName } = location.state || {};
  const { state } = location;

  // defines states
  const [bookingMessage, setBookingMessage] = useState("");
  const [appointmentDetails, setAppointmentDetails] = useState({});
  const [paymentType, setPaymentType] = useState("");


  // set appointment details and type based on the passed data
  useEffect(() => {
    if (appointmentType) {
      if (appointmentType === "doctor") {
        console.log("doctor state: ", location.state);
        setPaymentType("Doctor Appointment");
        setAppointmentDetails({
          id: doctorId,
          timeslot: timeslot,
          userData: userData,
        });
      } else if (appointmentType === "test") {
        console.log("test state: ", location.state);
        setPaymentType("Test Appointment");
        setAppointmentDetails({
          id: diagnosticCenterId,
          timeslot: timeslot,
          userData: userData,
        });
      } else {
        console.error("Invalid appointment type");
      }
    }
  }, [appointmentType, doctorId, diagnosticCenterId, timeslot, userData]);


  // function to handle payment
  const handlePaymentSuccess = async (paymentResult) => {
    const { appointmentId } = timeslot;
    const userId = userData;
    //const testId = testId;

    try {
      
      let response;

      // calls backend api based on appointment type
      if (paymentType === "Doctor Appointment") {
        // For doctor appointment, update the doctor timeslot
        response = await axios.put(
          `http://localhost:3002/api/doctor/updateTimeslot/${appointmentId}`,
          {
            userId,
            paymentStatus: "Paid",
          }
        );
      } else if (paymentType === "Test Appointment") {
        // For test appointment, update the test center timeslot
        response = await axios.put(
          `http://localhost:3002/api/test/updateTimeslot/${appointmentId}`,
          {
            userId,
            paymentStatus: "Paid",
            testId: testId,
          }
        );
      } else {
        throw new Error("Invalid appointment type");
      }

      setBookingMessage(response.data.message);

    } catch (error) {
      console.error("Error booking appointment after payment:", error);
      alert("Error booking appointment. Please try again.");
    }
  };


  return (
    <div className="payment-page">
      <Helmet>
        <title>Confirm Your Payment</title>
        <meta
          name="description"
          content="Securely complete your payment for your doctor or test appointment. Confirm details, view total cost, and proceed to finalize your booking with ease."
        />
      </Helmet>

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
          {/* <p>Appointment with Dr. [Doctor Name]</p> */}
          <p>
            {appointmentType === "doctor" ? (
              <>Appointment with Dr. {doctorFirstName} {doctorLastName}</>
            ) : (
              <>Appointment for the test {testName}</>
            )}
          </p>
          {/* <p>Date: {timeslot.date}</p> */}
          <p>Date: {selectedDate} </p>
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
