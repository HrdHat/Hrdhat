import React from "react";
import { ViewMode } from "../types/viewmode";
import "./flraselectview.css";

interface Props {
  onSelect: (mode: ViewMode) => void;
}

const FlraSelectView: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="view-select-page">
      <h2>Select FLRA View Mode</h2>
      <p>Please choose how you'd like to fill out your FLRA:</p>

      <div className="view-buttons">
        <button onClick={() => onSelect("guided")}>
          🔍 Guided (One Field at a Time)
        </button>
        <button onClick={() => onSelect("quickfill")}>
          🧾 Quick Fill (All on One Page)
        </button>
        <button onClick={() => onSelect("printview")}>
          🖨️ Print View (PDF Layout)
        </button>
      </div>
    </div>
  );
};

export default FlraSelectView;
