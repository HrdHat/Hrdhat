import React from "react";
import { useNavigate } from "react-router-dom";
import "./flraselectview.css"; // Optional if you want to style buttons

const FLRASelectView: React.FC = () => {
  const navigate = useNavigate();

  const handleSelect = (mode: "zoomed" | "mid" | "full") => {
    navigate(`/flra?view=${mode}`);
  };

  return (
    <div className="view-select-page">
      <h2>Select FLRA View Mode</h2>
      <p>Please choose how you'd like to fill out your FLRA:</p>

      <div className="view-buttons">
        <button onClick={() => handleSelect("zoomed")}>
          🔍 Zoomed-In View
        </button>
        <button onClick={() => handleSelect("mid")}>🧾 Mid View</button>
        <button onClick={() => handleSelect("full")}>🖨️ Full-Page View</button>
      </div>
    </div>
  );
};

export default FLRASelectView;
