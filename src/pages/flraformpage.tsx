import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { ViewMode } from "../types/viewmode";

import GuidedMode from "../fillmodes/guidedmode";
import QuickFillMode from "../fillmodes/quickfillmode";
import PageToolbar from "../components/pagetoolbar";

interface Props {
  viewMode?: ViewMode;
  draftId?: string;
}

const FlraFormPage: React.FC<Props> = ({ viewMode, draftId }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlView = params.get("view") as ViewMode;

  const [currentView, setCurrentView] = useState<ViewMode>(
    viewMode || urlView || "guided"
  );

  // Placeholder nav logic for now
  const handleBack = () => {
    console.log("Back clicked");
  };

  const handleContinue = () => {
    console.log("Continue clicked");
  };

  const handleSwitchView = () => {
    setCurrentView((prev) => (prev === "guided" ? "quickfill" : "guided"));
  };

  return (
    <div className="form-page">
      {currentView === "guided" && <GuidedMode draftId={draftId || ""} />}
      {currentView === "quickfill" && <QuickFillMode />}
      {currentView === "printview" && (
        <div style={{ padding: "2rem", color: "#aaa" }}>
          <h2>Print View coming soon...</h2>
        </div>
      )}

      <PageToolbar
        viewMode={currentView}
        onBack={handleBack}
        onContinue={handleContinue}
        onSwitchView={handleSwitchView}
        isRecallAvailable={false}
        onRecall={() => console.log("Recall clicked")} // optional
        isLastField={false} // replace with dynamic check later
      />
    </div>
  );
};

export default FlraFormPage;
