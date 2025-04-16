import { useState } from "react";
import GeneralInformation from "../components/generalinformation";
import FlraChecklist from "../components/flrachecklist";
import PPEPlatformInspection from "../components/ppeplatforminspection";
import THCModule from "../components/thcmodule";
import { ViewMode } from "../types/viewmode";

const modules = [
  { id: "general", component: <GeneralInformation view="guided" /> },
  { id: "checklist", component: <FlraChecklist view="guided" /> },
  { id: "ppe", component: <PPEPlatformInspection view="guided" /> },
  { id: "thc", component: <THCModule view="guided" /> },
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
