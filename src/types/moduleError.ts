export type ModuleErrorCode =
  | "VALIDATION_ERROR"
  | "DEPENDENCY_ERROR"
  | "TYPE_ERROR"
  | "DATA_ERROR"
  | "CIRCULAR_DEPENDENCY"
  | "MISSING_REQUIRED_MODULE"
  | "INVALID_MODULE_STATE";

export interface ModuleError {
  code: ModuleErrorCode;
  message: string;
  field?: string;
  moduleId?: string;
  details?: unknown;
}

export interface ModuleValidationError extends ModuleError {
  code: "VALIDATION_ERROR";
  field: string;
  value?: unknown;
  constraint?: string;
}

export interface ModuleDependencyError extends ModuleError {
  code: "DEPENDENCY_ERROR" | "CIRCULAR_DEPENDENCY";
  dependencyChain: string[];
}

export type ModuleErrorType =
  | ModuleError
  | ModuleValidationError
  | ModuleDependencyError;
