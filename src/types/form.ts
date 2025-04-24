import type { Module, ModuleConfig } from "./module";

interface FormData {
  [moduleId: string]: {
    [fieldId: string]: any;
  };
}

interface Form {
  id: string;
  type: string;
  status: "active" | "completed";
  modules: Module[];
  data: FormData;
  createdAt: Date;
  updatedAt: Date;
}

interface FormConfig {
  type: string;
  modules: ModuleConfig;
  validation: {
    requireAllFields?: boolean;
    customValidation?: (form: Form) => boolean;
  };
}

export type { FormData, Form, FormConfig };
