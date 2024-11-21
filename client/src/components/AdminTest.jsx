import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/admintest.css";
import SideBar from "./SideBar";
import Pagination from "./Pagination";


const AdminTest = () => {
  const [AdminTest, setAdminTest] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null); // For selected test details
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState({ name: "", description: "" });
  const [isEditMode, setIsEditMode] = useState(false); // To track if edit mode is enabled
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage] = useState(4);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3002/api/getTest");
      setAdminTest(response.data);
    };

    fetchData();
  }, []);

  // Add Test
  const handleAddTest = async (testData) => {
    await axios.post("http://localhost:3002/api/addTest", testData);
    const response = await axios.get("http://localhost:3002/api/getTest");
    setAdminTest(response.data); // Update the list
    setIsAddModalOpen(false);
  };

  // View Test
  const handleViewTest = async (id) => {
    const response = await axios.get(`http://localhost:3002/api/getTest/${id}`);
    setSelectedTest(response.data);
    setIsViewModalOpen(true);
  };

  // Edit Test
  const handleEditTest = async (id, updatedData) => {
    await axios.put(`http://localhost:3002/api/updateTest/${id}`, updatedData);
    const response = await axios.get("http://localhost:3002/api/getTest");
    setAdminTest(response.data); // Update the list
    setIsEditModalOpen(false);
  };

  // Delete Test
  const handleDeleteTest = async (id) => {
    await axios.delete(`http://localhost:3002/api/deleteTest/${id}`);
    const response = await axios.get("http://localhost:3002/api/getTest");
    setAdminTest(response.data); // Update the list
  };

  const handleEditClick = (test) => {
    setCurrentTest(test); // Set the selected test data in state
    setIsEditMode(true); // Enable the edit mode to show the modal
  };

  const handleUpdateTest = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3002/api/updateTest/${currentTest._id}`,
        currentTest
      );
      setIsEditMode(false); // Close the modal
      // Fetch updated data if needed or update local state
    } catch (error) {
      console.error("Error updating test:", error);
    }
  };

  const filteredTests = AdminTest.filter((test) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return Object.values(test).some((value) =>
      String(value).toLowerCase().includes(lowerCaseQuery)
    ); // check if any field contains the search query
  });

  // paginate as per search query
  const currentTests = filteredTests.slice(
    (currentPage - 1) * testsPerPage,
    currentPage * testsPerPage
  );

  // handle page change
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="app-layout">
      <SideBar />
      <div className="admin-test-table-container">
        <div className="admin-test-search-container">
          <input
            type="text"
            placeholder="Search Tests"
            className="admin-test-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="admin-test-add-button"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Test
          </button>
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
            {currentTests.map((Test) => (
              <tr className="admin-test-tr" key={Test._id}>
                <td className="admin-test-td">{Test.name}</td>
                <td className="admin-test-td description">
                  {Test.description}
                </td>
                <td className="admin-test-td">
                  <button
                    className="admin-test-view"
                    onClick={() => handleViewTest(Test._id)}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="admin-test-edit"
                    onClick={() => handleEditClick(Test)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="admin-test-delete"
                    onClick={() => handleDeleteTest(Test._id)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredTests.length / testsPerPage)}
          onPageChange={handlePageChange}
        />

        {/* Add Test Modal */}
        {isAddModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add New Test</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddTest({
                    name: e.target.name.value,
                    description: e.target.description.value,
                  });
                }}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Test Name"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Test Description"
                  required
                />
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* View Test Modal */}
        {isViewModalOpen && selectedTest && (
          <div className="modal">
            <div className="modal-content">
              <h3>View Test</h3>
              <p>
                <strong>Name:</strong> {selectedTest.name}
              </p>
              <p>
                <strong>Description:</strong> {selectedTest.description}
              </p>
              <button type="button" onClick={() => setIsViewModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* Edit Test Modal */}
        {isEditMode && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Test</h2>
              <form>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={currentTest.name} // Prepopulating the name field
                    onChange={(e) =>
                      setCurrentTest({ ...currentTest, name: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={currentTest.description} // Prepopulating the description field
                    onChange={(e) =>
                      setCurrentTest({
                        ...currentTest,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <button type="submit" onClick={handleUpdateTest}>
                  Save Changes
                </button>
                <button type="button" onClick={() => setIsEditMode(false)}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTest;