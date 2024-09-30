import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/doctor.css";

const Doctor = () => {
  const [Doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3002/api/getDoctor");
      setDoctors(response.data);
    };

    fetchData();
  }, []);

  const doc = [
    {
      firstname: "John",
      lastname: "Doe",
      speciality: "Cardiology",
    },
    {
      firstname: "Jane",
      lastname: "Smith",
      speciality: "Pediatrics",
    },
    {
      firstname: "Michael",
      lastname: "Johnson",
      speciality: "Dermatology",
    },
    {
      firstname: "Emily",
      lastname: "Davis",
      speciality: "Neurology",
    },
    {
      firstname: "Chris",
      lastname: "Brown",
      speciality: "Orthopedics",
    },
  ];

  return (
    <div className="doctor-table-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Patients"
          className="search-input"
        />
        <button className="add-button">Add Test</button>
      </div>
      <table className="doctor-table" cellPadding="10">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Specialty</th>
            <th>Email Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Doctors.map((Doctor, index) => (
            <tr key={Doctor._id}>
              <td>{Doctor.userid.firstName}</td>
              <td>{Doctor.userid.lastName}</td>
              <td>{Doctor.speciality}</td>
              <td>johndoe123@gmail.com</td>
              <td>
                <td>
                  <button className="view">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="edit">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="delete">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button className="disabled">Previous</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>Next</button>
      </div>
    </div>
  );
};

export default Doctor;
