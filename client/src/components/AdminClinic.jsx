import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/admintest.css";
import SideBar from "./SideBar";
import Pagination from "./Pagination";


const AdminClinic = () => {
  const [AdminClinic, setAdminClinic] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null); // For selected test details
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [clinicsPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");


  const [currentClinic, setCurrentClinic] = useState({
    name: "",
    email: "",
    contactNo: "",
    streetAddress: "",
    city: "",
    province: "",
    country: "",
    postCode: "",
  });

  const [editCurrentClinic, setEditCurrentClinic] = useState({
    name: "",
    email: "",
    contactNo: "",
    addressId: {
      streetAddress: "",
      city: "",
      province: "",
      country: "",
      postCode: "",
    },
  });
  const [isEditMode, setIsEditMode] = useState(false); // To track if edit mode is enabled

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3002/api/getClinic");
      setAdminClinic(response.data);
    };

    fetchData();
  }, []);

  // Add Test
  const handleAddTest = async (testData) => {
    await axios.post("http://localhost:3002/api/addClinic", testData);
    const response = await axios.get("http://localhost:3002/api/getClinic");
    setAdminClinic(response.data); // Update the list
    setIsAddModalOpen(false);
  };

  // View Test
  const handleViewTest = async (id) => {
    const response = await axios.get(
      `http://localhost:3002/api/getClinic/${id}`
    );
    setSelectedClinic(response.data);
    setIsViewModalOpen(true);
  };

  // Edit Test
  const handleEditTest = async (id, updatedData) => {
    await axios.put(
      `http://localhost:3002/api/updateClinic/${id}`,
      updatedData
    );
    const response = await axios.get("http://localhost:3002/api/getClinic");
    setAdminClinic(response.data); // Update the list
    setIsEditModalOpen(false);
  };

  // Delete Test
  const handleDeleteTest = async (id) => {
    await axios.delete(`http://localhost:3002/api/deleteClinic/${id}`);
    const response = await axios.get("http://localhost:3002/api/getClinic");
    setAdminClinic(response.data); // Update the list
  };

  const handleEditClick = (test) => {
    setCurrentClinic(test); // Set the selected test data in state
    setEditCurrentClinic({
      name: test.name,
      email: test.email,
      contactNo: test.contactNo,
      addressId: {
        streetAddress: test.addressId?.streetAddress,
        city: test.addressId?.city,
        province: test.addressId?.province,
        country: test.addressId?.country,
        postCode: test.addressId?.postCode,
      },
    });
    setIsEditMode(true); // Enable the edit mode to show the modal
  };

  const handleUpdateTest = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3002/api/updateClinic/${currentClinic._id}`,
        editCurrentClinic
      );
      setIsEditMode(false); // Close the modal
      // Fetch updated data if needed or update local state
    } catch (error) {
      console.error("Error updating test:", error);
    }
  };

  const filteredClinics = AdminClinic.filter((clinic) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return Object.values(clinic).some((value) =>
      String(value).toLowerCase().includes(lowerCaseQuery)
    ); // check if any field contains the search query
  });

  // paginate as per search query
  const currentClinics = filteredClinics.slice(
    (currentPage - 1) * clinicsPerPage,
    currentPage * clinicsPerPage
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
            placeholder="Search Patients"
            className="admin-test-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="admin-test-add-button"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Clinic
          </button>
        </div>
        <table className="admin-test-table" cellPadding="10">
          <thead className="admin-test-thead">
            <tr>
              <th className="admin-test-th">Name</th>
              <th className="admin-test-th">Email</th>
              <th className="admin-test-th">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentClinics.map((Test) => (
              <tr className="admin-test-tr" key={Test._id}>
                <td className="admin-test-td">{Test.name}</td>
                <td className="admin-test-td description">{Test.email}</td>
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
          totalPages={Math.ceil(filteredClinics.length / clinicsPerPage)}
          onPageChange={handlePageChange}
        />

        {/* Add Test Modal */}
        {isAddModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add New Clinic</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddTest({
                    name: e.target.name.value,
                    email: e.target.email.value,
                    contactNo: e.target.contactNo.value,
                    streetAddress: e.target.streetAddress.value,
                    city: e.target.city.value,
                    province: e.target.province.value,
                    country: e.target.country.value,
                    postCode: e.target.postCode.value,
                  });
                }}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Clinic Name"
                  required
                />
                <input type="email" name="email" placeholder="Email" required />
                <input
                  type="tel"
                  name="contactNo"
                  placeholder="Contact Number"
                  required
                />
                <input
                  type="text"
                  name="streetAddress"
                  placeholder="Street Address"
                  required
                />
                <input type="text" name="city" placeholder="City" required />
                <input
                  type="text"
                  name="province"
                  placeholder="Province"
                  required
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  required
                />
                <input
                  type="text"
                  name="postCode"
                  placeholder="Postal Code"
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
        {isViewModalOpen && selectedClinic && (
          <div className="modal">
            <div className="modal-content">
              <h3>View Clinic</h3>
              <p>
                <strong>Name:</strong> {selectedClinic.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedClinic.email}
              </p>
              <p>
                <strong>Contact Number:</strong> {selectedClinic.contactNo}
              </p>
              <p>
                <strong>Street Address:</strong>{" "}
                {selectedClinic.addressId.streetAddress}
              </p>
              <p>
                <strong>City:</strong> {selectedClinic.addressId.city}
              </p>
              <p>
                <strong>Province:</strong> {selectedClinic.addressId.province}
              </p>
              <p>
                <strong>Country:</strong> {selectedClinic.addressId.country}
              </p>
              <p>
                <strong>Postal Code:</strong>{" "}
                {selectedClinic.addressId.postCode}
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
              <h2>Edit Clinic</h2>
              <form>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={editCurrentClinic.name} // Prepopulating the name field
                    onChange={(e) =>
                      setEditCurrentClinic({
                        ...editCurrentClinic,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="text"
                    value={editCurrentClinic.email} // Prepopulating the name field
                    onChange={(e) =>
                      setEditCurrentClinic({
                        ...editCurrentClinic,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Contact Number:</label>
                  <input
                    type="text"
                    value={editCurrentClinic.contactNo} // Prepopulating the name field
                    onChange={(e) =>
                      setEditCurrentClinic({
                        ...editCurrentClinic,
                        contactNo: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Street Address:</label>
                  <input
                    type="text"
                    value={editCurrentClinic.addressId.streetAddress} // Prepopulating the name field
                    onChange={(e) =>
                      setEditCurrentClinic({
                        ...editCurrentClinic,
                        addressId: {
                          ...editCurrentClinic.addressId,
                          streetAddress: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>City:</label>
                  <input
                    type="text"
                    value={currentClinic.addressId.city} // Prepopulating the name field
                    onChange={(e) =>
                      setEditCurrentClinic({
                        ...editCurrentClinic,
                        addressId: {
                          ...editCurrentClinic.addressId,
                          streetAddress: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Province:</label>
                  <input
                    type="text"
                    value={currentClinic.addressId.province} // Prepopulating the name field
                    onChange={(e) =>
                      setEditCurrentClinic({
                        ...editCurrentClinic,
                        addressId: {
                          ...editCurrentClinic.addressId,
                          streetAddress: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Country:</label>
                  <input
                    type="text"
                    value={currentClinic.addressId.country} // Prepopulating the name field
                    onChange={(e) =>
                      setEditCurrentClinic({
                        ...editCurrentClinic,
                        addressId: {
                          ...editCurrentClinic.addressId,
                          streetAddress: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code:</label>
                  <input
                    type="text"
                    value={currentClinic.addressId.postCode} // Prepopulating the name field
                    onChange={(e) =>
                      setEditCurrentClinic({
                        ...editCurrentClinic,
                        addressId: {
                          ...editCurrentClinic.addressId,
                          streetAddress: e.target.value,
                        },
                      })
                    }
                  />
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

export default AdminClinic;