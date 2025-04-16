import React from "react";
import { ppeItems, platformItems } from "../data/formschema";
import "../styles/components.css";

const PPEPlatformInspection: React.FC = () => {
  return (
    <section className="module-box">
      <span className="module-label">PPE & Platform Inspection</span>
      <div className="ppe-platform-section">
        <div className="ppe-subheading">
          Personal Protective Equipment (PPE)
        </div>
        {ppeItems.map((item, index) => (
          <label key={`ppe-${index}`}>
            <input type="checkbox" /> {item}
          </label>
        ))}

        <div className="ppe-subheading">Equipment Platforms</div>
        {platformItems.map((item, index) => (
          <label key={`platform-${index}`}>
            <input type="checkbox" /> {item}
          </label>
        ))}
      </div>
    </section>
  );
};

export default PPEPlatformInspection;
