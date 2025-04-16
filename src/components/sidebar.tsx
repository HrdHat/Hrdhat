import React from "react";
import "./sidebar.css";

interface SidebarProps {
  visible: boolean;
  onCreate: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ visible, onCreate }) => {
  return (
    <div className={`sidebar ${!visible ? "hidden" : ""}`}>
      <h2>Welcome to HrdHat</h2>
      <button onClick={onCreate}>Create Form</button>
    </div>
  );
};

export default Sidebar;
