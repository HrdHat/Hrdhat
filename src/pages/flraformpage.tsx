import React from "react";
import { useLocation } from "react-router-dom";
import GeneralInformation from "../components/generalinformation";

const FlraFormPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const viewParam = params.get("view");

  const viewMode =
    viewParam === "mid" || viewParam === "full" ? viewParam : "zoomed";

  return (
    <div className="form-page">
      <GeneralInformation view={viewMode} />
    </div>
  );
};

export default FlraFormPage;
