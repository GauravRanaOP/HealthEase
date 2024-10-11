import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// library for date selection
import DatePicker from "react-datepicker";
// css for datepicker library
import "react-datepicker/dist/react-datepicker.css";
import "../assets/css/DoctorTimeslots.css";

// // helper function to format date to mm/dd/yyyy
const formatDateToDisplay = (date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export default function DoctorTimeslots() {
  const { doctorId } = useParams();
  const [selectedDate, setselectedDate] = useState(new Date());
  const [timeslot, setTimeslots] = useState([]);

  // fetches timeslots based on doctorId and selected date
  useEffect(() => {
    const fetchTimeslots = async () => {
      // formats the date to yyyy-mm-dd
      const formattedDate = selectedDate.toISOString().split("T")[0];
      // debugging
      console.log("DoctorTimeslotsPage:Fetching timeslots for date: ", formattedDate);
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

  return (
    <div className="timeslots-container">
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
            <button key={index} className="timeslot-button">
              {timeslot.time}
            </button>
          ))
        ) : (
          <p>No available timeslots for this date.</p>
        )}
      </div>

      <div className="timeslots-actions">
        <button className="cancel-button">Cancel</button>
        <button className="confirm-button">Confirm</button>
      </div>
    </div>
  );
}
