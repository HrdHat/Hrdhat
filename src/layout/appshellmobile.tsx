import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "../components/sidebar";
import FloatingPanel from "../components/floatingpanel";
import ActiveFormsList from "../components/activeformslist";
import PaperContainer from "../components/papercontainer";
import FormToolbar from "../components/formtoolbar";
import FlraFormPage from "../pages/flraformpage";
import { FLRASessionManager } from "../utils/flrasessionmanager";
import { ViewMode } from "../types/viewmode";

const AppShellMobile: React.FC = () => {
  const [activePanel, setActivePanel] = useState<
    null | "create" | "activeForms"
  >(null);
  const [viewMode, setViewMode] = useState<ViewMode>("guided");
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const isFormOpen = Boolean(activeDraftId);
  const navigate = useNavigate();
  const [closing, setClosing] = useState(false);

  const handleCreateForm = () => {
    const activeForms = FLRASessionManager.getAllDrafts();
    if (activeForms.length >= 5) {
      alert("You’ve reached the max of 5 active FLRAs.");
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
    setClosing(true); // trigger CSS animation
    setTimeout(() => {
      setActivePanel(null);
      setSidebarVisible(true); // reopen sidebar after panel closes
      setClosing(false); // reset animation state
    }, 300); // matches CSS transition duration
  };

  return (
    <div className="layout-wrapper">
      <div className="nav-region">
        {/* Sidebar (collapsed or full) */}
        <Sidebar
          className={
            activePanel === "activeForms"
              ? "collapsed"
              : !sidebarVisible
              ? "hidden"
              : ""
          }
          visible={true}
          onCreate={handleCreateForm}
          onHome={() => navigate("/")}
          onOpenActiveForms={() => setActivePanel("activeForms")}
          onToggle={() => setSidebarVisible(false)}
        />

        {/* Floating Panel */}
        {activePanel === "activeForms" && (
          <FloatingPanel
            title="Active FLRA Forms"
            visible={true}
            onClose={handleClosePanel}
            className={closing ? "closed" : ""}
          >
            <ActiveFormsList
              onClose={handleClosePanel}
              onResume={handleResumeForm}
            />
          </FloatingPanel>
        )}
      </div>

      {/* Burger icon */}
      {!sidebarVisible && activePanel !== "activeForms" && (
        <div
          className="sidebar-toggle-left"
          onClick={() => setSidebarVisible(true)}
        >
          ☰
        </div>
      )}

      {/* Paper content */}
      <div className="content-region">
        {isFormOpen && (
          <div className="paper-section">
            <PaperContainer>
              <FlraFormPage draftId={activeDraftId!} viewMode={viewMode} />
            </PaperContainer>
            <FormToolbar
              view={viewMode}
              setView={setViewMode}
              onBack={() => navigate("/")}
              onCopy={() => console.log("Copy from Yesterday")}
              onReset={() => console.log("Reset form")}
            />
          </div>
        )}

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShellMobile;
