import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "../components/sidebar";
import FloatingPanel from "../components/floatingpanel";
import ActiveFormsList from "../components/activeformslist";
import PaperContainer from "../components/papercontainer";
import { FLRASessionManager } from "../utils/flrasessionmanager";
import { ViewMode } from "../types/viewmode";
import FlraFormPage from "../pages/flraformpage";

const AppShell: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activePanel, setActivePanel] = useState<
    null | "create" | "activeForms"
  >(null);
  const [viewMode, setViewMode] = useState<ViewMode | null>(null);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);

  const navigate = useNavigate();

  const openPanel = (panel: "create" | "activeForms") => {
    setActivePanel(null);
    setTimeout(() => setActivePanel(panel), 100);
  };

  const handleCreateForm = () => {
    const activeForms = FLRASessionManager.getAllDrafts();
    if (activeForms.length >= 5) {
      alert(
        "You’ve reached the maximum of 5 active FLRA forms.\n\nPlease submit or remove one before creating a new form."
      );
      return;
    }

    if (activePanel === "create") {
      const confirmNew = window.confirm(
        "You already have a form open.\n\nDo you want to discard it and start a new one?"
      );
      if (!confirmNew) return;
    }

    if (activeDraftId && activePanel !== "create") {
      setActivePanel("create");
      setSidebarVisible(false);
      return;
    }

    const newDraft = FLRASessionManager.createNewDraft("New FLRA Form");
    setActiveDraftId(newDraft.id);
    setViewMode("guided");
    setActivePanel("create");
    setSidebarVisible(false);
  };

  const handleResumeForm = (id: string) => {
    setActiveDraftId(id);
    setViewMode("guided");
    setActivePanel("create");
    setSidebarVisible(false);
    navigate("/flra?view=guided");
  };

  const handleClosePanel = () => {
    setActivePanel(null);
  };

  return (
    <div className="layout-wrapper">
      {/* Navigation container (Sidebar + FloatingPanel) */}
      <div className="nav-region">
        <Sidebar
          visible={sidebarVisible}
          onCreate={handleCreateForm}
          onHome={() => navigate("/")}
          onOpenActiveForms={() => openPanel("activeForms")}
          onToggle={() => setSidebarVisible(false)} // 👈 handler
        />

        {activePanel === "activeForms" && (
          <FloatingPanel
            title="Active FLRA Forms"
            visible={true}
            onClose={handleClosePanel}
          >
            <ActiveFormsList
              onClose={handleClosePanel}
              onResume={handleResumeForm}
            />
          </FloatingPanel>
        )}
      </div>

      {/* ☰ Burger if sidebar hidden */}
      {!sidebarVisible && (
        <div
          className="sidebar-toggle-left"
          onClick={() => setSidebarVisible(true)}
        >
          ☰ Menu
        </div>
      )}

      {/* Main content and paper form */}
      <div className="content-region">
        {activeDraftId && (
          <PaperContainer>
            <FlraFormPage
              draftId={activeDraftId ?? undefined}
              viewMode={viewMode ?? "guided"}
            />
          </PaperContainer>
        )}

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
