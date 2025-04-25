export type ChecklistType = "pre_job" | "ppe" | "platform";

export interface ChecklistItem {
  id: string;
  question: string;
  isChecked: boolean;
}

export interface ChecklistResponse {
  id: string;
  form_id: string;
  checklist_type: ChecklistType;
  responses: {
    items: ChecklistItem[];
    completedAt: string | null;
  };
  created_at: string;
  updated_at: string;
}

export interface TaskHazardControl {
  id: string;
  form_id: string;
  task: string;
  hazard: string;
  hazard_risk: number;
  control: string;
  residual_risk: number;
  created_at: string;
  updated_at: string;
}

export interface FormAttachment {
  id: string;
  form_id: string;
  file_path: string;
  file_type: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface FormSignature {
  id: string;
  form_id: string;
  signer_name: string;
  signature_data: string;
  signature_type: "worker" | "supervisor";
  signed_at: string;
}

export interface ModuleData {
  checklist_responses: ChecklistResponse[];
  task_hazard_controls: TaskHazardControl[];
  form_attachments: FormAttachment[];
  form_signatures: FormSignature[];
}
