import { useState } from "react";
import GeneralInformation from "./generalinformation";
import FlraChecklist from "./flrachecklist";
import PPEPlatformInspection from "./ppeplatforminspection";
import THCModule from "./thcmodule";

const MidViewNavigator = () => {
  const [index, setIndex] = useState(0);

  const modules = [
    <GeneralInformation view="mid" />,
    <FlraChecklist view="mid" />,
    <PPEPlatformInspection view="mid" />,
    <THCModule view="mid" />,
  ];

  return (
    <div className="form-carousel">
      {modules[index]}

      <div
        className="carousel-controls"
        style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}
      >
        <button
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
          disabled={index === 0}
        >
          ← Prev
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
export default MidViewNavigator;
