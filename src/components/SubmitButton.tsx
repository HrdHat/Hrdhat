import React, { useState } from "react";
import { FLRADraft } from "../utils/flrasessionmanager";
import { submitFormAsIs, SubmissionStatus } from "../utils/formsubmission";
import "../styles/submitbutton.css";

interface SubmitButtonProps {
  draft: FLRADraft;
  onSubmitComplete?: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  draft,
  onSubmitComplete,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmissionStatus>("pending");

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const result = await submitFormAsIs(draft);
      setStatus(result.status);
      if (result.status === "completed" && onSubmitComplete) {
        onSubmitComplete();
      }
    } catch (error) {
      setStatus("error");
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <button
      className={`submit-button ${submitting ? "submitting" : ""} ${status}`}
      onClick={handleSubmit}
      disabled={submitting}
    >
      {submitting ? "..." : "✓"}
    </button>
  );
};

export default SubmitButton;
