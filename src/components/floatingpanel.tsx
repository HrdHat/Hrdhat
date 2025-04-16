import React from "react";
import "../styles/sidebar.css";

interface FloatingPanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({
  title,
  onClose,
  children,
}) => {
  return (
    <div className="floating-panel">
      <div className="floating-panel-header">
        <h3>{title}</h3>
        <button className="floating-panel-close" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="floating-panel-body">{children}</div>
    </div>
  );
};

export default FloatingPanel;
