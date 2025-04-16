import { useState } from "react";
import GeneralInformation from "../components/generalinformation";

import PPEPlatformInspection from "../components/ppeplatforminspection";
import THCModule from "../components/thcmodule";
import { ViewMode } from "../types/viewmode";
import "../styles/modules.css"; // ✅ new
const QuickFillMode = () => {
  const [index, setIndex] = useState(0);

  const modules = [<GeneralInformation view="quickfill" key="general" />];

  return (
    <div className="form-carousel">
      {modules[index]}

      <div
        className="carousel-controls"
        style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}
      >
        <button
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
          disabled={index === 0}
        >
          ← Back
        </button>
        <button
          onClick={() => setIndex((i) => Math.min(i + 1, modules.length - 1))}
          disabled={index === modules.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default QuickFillMode;
