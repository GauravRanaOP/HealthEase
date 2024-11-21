import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "./SideBar";
import "../assets/css/DiagnosticCenterAdmin.css";

const DiagnosticCenterAdmin = () => {
  const [availability, setAvailability] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });
  const [availabilities, setAvailabilities] = useState([]);
  const [centerId, setCenterId] = useState(null);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentAvailabilityId, setCurrentAvailabilityId] = useState(null);

  const [tests, setTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);

  //fetch diagnostic center id using addressId from user data
  useEffect(() => {
    const fetchCenterId = async () => {
      const storedData = JSON.parse(localStorage.getItem("user_data")); //get user data from local storage
      if (!storedData || !storedData.userId) {
        setMessage("Error: User data missing in local storage.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3002/api/diagnostic-centers/find-by-address/${storedData.userId}`
        );
        setCenterId(response.data._id);
      } catch (error) {
        console.error(
          "Error fetching Diagnostic Center ID:",
          error.response?.data || error.message
        );
        setMessage("Failed to fetch Diagnostic Center information.");
      }
    };

    fetchCenterId();
  }, []);

  //fetch all availabilities for the center
  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (centerId) {
        try {
          const response = await axios.get(
            `http://localhost:3002/api/diagnostic-centers/${centerId}/availabilities`
          );
          setAvailabilities(response.data);
        } catch (error) {
          console.error(
            "Error fetching availabilities:",
            error.response?.data || error.message
          );
          setMessage("Failed to fetch availabilities.");
        }
      }
    };

    fetchAvailabilities();
  }, [centerId]);

  //fetch all tests from Test model
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/api/diagnostic-centers/tests/all`
        );
        setTests(response.data);
      } catch (error) {
        console.error(
          "Error fetching tests:",
          error.response?.data || error.message
        );
        setMessage("Failed to fetch tests.");
      }
    };

    fetchTests();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAvailability((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestSelection = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedTests(selectedOptions);
  };

  //add tests for the center
  const handleSubmitTests = async () => {
    if (!centerId) {
      setMessage("Error: Diagnostic Center ID is missing.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3002/api/diagnostic-centers/${centerId}/tests`,
        { tests: selectedTests }
      );
      setMessage("Tests added successfully!");
    } catch (error) {
      console.error(
        "Error updating tests:",
        error.response?.data || error.message
      );
      setMessage("Failed to update tests. Please try again.");
    }
  };

  //save availability
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!centerId) {
      setMessage("Error: Diagnostic Center ID is missing.");
      return;
    }

    try {
      if (editMode) {
        // Update availability
        await axios.put(
          `http://localhost:3002/api/diagnostic-centers/${centerId}/availabilities/${currentAvailabilityId}`,
          availability
        );
        setMessage("Availability updated successfully!");
      } else {
        // Add availability
        await axios.post(
          `http://localhost:3002/api/diagnostic-centers/${centerId}/availability`,
          availability
        );
        setMessage("Availability added successfully!");
      }

      setAvailability({
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
      });
      setEditMode(false);
      setCurrentAvailabilityId(null);

      // Refresh availabilities
      const response = await axios.get(
        `http://localhost:3002/api/diagnostic-centers/${centerId}/availabilities`
      );
      setAvailabilities(response.data);
    } catch (error) {
      console.error(
        "Error saving availability:",
        error.response?.data || error.message
      );
      setMessage("Failed to save availability. Please try again.");
    }
  };

  //edit availability
  const handleEdit = (availability) => {
    setAvailability({
      startDate: availability.startDate,
      endDate: availability.endDate,
      startTime: availability.startTime,
      endTime: availability.endTime,
    });
    setEditMode(true);
    setCurrentAvailabilityId(availability._id);
  };

  //delete availability
  const handleDelete = async (availabilityId) => {
    try {
      await axios.delete(
        `http://localhost:3002/api/diagnostic-centers/${centerId}/availabilities/${availabilityId}`
      );
      setMessage("Availability deleted successfully!");

      // Refresh availabilities
      setAvailabilities((prev) =>
        prev.filter((availability) => availability._id !== availabilityId)
      );
    } catch (error) {
      console.error(
        "Error deleting availability:",
        error.response?.data || error.message
      );
      setMessage("Failed to delete availability. Please try again.");
    }
  };

  return (
    <div className="app-layout">
      <SideBar />
      <div className="content">
        <h1 className="dashboard-title">Manage Diagnostic Center</h1>
        {message && <p className="message">{message}</p>}

        <h2 className="section-title-tests">Assign Tests to Center</h2>
        <div className="assign-tests">
          <label className="label">Select Tests:</label>
          <select
            className="select-tests"
            multiple
            value={selectedTests}
            onChange={handleTestSelection}
          >
            {tests.map((test) => (
              <option key={test._id} value={test._id}>
                {test.name}
              </option>
            ))}
          </select>
          <button className="submit-btn" onClick={handleSubmitTests}>
            Save Tests
          </button>
        </div>

        <h2 className="section-title-availability">
          Add or Update Availability
        </h2>
        <form className="availability-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Start Date:</label>
            <input
              type="date"
              className="input"
              name="startDate"
              value={availability.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="label">End Date:</label>
            <input
              type="date"
              className="input"
              name="endDate"
              value={availability.endDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="label">Start Time:</label>
            <input
              type="time"
              className="input"
              name="startTime"
              value={availability.startTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="label">End Time:</label>
            <input
              type="time"
              className="input"
              name="endTime"
              value={availability.endTime}
              onChange={handleChange}
              required
            />
          </div>
          <button className="submit-btn" type="submit">
            {editMode ? "Update" : "Add"} Availability
          </button>
        </form>

        <h2 className="section-title">Availabilities</h2>
        <table className="availability-table">
          <thead>
            <tr>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {availabilities.map((availability) => (
              <tr key={availability._id}>
                <td>{availability.startDate}</td>
                <td>{availability.endDate}</td>
                <td>{availability.startTime}</td>
                <td>{availability.endTime}</td>
                <td className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(availability)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(availability._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiagnosticCenterAdmin;
