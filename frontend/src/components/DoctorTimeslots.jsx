import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorTimeslots ({ doctorId }) {
    const [timeslots, setTimeslots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // debugging:correct
    // console.log("DoctorTimeslots:check doctorId: ", doctorId);

    useEffect( () => {
        // debugging:correct 
        // console.log("DoctorTimeslots:useEffect, doctorId: ", doctorId);
        // fetches available timeslots for a specific doctor
        const fetchTimeslots = async() => {
            // checks if doctorId is provided
            if (!doctorId) {
                setError("Frontend error: Doctor ID is missing");
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`http://localhost:3002/api/doctors/availableTimeslots/${doctorId}`);
                setTimeslots(response.data);
                setLoading(false);

            } catch(error) {
                setError(error.response ? error.response.data.message : "Error fetching timeslots");
                setLoading(false);
            }
        };
        
        fetchTimeslots();
    },[doctorId]);

    // when loading, shows loading message
    if (loading) {
        return <div>Loading timeslots...</div>;
    }

    // if error, displays the error message
    if (error) {
        return <div>Error: {error}</div>;
    }

    // if no timeslots are available
    if (timeslots.length === 0) {
        return <div>No available timeslots found</div>;
    }

    
    // renders available timeslots
    return (
        <div className="timeslots-container">
            <h4>Available Timeslots</h4>
            <ul>
                {timeslots.map((timeslot, index) => (
                    <li key={index}>
                        {timeslot.date} - {timeslot.time}
                    </li>
                ))}
            </ul>
        </div>
    );
};
