import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import FlraSelectView from "../components/flraselectview";
import FlraFormPage from "./flraformpage";
import { ViewMode } from "../types/viewmode";
import "../styles/layout.css";
import "../styles/components.css";
import { FLRASessionManager } from "../utils/flrasessionmanager";
import FloatingPanel from "../components/floatingpanel";
import ActiveFormsContent from "../components/activeformscontent";

const HomePage = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode | null>(null);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [showActiveForms, setShowActiveForms] = useState(false);

  const handleCreateForm = () => {
    const newDraft = FLRASessionManager.createNewDraft("New FLRA Form");
    setActiveDraftId(newDraft.id);
    setShowSidebar(false);
    setTimeout(() => setShowForm(true), 300);
  };

  const handleBackToHome = () => {
    const confirmClose = window.confirm(
      "Are you sure you want to close this form? It has been saved under Active Forms."
    );
    if (!confirmClose) return;

    setViewMode(null);
    setShowForm(false);
  };

  const handleViewSelect = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <div className="app-container">
      {!showSidebar && (
        <div
          className="sidebar-toggle-left"
          onClick={() => setShowSidebar(true)}
        >
          ☰ Menu
        </div>
      )}

      <Sidebar
        visible={showSidebar}
        onCreate={handleCreateForm}
        onHome={handleBackToHome}
        onOpenActiveForms={() => setShowActiveForms(true)}
      />

      {showActiveForms && (
        <FloatingPanel
          title="Active FLRA Forms"
          onClose={() => setShowActiveForms(false)}
        >
          <ActiveFormsContent
            onClose={() => setShowActiveForms(false)}
            onResume={(id) => {
              setActiveDraftId(id);
              setShowForm(true);
              setViewMode("guided"); // Optional: store last-used mode in draft
            }}
          />
        </FloatingPanel>
      )}

      {showForm && (
        <div className="paper-container">
          {viewMode === null ? (
            <FlraSelectView onSelect={handleViewSelect} />
          ) : (
            <FlraFormPage viewMode={viewMode} draftId={activeDraftId} />
          )}
        </div>
      )}

      {!showSidebar && !showForm && <div className="paper-edge"></div>}
    </div>
  );
};

export default HomePage;
