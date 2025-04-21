// src/components/floatingpanel.tsx

import React from "react";
import "../styles/sidebar.css"; // already includes floating-panel styles
import "../styles/floatingpanel.css"; // styles for the floating panel

interface FloatingPanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  visible: boolean;
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({
  title,
  onClose,
  children,
  visible,
}) => {
  return (
    <div className={`floating-panel ${visible ? "visible" : ""}`}>
      <div className="floating-panel-header">
        <button className="floating-panel-back" onClick={onClose}>
          ← Back
        </button>
        <h3>{title}</h3>
      </div>
      <div className="floating-panel-body">{children}</div>
    </div>
  );
};

export default FloatingPanel;
