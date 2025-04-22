import React, { useState } from "react";
import "../styles/components.css";
import "../styles/formtoolbar.css";

type ViewMode = "zoomed" | "mid" | "full";

interface FormToolbarProps {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  onBack: () => void;
  onCopy: () => void;
}

const viewLabels: Record<ViewMode, string> = {
  zoomed: "Guided",
  mid: "Quick Fill",
  full: "Print View",
};

const FormToolbar: React.FC<FormToolbarProps> = ({
  view,
  setView,
  onBack,
  onCopy,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = (mode: ViewMode) => {
    setView(mode);
    setDropdownOpen(false);
  };

  return (
    <div className="form-toolbar">
      {/* Top row: Dropdown + Recall */}
      <div className="toolbar-top-row">
        <div className="view-dropdown">
          <button
            className="view-dropdown-toggle"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            View Mode: {viewLabels[view]} ▼
          </button>

          {dropdownOpen && (
            <div className="view-dropdown-menu">
              {(["zoomed", "mid", "full"] as ViewMode[]).map((mode) => (
                <div
                  key={mode}
                  className={`dropdown-item ${view === mode ? "active" : ""}`}
                  onClick={() => handleSelect(mode)}
                >
                  {viewLabels[mode]}
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="recall-btn" onClick={onCopy}>
          🔁 Recall
        </button>
      </div>

      {/* Bottom row: Back and Continue */}
      <div className="toolbar-bottom-row">
        <div className="back-text" onClick={onBack}>
          ← Back
        </div>
        <button className="continue-btn">Continue</button>
      </div>
    </div>
  );
};

export default FormToolbar;
