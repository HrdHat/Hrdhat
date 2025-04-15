import { useState } from "react";
import GeneralInformation from "../components/generalinformation";
import FlraChecklist from "../components/flrachecklist";
import PPEPlatformInspection from "../components/ppeplatforminspection";
import THCModule from "../components/thcmodule";

const MidMode = () => {
  const [index, setIndex] = useState(0);

  const modules = [
    <GeneralInformation view="mid" key="general" />,
    <FlraChecklist view="mid" key="checklist" />,
    <PPEPlatformInspection view="mid" key="ppe" />,
    <THCModule view="mid" key="thc" />,
  ];

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

export default MidMode;
