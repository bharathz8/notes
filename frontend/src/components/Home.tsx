import React from "react";

const Home: React.FC = () => {
  return (
    <div className="homeContainer">
      <h1>Welcome, [User Name]!</h1>
      <div className="notesSection">
        <h2>Notes</h2>
        <ul>
          <li>Note 1</li>
          <li>Note 2</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;