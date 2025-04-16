import React from "react";
import "../styles/sidebar.css";

interface SidebarProps {
  visible: boolean;
  onCreate: () => void;
  onHome: () => void;
  onOpenActiveForms: () => void; // ✅ Add this
}

const Sidebar: React.FC<SidebarProps> = ({
  visible,
  onCreate,
  onHome,
  onOpenActiveForms,
}) => {
  return (
    <div className={`sidebar ${!visible ? "hidden" : ""}`}>
      <button onClick={onCreate}>➕ Create Form</button>
      <button className="sidebar-home-button" onClick={onHome}>
        🏠 Home
      </button>
      <button onClick={onOpenActiveForms}>📋 Active Forms</button>
    </div>
  );
};

export default Sidebar;
