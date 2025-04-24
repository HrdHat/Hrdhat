import { FLRADraft } from "./flrasessionmanager";
import { archiveService } from "../services/archive.service";
import { FLRASessionManager } from "./flrasessionmanager";

export type SubmissionStatus = "pending" | "completed" | "error";

export interface SubmissionResult {
  status: SubmissionStatus;
  message?: string;
  submittedAt: string;
  metadata?: {
    isPartialSubmission?: boolean;
    missingFields?: string[];
    submissionType: "as-is" | "validated";
  };
}

export const submitFormAsIs = async (
  draft: FLRADraft
): Promise<SubmissionResult> => {
  try {
    // Archive the form
    await archiveService.archiveForm(draft, "as-is");

    // Remove from active drafts
    FLRASessionManager.deleteDraft(draft.id);

    return {
      status: "completed",
      submittedAt: new Date().toISOString(),
      metadata: {
        isPartialSubmission: true,
        submissionType: "as-is",
      },
    };
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      status: "error",
      submittedAt: new Date().toISOString(),
      message: "Failed to submit form",
      metadata: {
        submissionType: "as-is",
      },
    };
  }
};

export const validateAndSubmitForm = async (
  draft: FLRADraft
): Promise<SubmissionResult> => {
  // TODO: Implement validation and submission logic
  // This is a placeholder
  return {
    status: "completed",
    submittedAt: new Date().toISOString(),
    metadata: {
      submissionType: "validated",
    },
  };
};
