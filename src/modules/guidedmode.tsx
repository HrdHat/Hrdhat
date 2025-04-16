import { useState } from "react";
import GeneralInformation from "../components/generalinformation";
import PPEPlatformInspection from "../components/ppeplatforminspection";
import THCModule from "../components/thcmodule";
import { ViewMode } from "../types/viewmode";
import "../styles/modules.css"; // ✅ new
const modules = [
  { id: "general", component: <GeneralInformation view="guided" /> },
];

const GuidedMode = () => {
  const [current, setCurrent] = useState(0);

  const goNext = () => {
    if (current < modules.length - 1) setCurrent(current + 1);
  };

  const goBack = () => {
    if (current > 0) setCurrent(current - 1);
  };

  return (
    <div className="form-carousel">
      {modules[current].component}
      <div className="zoomed-nav">
        <button onClick={goBack} disabled={current === 0}>
          ← Back
        </button>
        <button onClick={goNext} disabled={current === modules.length - 1}>
          Next →
        </button>
      </div>
    </div>
  );
};

export default GuidedMode;
