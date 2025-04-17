import React, { useState } from "react";
import GeneralInformation from "../modules/generalinformation";
import "../styles/modules.css";

const QuickFillMode: React.FC = () => {
  const [index, setIndex] = useState(0);

  const modules = [
    <GeneralInformation
      view="quickfill"
      draftId="DRAFT_PLACEHOLDER"
      key="general"
    />,
  ];

  return <>{modules[index]}</>;
};

export default QuickFillMode;
