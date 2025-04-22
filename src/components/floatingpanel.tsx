import React from "react";
import "../styles/sidebar.css";
import "../styles/floatingpanel.css";

interface FloatingPanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  visible: boolean;
  className?: string; // NEW
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({
  title,
  onClose,
  children,
  visible,
  className = "",
}) => {
  return (
    <div className={`floating-panel ${visible ? "visible" : ""} ${className}`}>
      <div className="floating-panel-header">
        <h3>{title}</h3>
        <button className="floating-panel-close" onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="floating-panel-body">{children}</div>
    </div>
  );
};

export default FloatingPanel;
