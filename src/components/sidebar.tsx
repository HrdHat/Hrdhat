import React from "react";
import "../styles/sidebar.css";
import "../styles/floatingpanel.css"; // styles for the floating panel
import HomeIcon from "../assets/homeicon.svg";
import CreateFormIcon from "../assets/newformicon.svg";
import ActiveFormsIcon from "../assets/activeformicon.svg";
import HistoryIcon from "../assets/historyicon.svg";
import { getSupabase } from "../utils/supabase.init";

interface SidebarProps {
  visible: boolean;
  onCreate: () => void;
  onHome: () => void;
  onOpenActiveForms: () => void;
  onOpenHistory: () => void;
  onToggle: () => void;
  className?: string; // ✅ new prop
}

const Sidebar: React.FC<SidebarProps> = ({
  visible,
  onCreate,
  onHome,
  onOpenActiveForms,
  onOpenHistory,
  onToggle,
  className, // ✅ Add this
}) => {
  const handleLogout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
      console.log("[Sidebar] User logged out");
      window.location.href = "/auth/login";
    }
  };

  return (
    <aside className={`sidebar ${!visible ? "hidden" : ""} ${className || ""}`}>
      <button
        style={{ width: "100%", marginBottom: 16 }}
        onClick={handleLogout}
      >
        Logout
      </button>
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
      </nav>
    </aside>
  );
};

export default Sidebar;
