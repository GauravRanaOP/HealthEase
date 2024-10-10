import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/admintest.css";

const AdminTest = () => {
  const [AdminTest, setAdminTest] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3002/api/getTest");
      setAdminTest(response.data);
    };

    fetchData();
  }, []);

  return (
    <div className="admin-test-table-container">
      <div className="admin-test-search-container">
        <input
          type="text"
          placeholder="Search Patients"
          className="admin-test-search-input"
        />
        <button className="admin-test-add-button">Add Test</button>
      </div>
      <table className="admin-test-table" cellPadding="10">
        <thead className="admin-test-thead">
          <tr>
            <th className="admin-test-th">Name</th>
            <th className="admin-test-th">Description</th>
            <th className="admin-test-th">Action</th>
          </tr>
        </thead>
        <tbody>
          {AdminTest.map((Test, index) => (
            <tr className="admin-test-tr" key={Test._id}>
              <td className="admin-test-td">{Test.name}</td>
              <td className="admin-test-td description">{Test.description}</td> {/* Description column */}
              <td className="admin-test-td">
                <button className="admin-test-view">
                  <i className="fas fa-eye"></i>
                </button>
                <button className="admin-test-edit">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="admin-test-delete">
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="admin-test-pagination">
        <button className="disabled">Previous</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>Next</button>
      </div>
    </div>
  );
};

export default AdminTest;
