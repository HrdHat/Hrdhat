import {
  ModuleData,
  ChecklistResponse,
  TaskHazardControl,
  FormAttachment,
  FormSignature,
} from "./modules";
import { ModuleErrorType } from "./moduleError";

// Field Types
export type FieldType =
  | "text"
  | "number"
  | "date"
  | "time"
  | "checkbox"
  | "select";

// Base Validation Rules
export interface ValidationRule<T = any> {
  pattern?: string;
  min?: number;
  max?: number;
  custom?: (value: T, formData?: Record<string, any>) => boolean;
  errorMessage?: string;
  dependencies?: string[]; // Field IDs this validation depends on
}

// Field Definition
export interface ModuleField<T = any> {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  validation?: ValidationRule<T>;
  defaultValue?: T;
  placeholder?: string;
  helpText?: string;
  options?: Array<{ label: string; value: string }>; // For select fields
  dependsOn?: string[]; // Field IDs this field depends on
  visibilityCondition?: (formData: Record<string, any>) => boolean;
}

// View Mode Configuration
export interface ViewModeConfig {
  print: boolean;
  guided: boolean;
  quickFill: boolean;
}

// Module Version
export interface ModuleVersion {
  major: number;
  minor: number;
  patch: number;
  timestamp: string;
}

// Module Metadata
export interface ModuleMetadata {
  author?: string;
  lastModified: string;
  version: ModuleVersion;
  tags?: string[];
  category?: string;
  customData?: Record<string, unknown>;
}

// Module Dependencies
export interface ModuleDependency {
  moduleId: string;
  required: boolean;
  condition?: (moduleData: ModuleData) => boolean;
}

// Base Module Interface
export interface BaseModule {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  order: number;
  fields: ModuleField[];
  dependencies?: ModuleDependency[];
  viewModes: ViewModeConfig;
  version: ModuleVersion;
  metadata: ModuleMetadata;
  validate?: (data: ModuleData) => ModuleErrorType[];
}

// Specific Module Types with their corresponding data types
export interface ChecklistModule extends BaseModule {
  type: "checklist";
  fields: ModuleField<boolean>[];
  validation: {
    minChecked?: number;
    maxChecked?: number;
    requireComments?: boolean;
  };
  data?: ChecklistResponse[];
}

export interface HazardControlModule extends BaseModule {
  type: "hazard_control";
  validation: {
    requireRiskAssessment: boolean;
    minControls?: number;
    maxRiskLevel?: number;
  };
  data?: TaskHazardControl[];
}

export interface AttachmentModule extends BaseModule {
  type: "attachment";
  validation: {
    allowedFileTypes: string[];
    maxFileSize: number;
    requireDescription: boolean;
  };
  data?: FormAttachment[];
}

export interface SignatureModule extends BaseModule {
  type: "signature";
  signatureTypes: Array<"worker" | "supervisor">;
  validation: {
    requireDate: boolean;
    requireName: boolean;
    requireTitle: boolean;
  };
  data?: FormSignature[];
}

// Custom Module Type Support
export interface CustomModule<T = any> extends BaseModule {
  type: string;
  customType: string;
  validation?: Record<string, any>;
  data?: T;
}

// Union type for all module types
export type Module =
  | ChecklistModule
  | HazardControlModule
  | AttachmentModule
  | SignatureModule
  | CustomModule;

// Module Configuration
export interface ModuleConfig {
  modules: Module[];
  defaultOrder: string[];
  requiredModules: string[];
  validation: {
    requireAllModules: boolean;
    customValidation?: (modules: Module[]) => ModuleErrorType[];
    dependencyValidation?: (modules: Module[]) => ModuleErrorType[];
  };
  metadata: ModuleMetadata;
}

// Module Operation Results
export interface ModuleOperationResult<T> {
  success: boolean;
  data?: T;
  errors?: ModuleErrorType[];
}

// Type Guards
export const isChecklistModule = (module: Module): module is ChecklistModule =>
  module.type === "checklist";

export const isHazardControlModule = (
  module: Module
): module is HazardControlModule => module.type === "hazard_control";

export const isAttachmentModule = (
  module: Module
): module is AttachmentModule => module.type === "attachment";

export const isSignatureModule = (module: Module): module is SignatureModule =>
  module.type === "signature";

export const isCustomModule = (module: Module): module is CustomModule =>
  !isChecklistModule(module) &&
  !isHazardControlModule(module) &&
  !isAttachmentModule(module) &&
  !isSignatureModule(module);

// Utility type for extracting module data type
export type ModuleDataType<T extends Module> = T extends ChecklistModule
  ? ChecklistResponse[]
  : T extends HazardControlModule
  ? TaskHazardControl[]
  : T extends AttachmentModule
  ? FormAttachment[]
  : T extends SignatureModule
  ? FormSignature[]
  : T extends CustomModule<infer D>
  ? D
  : never;
