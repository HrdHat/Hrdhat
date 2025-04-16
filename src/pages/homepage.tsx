import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import "../App.css"; // Assuming this is where the .app-container and background are now

const HomePage = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const handleCreateForm = () => {
    setShowSidebar(false);
    setTimeout(() => setShowForm(true), 300);
  };

  const handleBackToHome = () => {
    setShowForm(false);
    setTimeout(() => setShowSidebar(true), 300);
  };

  return (
    <div className="app-container">
      <Sidebar visible={showSidebar} onCreate={handleCreateForm} />

      {showForm && (
        <div className="paper-container">
          <div className="back-button" onClick={handleBackToHome}>
            ← Back
          </div>
          <h2>Field Level Risk Assessment</h2>
          <p>This is your FLRA form...</p>
        </div>
      )}

      {!showSidebar && !showForm && <div className="paper-edge"></div>}
    </div>
  );
};

export default HomePage;
