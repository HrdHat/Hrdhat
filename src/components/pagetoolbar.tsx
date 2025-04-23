// src/components/pagetoolbar.tsx
import React from "react";
import { ViewMode } from "../types/viewmode";
import "../styles/pagetoolbar.css";

interface PageToolbarProps {
  viewMode: ViewMode;
  onBack?: () => void;
  onContinue?: () => void;
  onSwitchView?: () => void;
  onRecall?: () => void;
  isRecallAvailable?: boolean;
  isLastField?: boolean;
}

const PageToolbar: React.FC<PageToolbarProps> = ({
  viewMode,
  onBack,
  onContinue,
  onSwitchView,
  onRecall,
  isRecallAvailable = false,
  isLastField = false,
}) => {
  if (viewMode === "printview") return null;

  const switchLabel =
    viewMode === "guided" ? "Switch to Quick Fill" : "Switch to Guided";

  const continueLabel =
    viewMode === "guided" && isLastField ? "Next Module →" : "Continue →";

  return (
    <>
      <div className="page-toolbar">
        <div className="toolbar-top-row">
          {onSwitchView && (
            <button onClick={onSwitchView} className="switch-btn">
              🔄 {switchLabel}
            </button>
          )}
          {onRecall && (
            <button
              onClick={onRecall}
              className="recall-btn"
              disabled={!isRecallAvailable}
            >
              📋 Recall
            </button>
          )}
        </div>

        <div className="toolbar-bottom-row">
          {onBack && (
            <button onClick={onBack} className="back-btn">
              ← Back
            </button>
          )}
          {onContinue && (
            <button onClick={onContinue} className="continue-btn">
              {continueLabel}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default PageToolbar;
