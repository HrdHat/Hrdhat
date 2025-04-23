import React from "react";
import { useLocation } from "react-router-dom";
import { ViewMode } from "../types/viewmode";
import HeaderModule from "../components/headermodule"; // ✅ import

interface Props {
  viewMode?: ViewMode;
  draftId?: string;
}

const FlraFormPage: React.FC<Props> = ({ viewMode, draftId }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlView = params.get("view") as ViewMode;

  const currentView = viewMode || urlView || "guided";

  // 🔧 TEMP placeholders until context is wired in
  const formId = draftId ?? "HRDHAT-FLRA-001";
  const createdDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const currentModule = "General Information"; // This will later come from context or routing

  return (
    <div className="form-page">
      <HeaderModule
        title="Field Level Risk Assessment"
        formId={formId}
        createdDate={createdDate}
        currentModule={currentModule}
        viewMode={currentView}
      />

      {/* 🧱 Your FLRA modules will render here later */}
    </div>
  );
};

export default FlraFormPage;
