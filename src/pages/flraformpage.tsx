import React from "react";
import { useLocation } from "react-router-dom";
import { ViewMode } from "../types/viewmode";

import GuidedMode from "../modules/guidedmode";
import QuickFillMode from "../modules/quickfillmode";
// fullview still TBD — leave fallback for now

const FlraFormPage: React.FC<{ viewMode?: ViewMode }> = ({ viewMode }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlView = params.get("view") as ViewMode;

  const mode: ViewMode = viewMode || urlView || "guided";

  return (
    <div className="form-page">
      {mode === "guided" && <GuidedMode />}
      {mode === "quickfill" && <QuickFillMode />}
      {mode === "printview" && (
        <div style={{ padding: "2rem", color: "#aaa" }}>
          <h2>Print View coming soon...</h2>
        </div>
      )}
    </div>
  );
};

export default FlraFormPage;
