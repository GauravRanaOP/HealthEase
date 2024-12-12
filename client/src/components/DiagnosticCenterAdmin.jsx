import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
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
  const [assignedTests, setAssignedTests] = useState([]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  //fetch diagnostic center id using addressId from user data
  useEffect(() => {
    const fetchCenterId = async () => {
      const storedData = JSON.parse(localStorage.getItem("user_data"));
      if (!storedData || !storedData.userId) {
        setMessage("Error: User data missing in local storage.");
        return;
      }

      try {
        const response = await axios.get(
          `https://healthease-n5ra.onrender.com/api/diagnostic-centers/find-by-address/${storedData.userId}`
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

  //fetch all availabilities for center
  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (centerId) {
        try {
          const response = await axios.get(
            `https://healthease-n5ra.onrender.com/api/diagnostic-centers/${centerId}/availabilities`
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
          `https://healthease-n5ra.onrender.com/api/diagnostic-centers/tests/all`
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

  //fetch assigned tests
  useEffect(() => {
    const fetchAssignedTests = async () => {
      if (centerId) {
        try {
          const response = await axios.get(
            `https://healthease-n5ra.onrender.com/api/diagnostic-centers/${centerId}`
          );
          console.log("Assigned Tests Response:", response.data.testsOffered);
          setAssignedTests(response.data.testsOffered || []);
          setSelectedTests(
            (response.data.testsOffered || []).map((test) => test._id)
          );
        } catch (error) {
          console.error(
            "Error fetching assigned tests:",
            error.response?.data || error.message
          );
          setMessage("Failed to fetch assigned tests.");
        }
      }
    };

    fetchAssignedTests();
  }, [centerId]);

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

  //add or update tests
  const handleSubmitTests = async () => {
    if (!centerId) {
      setMessage("Error: Diagnostic Center ID is missing.");
      return;
    }

    try {
      const response = await axios.put(
        `https://healthease-n5ra.onrender.com/api/diagnostic-centers/${centerId}/tests`,
        { tests: selectedTests }
      );
      setMessage("Tests updated successfully!");

      //update assignedTests and selectedTests
      const updatedTestsOffered = response.data.center.testsOffered;
      setAssignedTests(updatedTestsOffered);
      setSelectedTests(updatedTestsOffered.map((test) => test._id));
    } catch (error) {
      console.error(
        "Error updating tests:",
        error.response?.data || error.message
      );
      setMessage("Failed to update tests. Please try again.");
    }
  };

  //remove a test
  const handleRemoveTest = async (testId) => {
    if (!centerId) {
      setMessage("Error: Diagnostic Center ID is missing.");
      return;
    }

    try {
      const response = await axios.delete(
        `https://healthease-n5ra.onrender.com/api/diagnostic-centers/${centerId}/tests/${testId}`
      );
      setMessage("Test removed successfully!", 3000);

      const updatedTestsOffered = response.data.center.testsOffered;
      setAssignedTests(updatedTestsOffered);
      setSelectedTests(updatedTestsOffered.map((test) => test._id));
    } catch (error) {
      console.error(
        "Error removing test:",
        error.response?.data || error.message
      );
      setMessage("Failed to remove test. Please try again.");
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
          `https://healthease-n5ra.onrender.com/api/diagnostic-centers/${centerId}/availabilities/${currentAvailabilityId}`,
          availability
        );
        setMessage("Availability updated successfully!");
      } else {
        // Add availability
        await axios.post(
          `https://healthease-n5ra.onrender.com/api/diagnostic-centers/${centerId}/availability`,
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

      const response = await axios.get(
        `https://healthease-n5ra.onrender.com/api/diagnostic-centers/${centerId}/availabilities`
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
        `https://healthease-n5ra.onrender.com/api/diagnostic-centers/${centerId}/availabilities/${availabilityId}`
      );
      setMessage("Availability deleted successfully!");

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
      <Helmet>
        <title>Manage Diagnostic Center | HealthEase</title>
        <meta
          name="description"
          content="Manage diagnostic center availability, assign tests, and update availability seamlessly."
        />
        <meta
          name="keywords"
          content="diagnostic center, health ease, manage tests, availability"
        />
        <meta name="author" content="HealthEase Team" />
        <link
          rel="canonical"
          href="https://healthease-n5ra.onrender.com/diagnostic-admin"
        />
      </Helmet>
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

        <h2 className="section-title-tests">Assigned Tests</h2>
        <ul className="assigned-tests-list">
          {assignedTests.length > 0 ? (
            assignedTests.map((test) => (
              <li key={test._id} className="assigned-test-item">
                <span className="test-name">{test.name}</span>
                <button
                  className="remove-test-btn"
                  onClick={() => handleRemoveTest(test._id)}
                >
                  Remove
                </button>
              </li>
            ))
          ) : (
            <p>No tests assigned to this center.</p>
          )}
        </ul>

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
