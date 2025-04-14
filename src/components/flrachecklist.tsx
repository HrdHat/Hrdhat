// src/components/FlraChecklist.tsx
import React from "react";
import { flraChecklistQuestions } from "../data/formschema"; // Adjust the import path as necessary
import "./flrachecklist.css";

const FlraChecklist: React.FC = () => {
  return (
    <section className="module-box">
      <span className="module-label">FLRA Pre-Job/Task Checklist</span>
      <div className="checklist-grid">
        {flraChecklistQuestions.map((question, index) => (
          <label className="check-item" key={index}>
            <input type="checkbox" /> {question}
          </label>
        ))}
      </div>
    </section>
  );
};

export default FlraChecklist;
