import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { ViewMode } from "../types/viewmode";
import HeaderModule from "../components/headermodule"; // ✅ import
import "../styles/flraformpage.css"; // ✅ import
import EngineerLogo from "../assets/logo/engineer.png";

interface Props {
  viewMode?: ViewMode;
  draftId?: string;
}

const FlraFormPage: React.FC<Props> = ({ viewMode, draftId }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlView = params.get("view") as ViewMode;
  const currentView = viewMode || urlView || "guided";

  // If no draftId is provided, redirect to home
  if (!draftId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="form-page">
      <HeaderModule
        title="Field Level Risk Assessment"
        formId={draftId}
        createdDate={new Date().toISOString().split("T")[0]}
        currentModule="General Information"
        viewMode={currentView}
        logoSrc="../assets/logo/engineer.png"
      />

      {/* 🧱 Your FLRA modules will render here later */}
    </div>
  );
};

export default FlraFormPage;
