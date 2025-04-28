import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Sidebar from "../components/sidebar";
import FloatingPanel from "../components/floatingpanel";
import ActiveFormsList from "../components/activeformslist";
import ArchivedFormsList from "../components/ArchivedFormsList";
import PaperContainer from "../components/papercontainer";
import FormToolbar from "../components/formtoolbar";
import FlraFormPage from "../pages/flraformpage";
import { FLRASessionManager } from "../utils/flrasessionmanager";
import { ViewMode } from "../types/viewmode";

interface AppShellProps {
  children?: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activePanel, setActivePanel] = useState<
    null | "create" | "activeForms" | "history"
  >(null);
  const [viewMode, setViewMode] = useState<ViewMode>("guided");
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const isFormOpen = Boolean(activeDraftId);
  const navigate = useNavigate();
  const location = useLocation();

  const openPanel = (panel: "create" | "activeForms" | "history") => {
    setActivePanel(null);
    setTimeout(() => setActivePanel(panel), 100);
  };

  const handleFormStateChange = async (newDraftId: string | null) => {
    // If we're closing a form
    if (!newDraftId) {
      setActiveDraftId(null);
      setActivePanel(null);
      setSidebarVisible(true);
      navigate("/");
      return;
    }

    // If we have an open form
    if (activeDraftId) {
      const confirmSwitch = window.confirm(
        "You have an open form. Would you like to save it before switching?"
      );
      if (!confirmSwitch) {
        return false;
      }
      // Here you could add logic to save the current form if needed
    }

    // Open the new form
    setActiveDraftId(newDraftId);
    setViewMode("guided");
    setActivePanel("create");
    setSidebarVisible(false);
    navigate("/flra");
    return true;
  };

  const handleCreateForm = async () => {
    const activeForms = Object.values(FLRASessionManager.getAllDrafts());
    if (activeForms.length >= 5) {
      alert(
        "You've reached the maximum of 5 active FLRA forms.\n\nPlease submit or remove one before creating a new form."
      );
      return;
    }

    const newDraft = FLRASessionManager.createNewDraft("New FLRA Form");
    await handleFormStateChange(newDraft.id);
  };

  const handleResumeForm = async (id: string) => {
    const success = await handleFormStateChange(id);
    if (success) {
      setActivePanel(null); // Close the active forms panel after successful resume
    }
  };

  const handleCloseForm = async () => {
    await handleFormStateChange(null);
  };

  const handleDeleteForm = () => {
    if (activeDraftId) {
      FLRASessionManager.deleteDraft(activeDraftId);
      handleFormStateChange(null);
    }
  };

  const handleClosePanel = () => {
    setActivePanel(null);
  };

  const handleSettings = () => {
    navigate("/account-settings");
  };

  return (
    <div className="layout-wrapper">
      {/* Navigation container (Sidebar + FloatingPanel) */}
      <div className="nav-region">
        {!sidebarVisible && (
          <div
            className="sidebar-toggle-left"
            onClick={() => setSidebarVisible(true)}
          >
            ☰ Menu
          </div>
        )}
        <Sidebar
          visible={sidebarVisible}
          onCreate={handleCreateForm}
          onHome={() => handleFormStateChange(null)}
          onOpenActiveForms={() => openPanel("activeForms")}
          onOpenHistory={() => openPanel("history")}
          onSettings={handleSettings}
          onToggle={() => {
            setSidebarVisible(false);
            setActivePanel(null);
          }}
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

        {activePanel === "history" && (
          <FloatingPanel
            title="Form History"
            visible={true}
            onClose={handleClosePanel}
          >
            <ArchivedFormsList onClose={handleClosePanel} />
          </FloatingPanel>
        )}
      </div>

      <div className="content-region">
        {isFormOpen ? (
          <div className="paper-section">
            <PaperContainer>
              <FlraFormPage draftId={activeDraftId!} viewMode={viewMode} />
            </PaperContainer>
            <FormToolbar
              view={viewMode}
              setView={setViewMode}
              onBack={handleCloseForm}
              onCopy={() => console.log("Copy from Yesterday")}
              onReset={() => console.log("Reset form")}
              onDelete={handleDeleteForm}
            />
          </div>
        ) : (
          <main className="app-content">{children}</main>
        )}
      </div>
    </div>
  );
};

export default AppShell;
