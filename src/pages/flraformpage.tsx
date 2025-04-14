import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FormToolbar from "../components/formtoolbar";
import GeneralInformation from "../components/generalinformation";
import FlraChecklist from "../components/flrachecklist";
import PPEPlatformInspection from "../components/ppeplatforminspection";
import THCModule from "../components/thcmodule";
import MidViewNavigator from "../components/midviewnavigator"; // ✅ Add this!

type ViewMode = "zoomed" | "mid" | "full";

const FLRAFormPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewMode>("mid");

  const handleReset = () => {
    localStorage.removeItem("generalInfo");
    localStorage.removeItem("flraChecklist");
    localStorage.removeItem("ppeInspection");
    localStorage.removeItem("thcModule");
    window.location.reload(); // or use state reset in future
  };

  return (
    <div>
      <FormToolbar
        view={view}
        setView={setView}
        onBack={() => navigate("/")}
        onCopy={() => {
          console.log("Copying from yesterday...");
          // Placeholder for future logic
        }}
        onReset={handleReset}
      />

      {/* 🔄 Zoomed and Full View – All modules at once */}
      {(view === "zoomed" || view === "full") && (
        <div>
          <GeneralInformation view={view} />
          <FlraChecklist view={view} />
          <PPEPlatformInspection view={view} />
          <THCModule view={view} />
        </div>
      )}

      {/* 🔄 Mid View – One module at a time */}
      {view === "mid" && <MidViewNavigator />}
    </div>
  );
};

export default FLRAFormPage;
