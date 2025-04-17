import React from "react";
import "../styles/paper.css"; // ✅ make sure this exists

const PaperContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="paper-container">{children}</div>;
};

export default PaperContainer;
