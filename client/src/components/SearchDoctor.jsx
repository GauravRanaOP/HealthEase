import React, { useCallback, useState } from "react";

// export default function SearchDoctor({ onSearch }) {

//   console.log("Rendering SearchDoctor...");

//   // state to store postcodePrefix
//   const [postcodePrefix, setPostcodePrefix] = useState('');

//   const handleSearch = () => {
//     if (postcodePrefix.trim()) {
//       onSearch(postcodePrefix);
//     }
//   };

//   return (
//     <div className="search-bar">
//       <input
//         type="text"
//         className="search-input"
//         placeholder="Enter the Postcode"
//         value={postcodePrefix}
//         onChange={(e) => setPostcodePrefix(e.target.value)}
//       />
//       <button className="btn btn-primary search-button" onClick={handleSearch}>Search</button>
//     </div>
//   );
// }

// using react.memo
const SearchDoctor = React.memo(({ onSearch }) => {

  console.log("Rendering SearchDoctor...");

  // state to store postcodePrefix
  const [postcodePrefix, setPostcodePrefix] = useState('');

  const handleSearch = useCallback( () => {
    
      onSearch(postcodePrefix);
    
  }, [postcodePrefix, onSearch]);

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search by Postcode"
        value={postcodePrefix}
        onChange={(e) => setPostcodePrefix(e.target.value)}
      />
      <button className="btn btn-primary search-button" onClick={handleSearch}>Search</button>
    </div>
  );
});

export default SearchDoctor;
