import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import "../assets/css/DiagnosticCenterPage.css";
import Pagination from "./Pagination";
import SideBar from "./SideBar";

const DiagnosticCenterPage = () => {
  const [centers, setCenters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [centersPerPage] = useState(8);
  const [centerToDelete, setCenterToDelete] = useState(null);

  // State to store new center and selected center for edit/view
  const [newCenter, setNewCenter] = useState({
    name: "",
    contactNo: "",
    email: "",
    password: "",
    address: {
      streetAddress: "",
      city: "",
      province: "",
      country: "",
      postCode: "",
    },
  });
  const [selectedCenter, setSelectedCenter] = useState(null);

  // State to control modals
  const [modalState, setModalState] = useState({
    showCreate: false,
    showView: false,
    showEdit: false,
    showDelete: false,
  });

  // Fetch diagnostic centers
  useEffect(() => {
    axios
      .get("https://healthease-n5ra.onrender.com/api/diagnostic-centers")
      .then((response) => setCenters(response.data))
      .catch(console.error);
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setNewCenter((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setNewCenter((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Create new diagnostic center
  const handleCreate = (e) => {
    e.preventDefault();
    axios
      .post(
        "https://healthease-n5ra.onrender.com/api/diagnostic-centers",
        newCenter
      )
      .then((response) => {
        setCenters([...centers, response.data]);
        setModalState({ ...modalState, showCreate: false });
        setNewCenter({
          name: "",
          contactNo: "",
          email: "",
          password: "",
          address: {
            streetAddress: "",
            city: "",
            province: "",
            country: "",
            postCode: "",
          },
        });
      })
      .catch((error) => {
        console.error(
          "Error creating diagnostic center:",
          error.response?.data || error.message
        );
        alert("Failed to create diagnostic center.");
      });
  };

  // Update diagnostic center
  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(
        `https://healthease-n5ra.onrender.com/api/diagnostic-centers/${selectedCenter._id}`,
        newCenter
      )
      .then((response) => {
        setCenters(
          centers.map((center) =>
            center._id === selectedCenter._id ? response.data : center
          )
        );
        setModalState({ ...modalState, showEdit: false });
        setSelectedCenter(null);
      })
      .catch((error) => {
        console.error(
          "Error updating diagnostic center:",
          error.response?.data || error.message
        );
        alert("Failed to update diagnostic center.");
      });
  };

  const handleDelete = () => {
    axios
      .delete(
        `https://healthease-n5ra.onrender.com/api/diagnostic-centers/${centerToDelete._id}`
      )
      .then(() => {
        // Update the UI
        setCenters(
          centers.filter((center) => center._id !== centerToDelete._id)
        );
        setModalState({ ...modalState, showDelete: false });
        alert("Diagnostic center deleted successfully.");
        setCenterToDelete(null);
      })
      .catch((error) => {
        console.error(
          "Error deleting diagnostic center:",
          error.response?.data || error.message
        );
        alert("Failed to delete diagnostic center.");
      });
  };

  // Modal content object
  const modalContent = {
    create: (
      <form onSubmit={handleCreate}>
        <h2>Create New Diagnostic Center</h2>
        {["name", "email", "password", "contactNo"].map((field) => (
          <input
            key={field}
            type={field === "email" ? "email" : "text"}
            name={field}
            placeholder={field.replace(/([A-Z])/g, " $1")}
            value={newCenter[field]}
            onChange={handleInputChange}
            required
          />
        ))}
        <h3>Address</h3>
        {["streetAddress", "city", "province", "country", "postCode"].map(
          (field) => (
            <input
              key={field}
              type="text"
              name={`address.${field}`}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={newCenter.address[field]}
              onChange={handleInputChange}
              required
            />
          )
        )}
        <button className="submit-btn" type="submit">
          Submit
        </button>
      </form>
    ),
    view: (
      <div className="view-center">
        <h2>View Diagnostic Center</h2>
        <p>
          <strong>Name:</strong> {selectedCenter?.name}
        </p>
        <p>
          <strong>Contact No:</strong> {selectedCenter?.contactNo}
        </p>
        <p>
          <strong>Email:</strong> {selectedCenter?.email}
        </p>
        <p>
          <strong>Address:</strong>{" "}
          {selectedCenter?.addressId
            ? `${selectedCenter.addressId.streetAddress}, ${selectedCenter.addressId.city}, ${selectedCenter.addressId.province}, ${selectedCenter.addressId.country} - ${selectedCenter.addressId.postCode}`
            : "N/A"}
        </p>
      </div>
    ),
    edit: (
      <form onSubmit={handleUpdate}>
        <h2>Edit Diagnostic Center</h2>
        {["name", "contactNo", "email"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.replace(/([A-Z])/g, " $1")}
            value={newCenter[field]}
            onChange={handleInputChange}
            required
          />
        ))}
        <h3>Address</h3>
        {["streetAddress", "city", "province", "country", "postCode"].map(
          (field) => (
            <input
              key={field}
              type="text"
              name={`address.${field}`}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={newCenter.address[field]}
              disabled
            />
          )
        )}
        <button className="update-btn" type="submit">
          Update
        </button>
      </form>
    ),
    delete: (
      <div className="delete-center">
        <h3>Are you sure you want to delete?</h3>
        <p>
          <strong>Name:</strong> {centerToDelete?.name}
        </p>
        <p>
          <strong>Email:</strong> {centerToDelete?.email}
        </p>
        <div className="button-container">
          <button className="confirm-btn" onClick={handleDelete}>
            Yes
          </button>
          <button
            className="cancel-btn"
            onClick={() => {
              setModalState({ ...modalState, showDelete: false });
              setCenterToDelete(null);
            }}
          >
            No
          </button>
        </div>
      </div>
    ),
  };

  return (
    <div className="app-layout">
      <Helmet>
        <title>Diagnostic Centers | HealthEase</title>
        <meta
          name="description"
          content="Explore and manage diagnostic centers. Create, update, and delete diagnostic centers for optimal healthcare services."
        />
        <meta
          name="keywords"
          content="diagnostic centers, healthcare, manage centers, HealthEase"
        />
        <meta name="author" content="HealthEase Team" />
        <link
          rel="canonical"
          href="https://healthease-n5ra.onrender.com/diagnostic-center"
        />
      </Helmet>
      <SideBar />
      <div className="dc-container">
        <div className="dc-container-header">
          <input
            type="text"
            placeholder="Search Diagnostic Centers"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="create-btn"
            onClick={() => setModalState({ ...modalState, showCreate: true })}
          >
            <i className="fa fa-plus"></i>Create
          </button>
        </div>

        {Object.keys(modalState).map(
          (key) =>
            modalState[key] && (
              <div className="modals" key={key}>
                <div className="modals-content">
                  <span
                    className="close"
                    onClick={() =>
                      setModalState({ ...modalState, [key]: false })
                    }
                  >
                    &times;
                  </span>
                  {modalContent[key.replace("show", "").toLowerCase()]}
                </div>
              </div>
            )
        )}

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact No</th>
              <th>Email</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {centers.map((center) => (
              <tr key={center._id}>
                <td>{center.name}</td>
                <td>{center.contactNo}</td>
                <td>{center.email}</td>
                <td>
                  {center.addressId
                    ? `${center.addressId.streetAddress}, ${center.addressId.city}, ${center.addressId.province}, ${center.addressId.country} - ${center.addressId.postCode}`
                    : "Address not available"}
                </td>
                <td className="action-buttons">
                  <i
                    className="fa-solid fa-eye"
                    onClick={() => {
                      setSelectedCenter(center);
                      setModalState({ ...modalState, showView: true });
                    }}
                  ></i>
                  <i
                    className="fa-solid fa-pen-to-square"
                    onClick={() => {
                      setSelectedCenter(center);
                      setNewCenter({
                        ...center,
                        address: center.addressId || {},
                      });
                      setModalState({ ...modalState, showEdit: true });
                    }}
                  ></i>
                  <i
                    className="fa-solid fa-trash-can"
                    onClick={() => {
                      setCenterToDelete(center);
                      setModalState({ ...modalState, showDelete: true });
                    }}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(centers.length / centersPerPage)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default DiagnosticCenterPage;
