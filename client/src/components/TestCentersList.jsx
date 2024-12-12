import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function TestCentersList({ test }) {
  const { testId, name } = useParams(); // gets testId from url
  const navigate = useNavigate();
  const [testDetails, setTestDetails] = useState(null);
  const location = useLocation();
  const { testName } = location.state || {};

  useEffect(() => {
    // fetches test details based on testId
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(
          //`http://localhost:3002/api/name/${name}`
          `http://localhost:3002/api/test/${testId}`
        );
        //console.log("Testcenterslist: ", response.data);
        if (response.data) {
          setTestDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching test details:", error);
      }
    };

    fetchTestDetails();
  }, [testId]);

  const handleBookNowClick = (diagnosticCenterId) => {
    console.log("Diagnostic Center ID, handleBookNowClick : ", diagnosticCenterId);
    // navigate to the testTimeslots page with the dc id
    navigate(`/testTimeslots/${diagnosticCenterId}`, { state: { testId, testName } });
  };

  // checks if test data is available
  if (!testDetails) {
    return <div>Loading diagnostic center...</div>;
  }


  return (
    <div className="test-center-header">
      <h3>Available Diagnostic Centers for {testDetails.test.name}</h3>

      <div className="test-centers-container">
        {testDetails.diagnosticCenters?.length > 0 ? (
          testDetails.diagnosticCenters.map((dc, index) => (
            
            <div key={index} className="test-center-card">
              <div className="test-center-card-body">
                <h3>{dc.diagnosticCenterName}</h3>
              
                <p>
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="location-icon"/>
                  {dc.address?.streetAddress}, {dc.address?.city},{" "}
                  {dc.address?.province}, {dc.address?.postCode}
                </p>
              </div>
              <div className="test-center-card-footer">
                <button onClick={() => handleBookNowClick(dc.diagnosticCenterId)}>
                  Book Now
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="arrow-right-icon"
                  />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No diagnostic centers available for this test.</p>
        )}
      </div>
    </div>
  );
} // end DiagnosticCentersList
