import React, { useState } from "react";
import { ViewMode } from "../types/viewmode";
import "../styles/components.css";
import "../styles/formtoolbar.css";

interface FormToolbarProps {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  onBack: () => void;
  onCopy: () => void;
  onReset: () => void;
  onDelete: () => void;
}

const viewLabels: Record<ViewMode, string> = {
  guided: "Guided",
  quickfill: "Quick Fill",
  printview: "Print View",
};

const FormToolbar: React.FC<FormToolbarProps> = ({
  view,
  setView,
  onBack,
  onCopy,
  onReset,
  onDelete,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = (mode: ViewMode) => {
    setView(mode);
    setDropdownOpen(false);
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this form?\n\nThis action cannot be undone."
    );
    if (confirmDelete) {
      onDelete();
    }
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
              {(["guided", "quickfill", "printview"] as ViewMode[]).map(
                (mode) => (
                  <div
                    key={mode}
                    className={`dropdown-item ${view === mode ? "active" : ""}`}
                    onClick={() => handleSelect(mode)}
                  >
                    {viewLabels[mode]}
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div className="toolbar-actions">
          <button
            className="delete-btn"
            onClick={handleDelete}
            title="Delete form"
          >
            🗑️
          </button>
          <button className="recall-btn" onClick={onCopy}>
            🔁 Recall
          </button>
        </div>
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
