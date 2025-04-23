// src/components/headermodule.tsx
import React from "react";
import "../styles/headermodules.css"; // Adjust the path as necessary

interface HeaderModuleProps {
  title: string;
  formId: string;
  createdDate: string;
  currentModule: string;
  viewMode: "guided" | "quickfill" | "fullview";
}

const HeaderModule: React.FC<HeaderModuleProps> = ({
  title,
  formId,
  createdDate,
  currentModule,
  viewMode,
}) => {
  const modeLabel = {
    guided: "Guided Mode",
    quickfill: "Quick Fill Mode",
    fullview: "Full View",
  }[viewMode];

  return (
    <div className="header-module">
      <div className="header-top">
        <h1 className="form-title">{title}</h1>
        <div className="form-meta">
          <span className="form-id">Form #: {formId}</span>
          <span className="created-date">Created: {createdDate}</span>
        </div>
      </div>
      <div className="header-sub">
        <span className="current-module">{currentModule}</span>
        <span className="view-mode">({modeLabel})</span>
      </div>
    </div>
  );
};

export default HeaderModule;
