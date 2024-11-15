import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/DiagnosticCenterPage.css";
import Pagination from "./Pagination";
import SideBar from "./SideBar";

const DiagnosticCenterPage = () => {
  const [centers, setCenters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [centersPerPage] = useState(8);

  //state to store new center
  const [newCenter, setNewCenter] = useState({
    name: "",
    contactNo: "",
    email: "",
    testsOffered: [],
    address: {
      streetAddress: "",
      city: "",
      province: "",
      country: "",
      postCode: "",
    },
    availability: {
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      type: "DiagnosticCenter",
    },
  });

  //state to control modals
  const [modalState, setModalState] = useState({
    showCreate: false,
    showView: false,
    showEdit: false,
    showDelete: false,
  });
  const [currentCenter, setCurrentCenter] = useState(null);

  //fetch centers
  useEffect(() => {
    axios
      .get("http://localhost:3002/api/diagnostic-centers")
      .then((response) => setCenters(response.data))
      .catch(console.log);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCenter((prev) => ({ ...prev, [name]: value }));
  };

  //create new center
  const handleCreate = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3002/api/diagnostic-centers", newCenter)
      .then((response) => {
        setCenters([...centers, response.data]);
        setModalState((prev) => ({ ...prev, showCreate: false }));
        setNewCenter({
          name: "",
          contactNo: "",
          email: "",
          testsOffered: [],
          address: {
            streetAddress: "",
            city: "",
            province: "",
            country: "",
            postCode: "",
          },
          availability: {
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            type: "DiagnosticCenter",
          },
        });
      })
      .catch(console.log);
  };

  //update center
  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:3002/api/diagnostic-centers/${currentCenter._id}`,
        newCenter
      )
      .then((response) => {
        setCenters(
          centers.map((center) =>
            center._id === currentCenter._id ? response.data : center
          )
        );
        setModalState((prev) => ({ ...prev, showEdit: false }));
      })
      .catch(console.log);
  };

  //delete center
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3002/api/diagnostic-centers/${id}`)
      .then(() => {
        setCenters(centers.filter((center) => center._id !== id));
        setModalState((prev) => ({ ...prev, showDelete: false }));
      })
      .catch(console.log);
  };

  // Search centers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  //filter centers
  const filteredCenters = centers.filter((center) =>
    center.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //calculate the current page of centers
  const currentCenters = filteredCenters.slice(
    (currentPage - 1) * centersPerPage,
    currentPage * centersPerPage
  );

  //handle page change
  const handlePageChange = (page) => setCurrentPage(page);

  //control modals
  const handleModalToggle = (modal, state) =>
    setModalState({ ...modalState, [modal]: state });

  //modal content object
  const modalContent = {
    create: (
      <form onSubmit={handleCreate}>
        <h2>Create New Center</h2>
        {["name", "contactNo", "email"].map((field) => (
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
        <textarea
          name="testsOffered"
          placeholder="Tests Offered (comma separated)"
          value={newCenter.testsOffered}
          onChange={(e) => handleInputChange(e)}
        />

        <h3>Address</h3>
        {["streetAddress", "city", "province", "country", "postCode"].map(
          (field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={newCenter.address[field]}
              onChange={(e) =>
                setNewCenter((prev) => ({
                  ...prev,
                  address: { ...prev.address, [field]: e.target.value },
                }))
              }
              required
            />
          )
        )}

        <h3>Availability</h3>
        {["startDate", "endDate", "startTime", "endTime"].map((field) => (
          <input
            key={field}
            type={field.includes("Date") ? "date" : "time"}
            name={field}
            value={newCenter.availability[field]}
            onChange={(e) =>
              setNewCenter((prev) => ({
                ...prev,
                availability: { ...prev.availability, [field]: e.target.value },
              }))
            }
            required
          />
        ))}
        <div className="button-container">
          <button className="submit-btn" type="submit">
            Submit
          </button>
        </div>
      </form>
    ),
    view: (
      <div className="view-center">
        <h2>View Center</h2>
        <p>
          <strong>Name:</strong> {currentCenter?.name}
        </p>
        <p>
          <strong>Contact No:</strong> {currentCenter?.contactNo}
        </p>
        <p>
          <strong>Email:</strong> {currentCenter?.email}
        </p>
        <p>
          <strong>Tests Offered:</strong>{" "}
          {currentCenter?.testsOffered.join(", ")}
        </p>
      </div>
    ),
    edit: (
      <form onSubmit={handleUpdate}>
        <h2>Edit Center</h2>
        {["name", "contactNo", "email"].map((field) => (
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
        <textarea
          name="testsOffered"
          placeholder="Tests Offered (comma separated)"
          value={newCenter.testsOffered}
          onChange={(e) => handleInputChange(e)}
        />
        <div className="button-container">
          <button className="update-btn" type="submit">
            Submit
          </button>
        </div>
      </form>
    ),
    delete: (
      <div className="delete-center">
        <h2>Are you sure you want to delete this center?</h2>
        <p>
          <strong>Name:</strong> {currentCenter?.name}
        </p>
        <div className="button-container">
          <button onClick={() => handleDelete(currentCenter._id)}>
            Yes, Delete
          </button>
          <button onClick={() => handleModalToggle("showDelete", false)}>
            Cancel
          </button>
        </div>
      </div>
    ),
  };

  return (
    <div className="app-layout">
      <SideBar />
      <div className="dc-container">
        <div className="dc-container-header">
          <input
            type="text"
            placeholder="Search Diagnostic Centers"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button
            className="create-btn"
            onClick={() => handleModalToggle("showCreate", true)}
          >
            <i className="fa fa-plus"></i>Create
          </button>
        </div>

        {["showCreate", "showView", "showEdit", "showDelete"].map(
          (modal) =>
            modalState[modal] && (
              <div key={modal} className="modals">
                <div className="modals-content">
                  <span
                    className="close"
                    onClick={() => handleModalToggle(modal, false)}
                  >
                    &times;
                  </span>
                  {modalContent[modal.replace("show", "").toLowerCase()]}
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCenters.map((center) => (
              <tr key={center._id}>
                <td>{center.name}</td>
                <td>{center.contactNo}</td>
                <td>{center.email}</td>
                <td className="action-buttons">
                  <i
                    className="fa-solid fa-eye"
                    onClick={() => {
                      setCurrentCenter(center);
                      handleModalToggle("showView", true);
                    }}
                  ></i>
                  <i
                    className="fa-solid fa-pen-to-square"
                    onClick={() => {
                      setCurrentCenter(center);
                      setNewCenter(center);
                      handleModalToggle("showEdit", true);
                    }}
                  ></i>
                  <i
                    className="fa-solid fa-trash-can"
                    onClick={() => {
                      setCurrentCenter(center);
                      handleModalToggle("showDelete", true);
                    }}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredCenters.length / centersPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default DiagnosticCenterPage;
