import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";
import DatePicker from "react-datepicker";

import { useAuth } from "./authentication/AuthContext.jsx";

import "react-datepicker/dist/react-datepicker.css";
import "../assets/css/DoctorTimeslots.css";


// // helper function to format date to mm/dd/yyyy
// const formatDateToDisplay = (date) => {
//   const month = date.getMonth() + 1;
//   const day = date.getDate();
//   const year = date.getFullYear();
//   return `${month}/${day}/${year}`;
// };

export default function DoctorTimeslots() {
  
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();

  // sets states
  const [selectedDate, setselectedDate] = useState(new Date());
  const [timeslot, setTimeslots] = useState([]);
  const [selectedTimeslot, setselectedTimeslot] = useState(null);
  const [showConfirmation, setshowConfirmation] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  // fetches doctor appointment timeslots based on doctorId and selected date
  useEffect(() => {
    const fetchTimeslots = async () => {
      // formats the date to yyyy-mm-dd
      const formattedDate = selectedDate.toISOString().split("T")[0];
      // debugging
      console.log(
        "DoctorTimeslotsPage:Fetching timeslots for date: ",
        formattedDate
      );
      try {
        const response = await axios.get(
          `http://localhost:3002/api/doctors/availableTimeslots?doctorId=${doctorId}&date=${formattedDate}`
        );
        setTimeslots(response.data);
      } catch (error) {
        // debugging
        console.error("Error fetching timeslots: ", error);
        // resets the timeslots to empty
        setTimeslots([]);
      }
    };

    fetchTimeslots();
  }, [doctorId, selectedDate]);

  const handleDateChange = (date) => {
    setselectedDate(date);
  };

  const handleTimeslotSelect = (timeslot) => {
    setselectedTimeslot({
      time: timeslot.time,
      appointmentId: timeslot._id,
    });
  };

  const handleConfirmClick = () => {
    if (selectedTimeslot) {
      setshowConfirmation(true);
    } else {
      alert("Please select a timeslot before confirming");
    }
  };

  const handleBooking = async () => {
    if (!selectedTimeslot) {
      alert("Please select a timeslot before confirming");
      return;
    }

    if (!userData) {
      alert("No user data found. Please login to continue.");
      return;
    }

    // gets userId from userData object in AuthContext.jsx
    const userId = userData.userId;
    const appointmentId = selectedTimeslot.appointmentId;

    // debug: logs the appointment id
    console.log("DoctorTimeslot: appointmentId: ", appointmentId, "userId:", userId);

    try {
      // backend request to book the appointment
      // const response = await axios.put(`http://localhost:3002/api/doctors/updateTimeslot?appointmentId=${appointmentId}`, {       // appointmentId as query parameter
      const response = await axios.put(
        `http://localhost:3002/api/doctors/updateTimeslot/${appointmentId}`,        // appointmentId as path parameter  
        { userId }    // send userId in the request body
      );

      setBookingMessage(response.data.message);
      setshowConfirmation(false);

    } catch (error) {
      console.error("Error booking appointment: ", error);
      alert("Error booking the appointment. Please try again");
    }
  };

  return (
    <div className="timeslots-container">
      {!bookingMessage && (
      <>
        <h2>Appointment Date:</h2>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="MM/dd/yyyy"
          placeholderText="Select a date"
        />

        <h2>Appointment Time:</h2>
        <div className="timeslots">
          {timeslot.length > 0 ? (
            timeslot.map((timeslot, index) => (
              <button
                key={index}
                className={`timeslot-button ${selectedTimeslot?.time === timeslot.time ? "selected" : ""}`}
                onClick={() => handleTimeslotSelect(timeslot)}
              >
                {timeslot.time}
              </button>
            ))
          ) : (
            <p>No available timeslots for this date.</p>
          )}
        </div>

        <div className="timeslots-actions">
          <button
            className="btn-cancel"
            onClick={() => setselectedTimeslot(null)}
          >Cancel
          </button>
          <button
            className="btn-confirm"
            onClick={() => {
              handleConfirmClick();
            }}
          >Confirm
          </button>
        </div>

      </>
      )}

      {showConfirmation && selectedTimeslot && (
        <div className="confirmation-popup">
          <p>
            Are you sure you want to book the appointment for{" "}
            {selectedDate.toLocaleDateString()} at {selectedTimeslot.time}?{" "}
          </p>
          <button onClick={handleBooking} className="btn-custom">
            Yes
          </button>
          <button
            onClick={() => setshowConfirmation(false)}
            className="btn-custom"
          >
            No
          </button>
        </div>
      )}

      {bookingMessage && (
        <div>
          <p className="booking-message">{bookingMessage}</p>
          <button 
            onClick={() => navigate("/patientDirectory")}
            className="btn-custom"
            >Continue</button>
        </div>
      )}

    </div>
  );
}
