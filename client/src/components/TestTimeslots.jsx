import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "./authentication/AuthContext";
import axios from "axios";
// library for date selection
import DatePicker from "react-datepicker";
// css for datepicker library
import "react-datepicker/dist/react-datepicker.css";
// css for the page
import "../assets/css/DoctorTimeslots.css";     // change


export default function TestTimeslots() {
  const { diagnosticCenterId } = useParams();   // to get diagnosticCenterId from url 
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext);

  const [selectedDate, setselectedDate] = useState(new Date());
  const [timeslot, setTimeslots] = useState([]);
  const [selectedTimeslot, setselectedTimeslot] = useState(null);
  const [showConfirmation, setshowConfirmation] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  // fetches test appointment timeslots based on diagnosticCenterId and selected date
  useEffect(() => {
    const fetchTimeslots = async () => {
      // formats the date to yyyy-mm-dd
      const formattedDate = selectedDate.toISOString().split("T")[0];
      // debugging
      console.log(
        "TestTimeslotsPage:Fetching timeslots for date: ",
        formattedDate
      );
      try {
        const response = await axios.get(
          `http://localhost:3002/api/test/availableTimeslots?diagnosticCenterId=${diagnosticCenterId}&date=${formattedDate}`
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
  }, [diagnosticCenterId, selectedDate]);


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

    // const userId = "Test UserId"; // placeholder until the login module is implemented - fetch from session
    const userId = localStorage.getItem("userId");
    const appointmentId = selectedTimeslot.appointmentId;

    // debug: logs the appointment id
    console.log("TestTimeslot: appointmentId: ", appointmentId);

    try {
      // backend request to book the appointment
      const response = await axios.put(
        `http://localhost:3002/api/test/updateTimeslot/${appointmentId}`,        // appointmentId as path parameter  
        // { userId }
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
