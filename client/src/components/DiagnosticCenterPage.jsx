import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/DiagnosticCenterPage.css";

const DiagnosticCenterPage = () => {
  const [centers, setCenters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  //state to store new center
  const [newCenter, setNewCenter] = useState({
    name: "",
    contactNo: "",
    email: "",
    testsOffered: [],
    addressId: "",
    availabilityId: "",
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
          addressId: "",
          availabilityId: "",
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

  //search centers
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  //control modals
  const handleModalToggle = (modal, state) =>
    setModalState({ ...modalState, [modal]: state });

  //filter centers
  const filteredCenters = centers.filter((center) =>
    center.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <button type="submit">Submit</button>
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
        <button className="update-btn" type="submit">
          Submit
        </button>
      </form>
    ),
    delete: (
      <div className="delete-center">
        <h2>Are you sure you want to delete this center?</h2>
        <p>
          <strong>Name:</strong> {currentCenter?.name}
        </p>
        <button onClick={() => handleDelete(currentCenter._id)}>
          Yes, Delete
        </button>
        <button onClick={() => handleModalToggle("showDelete", false)}>
          Cancel
        </button>
      </div>
    ),
  };

  return (
    <div className="container">
      <div className="container-header">
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
          {filteredCenters.map((center) => (
            <tr key={center._id}>
              <td>{center.name}</td>
              <td>{center.contactNo}</td>
              <td>{center.email}</td>
              <td className="action-buttons">
                <button
                  className="view"
                  onClick={() => {
                    setCurrentCenter(center);
                    handleModalToggle("showView", true);
                  }}
                >
                  <i className="fa-solid fa-eye"></i>
                </button>
                <button
                  className="edit"
                  onClick={() => {
                    setCurrentCenter(center);
                    setNewCenter(center);
                    handleModalToggle("showEdit", true);
                  }}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  className="delete"
                  onClick={() => {
                    setCurrentCenter(center);
                    handleModalToggle("showDelete", true);
                  }}
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DiagnosticCenterPage;
