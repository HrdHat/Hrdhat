import React from "react";
import "./formtoolbar.css";

type ViewMode = "zoomed" | "mid" | "full";

interface FormToolbarProps {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  onBack: () => void;
  onCopy: () => void;
  onReset: () => void; // ✅ This is coming from the parent!
}

const FormToolbar: React.FC<FormToolbarProps> = ({
  view,
  setView,
  onBack,
  onCopy,
  onReset, // ✅ Use this instead of local function
}) => {
  return (
    <div className="form-toolbar">
      <button onClick={onBack}>Home</button>
      <div className="view-buttons">
        <button
          className={view === "zoomed" ? "active" : ""}
          onClick={() => setView("zoomed")}
        >
          Zoomed
        </button>
        <button
          className={view === "mid" ? "active" : ""}
          onClick={() => setView("mid")}
        >
          Mid
        </button>
        <button
          className={view === "full" ? "active" : ""}
          onClick={() => setView("full")}
        >
          Full
        </button>
      </div>
      <button onClick={onCopy}>📋 Copy from Yesterday</button>
      <button onClick={onReset}>🔄 Reset</button> {/* ✅ Use prop here */}
    </div>
  );
};

export default FormToolbar;
