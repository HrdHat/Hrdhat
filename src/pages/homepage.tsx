import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import FlraSelectView from "./flraselectview";
import FlraFormPage from "./flraformpage";
import "../App.css";

const HomePage = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<"zoomed" | "mid" | "full" | null>(
    null
  );

  const handleCreateForm = () => {
    setShowSidebar(false);
    setTimeout(() => setShowForm(true), 300);
  };

  const handleBackToHome = () => {
    setViewMode(null);
    setShowForm(false);
    setTimeout(() => setShowSidebar(true), 300);
  };

  const handleViewSelect = (mode: "zoomed" | "mid" | "full") => {
    setViewMode(mode);
  };

  return (
    <div className="app-container">
      <Sidebar visible={showSidebar} onCreate={handleCreateForm} />

      {showForm && (
        <div className="paper-container">
          <div className="back-button" onClick={handleBackToHome}>
            ← Back
          </div>

          {viewMode === null ? (
            <FlraSelectView onSelect={handleViewSelect} />
          ) : (
            <FlraFormPage viewMode={viewMode} />
          )}
        </div>
      )}

      {!showSidebar && !showForm && <div className="paper-edge"></div>}
    </div>
  );
};

export default HomePage;
