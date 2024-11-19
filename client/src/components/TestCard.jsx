import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";


export default function TestCard({ test }) {
 
  const navigate = useNavigate();

  // // checks if test data is available
  // if (!test) {
  //   return <div>Loading diagnostic center...</div>;
  // }

  // // destructures diagnostic center address
  // const { streetAddress, city, province, postCode } = test.diagnosticCenters?.[0]?.address || {};

  // navigates to TestCentersList page when book now button is clicked
  const handleTestCenterDetailsClick = () => {
    if (test._id) {
      navigate (`/testCentersList/${test._id}`);
    } else {
      console.log("TestId is undefined");
    }
  };


  return (
    <div className="test-card">
      <h3>{test.name}</h3>
      <div className="test-card-p-container">
        <p>{test.description}</p>
          {/* {test.diagnosticCenters && test.diagnosticCenters.length > 0 ? (
            test.diagnosticCenters.map((dc, index) => (
              <p key={index}>
                <FontAwesomeIcon icon={faLocationDot} className="icon" />
                {dc.address?.streetAddress}, {dc.address?.city} ,{dc.address?.province}, {dc.address?.postCode}
              </p>
            ))
          ) : (
            <p>No diagnostic centers available</p>
          )} */}
      </div>

      <div className="test-card-open-container">
        {/* <div>Available Now</div> */}
        <div>
          <button onClick={handleTestCenterDetailsClick}>
            Test Center Details
            <FontAwesomeIcon icon={faArrowRight} className="arrow-right-icon" />
          </button>
        </div>
      </div>
    </div>
  );
  
}
