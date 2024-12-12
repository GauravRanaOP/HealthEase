import React, { useState } from "react";

export default function SearchTest({ onSearch }) {

  console.log("Rendering Search Test...");

  // state to store postcodePrefix
  const [testName, settestName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (testName.trim()) {
      setLoading(true);
      try {
        // makes an api call via onSearch callback function passed as prop
        await onSearch(testName);
      } catch (error) {
        console.error("Error fetching test data:", error);
        setError("There was an error fetching test data, please try again");
      } finally {
        setLoading(false);
      }
      
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Enter the Test Name"
        value={testName}
        onChange={(e) => settestName(e.target.value)}
      />
      <button 
        className="search-button" 
        onClick={handleSearch}
        disabled={loading}
        >
        {loading ? "Searching..." : "Search" }
      </button>

      {/* displays error message if there's an error */}
      {error && <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

    </div>
  );
}
