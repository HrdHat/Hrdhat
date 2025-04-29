import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/sidebar.css";
import "../styles/floatingpanel.css"; // styles for the floating panel
import HomeIcon from "../assets/homeicon.svg";
import CreateFormIcon from "../assets/newformicon.svg";
import ActiveFormsIcon from "../assets/activeformicon.svg";
import HistoryIcon from "../assets/historyicon.svg";
import SettingsIcon from "../assets/settingsicon.svg";

interface SidebarProps {
  visible: boolean;
  onCreate: () => void;
  onHome: () => void;
  onOpenActiveForms: () => void;
  onOpenHistory: () => void;
  onSettings: () => void;
  onToggle: () => void;
  className?: string; // ✅ new prop
}

const Sidebar: React.FC<SidebarProps> = ({
  visible,
  onCreate,
  onHome,
  onOpenActiveForms,
  onOpenHistory,
  onSettings,
  onToggle,
  className, // ✅ Add this
}) => {
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className={`sidebar ${!visible ? "hidden" : ""} ${className || ""}`}>
      <button className="sidebar-close-btn" onClick={onToggle}>
        ✕
      </button>
      <nav>
        <div className="nav-item" onClick={onCreate}>
          <img src={CreateFormIcon} alt="Create Form" className="nav-icon" />
          <span>Create Form</span>
        </div>
        <div className="nav-item" onClick={onHome}>
          <img src={HomeIcon} alt="Home" className="nav-icon" />
          <span>Home</span>
        </div>
        <div className="nav-item" onClick={onOpenActiveForms}>
          <img src={ActiveFormsIcon} alt="Active Forms" className="nav-icon" />
          <span>Active Forms</span>
        </div>
        <div className="nav-item" onClick={onOpenHistory}>
          <img src={HistoryIcon} alt="History" className="nav-icon" />
          <span>History</span>
        </div>
        <div className="nav-item" onClick={onSettings}>
          <img src={SettingsIcon} alt="Settings" className="nav-icon" />
          <span>Settings</span>
        </div>
      </nav>
      <div className="sidebar-bottom">
        <button
          onClick={() => signOut()}
          className="sidebar-item logout-button"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
