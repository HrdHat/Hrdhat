import React from "react";
import { useLocation } from "react-router-dom";
import { ViewMode } from "../types/viewmode";

interface Props {
  viewMode?: ViewMode;
  draftId?: string;
}

const FlraFormPage: React.FC<Props> = ({ viewMode, draftId }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlView = params.get("view") as ViewMode;

  // You can still track viewMode here for future logic
  const currentView = viewMode || urlView || "guided";

  return <div className="form-page">{/* Future modules go here */}</div>;
};

export default FlraFormPage;
