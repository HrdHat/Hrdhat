import React, { useState } from "react";
import GeneralInformation from "../modules/generalinformation";
import { ViewMode } from "../types/viewmode";
import { generalInfoFields } from "../data/formschema";
import "../styles/modules.css";

interface GuidedModeProps {
  draftId: string;
}

const GuidedMode: React.FC<GuidedModeProps> = ({ draftId }) => {
  const [current, setCurrent] = useState(0);
  const [fieldIndex, setFieldIndex] = useState(0);

  const modules = [
    {
      id: "general",
      component: (
        <GeneralInformation
          view="guided"
          draftId={draftId}
          fieldIndex={fieldIndex}
          setFieldIndex={setFieldIndex}
        />
      ),
    },
    // Future modules like Checklist, PPE, etc. go here
  ];

  const goNext = () => {
    if (fieldIndex < generalInfoFields.length - 1) {
      setFieldIndex((prev) => prev + 1);
    } else if (current < modules.length - 1) {
      setCurrent(current + 1);
      setFieldIndex(0);
    }
  };

  const goBack = () => {
    if (fieldIndex > 0) {
      setFieldIndex((prev) => prev - 1);
    } else if (current > 0) {
      setCurrent(current - 1);
      // Later: set fieldIndex to last field in previous module
    }
  };

  return <>{modules[current].component}</>;
};

export default GuidedMode;
