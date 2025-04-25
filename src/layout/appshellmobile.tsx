import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "../components/sidebar";
import FloatingPanel from "../components/floatingpanel";
import ActiveFormsList from "../components/activeformslist";
import ArchivedFormsList from "../components/ArchivedFormsList";
import PaperContainer from "../components/papercontainer";
import FormToolbar from "../components/formtoolbar";
import FlraFormPage from "../pages/flraformpage";
import { FLRASessionManager } from "../utils/flrasessionmanager";
import { formService } from "../services/form.service";
import { ViewMode } from "../types/viewmode";

const AppShellMobile: React.FC = () => {
  const [activePanel, setActivePanel] = useState<
    null | "create" | "activeForms" | "history"
  >(null);
  const [viewMode, setViewMode] = useState<ViewMode>("guided");
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  const isFormOpen = Boolean(activeDraftId);
  const navigate = useNavigate();

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
    try {
      const activeForms = Object.values(FLRASessionManager.getAllDrafts());
      if (activeForms.length >= 5) {
        alert(
          "You've reached the maximum of 5 active FLRA forms.\n\nPlease submit or remove one before creating a new form."
        );
        return;
      }

      // Create a new draft with initial data
      const newDraft = {
        id: `draft_${Date.now()}`,
        generalInfo: {
          title: "New FLRA Form",
          userId: "", // Will be populated by Supabase
        },
        modules: {},
        status: "draft" as const,
        lastModified: new Date().toISOString(),
      };

      // Create form using formService which handles both local and Supabase storage
      const result = await formService.createForm(newDraft);

      if (!result.success) {
        throw new Error(result.error);
      }

      await handleFormStateChange(newDraft.id);
    } catch (error) {
      alert("Failed to create new form. Please try again.");
      console.error("Error creating form:", error);
    }
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
    setClosing(true);
    setTimeout(() => {
      setActivePanel(null);
      setClosing(false);
    }, 300);
  };

  return (
    <div className="layout-wrapper">
      <div className="nav-region">
        <Sidebar
          className={
            activePanel === "activeForms" || activePanel === "history"
              ? "collapsed"
              : !sidebarVisible
              ? "hidden"
              : ""
          }
          visible={true}
          onCreate={handleCreateForm}
          onHome={handleCloseForm}
          onOpenActiveForms={() => setActivePanel("activeForms")}
          onOpenHistory={() => setActivePanel("history")}
          onToggle={() => setSidebarVisible(false)}
        />

        {(activePanel === "activeForms" || activePanel === "history") && (
          <FloatingPanel
            title={
              activePanel === "activeForms"
                ? "Active FLRA Forms"
                : "Form History"
            }
            visible={true}
            onClose={handleClosePanel}
            className={closing ? "closed" : ""}
          >
            {activePanel === "activeForms" ? (
              <ActiveFormsList
                onClose={handleClosePanel}
                onResume={handleResumeForm}
              />
            ) : (
              <ArchivedFormsList onClose={handleClosePanel} />
            )}
          </FloatingPanel>
        )}
      </div>

      {!sidebarVisible &&
        activePanel !== "activeForms" &&
        activePanel !== "history" && (
          <div
            className="sidebar-toggle-left"
            onClick={() => setSidebarVisible(true)}
          >
            ☰
          </div>
        )}

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
          <main className="app-content">
            <Outlet />
          </main>
        )}
      </div>
    </div>
  );
};

export default AppShellMobile;
