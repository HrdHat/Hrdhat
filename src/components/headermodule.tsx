// src/components/headermodule.tsx
import React from "react";
import { ViewMode } from "../types/viewmode";
import "../styles/headermodules.css";
import FailsafeLogo from "../assets/logo/HRDHAT LOGO & ICONT.svg"; // ✅ working fallback logo

interface HeaderModuleProps {
  title: string;
  formId: string;
  createdDate: string;
  currentModule: string;
  viewMode: ViewMode;
  logoSrc?: string; // ✅ optional override
}

const HeaderModule: React.FC<HeaderModuleProps> = ({
  title,
  formId,
  createdDate,
  currentModule,
  viewMode,
  logoSrc,
}) => {
  const modeLabel = {
    guided: "Guided Mode",
    quickfill: "Quick Fill Mode",
    printview: "Print View Mode",
  }[viewMode];

  const [useFallback, setUseFallback] = React.useState(false);
  const resolvedLogo = !useFallback && logoSrc ? logoSrc : FailsafeLogo;

  return (
    <div className="header-module">
      <div className="header-top">
        <div className="header-logo">
          <img
            src={resolvedLogo}
            alt="HrdHat Logo"
            onError={() => {
              console.warn(
                "Logo failed to load. Falling back to failsafe logo."
              );
              setUseFallback(true);
            }}
          />
        </div>
        <div className="header-textblock">
          <h2 className="form-title">{title}</h2>
          <div className="form-meta">
            <span className="form-id">Form #: {formId}</span>
            <span className="created-date">Created: {createdDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderModule;
