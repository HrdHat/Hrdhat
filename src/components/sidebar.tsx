import React from "react";
import "../styles/sidebar.css";
import HomeIcon from "../assets/homeicon.svg";
import CreateFormIcon from "../assets/newformicon.svg";
import ActiveFormsIcon from "../assets/activeformicon.svg";

interface SidebarProps {
  visible: boolean;
  onCreate: () => void;
  onHome: () => void;
  onOpenActiveForms: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  visible,
  onCreate,
  onHome,
  onOpenActiveForms,
}) => {
  return (
    <aside className={`sidebar ${!visible ? "hidden" : ""}`}>
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
      </nav>
    </aside>
  );
};
export default Sidebar;
