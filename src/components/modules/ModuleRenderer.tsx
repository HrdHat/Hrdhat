import React, { useEffect, useState } from "react";
import type { Module, ModuleField } from "../../types/module";
import { ViewMode } from "../../types/viewmode";
import { moduleService } from "../../services/module.service";
import { FormErrorBoundary } from "../ErrorBoundary";
import type {
  ChecklistResponse,
  TaskHazardControl,
  FormAttachment,
  FormSignature,
  ModuleData,
} from "../../types/modules";
import "./ModuleRenderer.css";

// Extend Module type to include type property
interface ExtendedModule extends Module {
  type: "checklist" | "hazard_control" | "attachment" | "signature";
}

interface ModuleRendererProps {
  module: ExtendedModule;
  formId: string;
  viewMode: ViewMode;
  onModuleStateChange?: (moduleId: string, isValid: boolean) => void;
  onModuleDataChange?: (moduleId: string, fieldId: string, value: any) => void;
}

interface ModuleFieldProps {
  field: ModuleField;
  value: any;
  onChange: (value: any) => void;
  viewMode: ViewMode;
  disabled?: boolean;
  error?: string;
}

interface ModuleErrorFallbackProps {
  error: Error;
  moduleId: string;
}

interface ErrorBoundaryFallbackProps {
  error: Error;
}

const ModuleField: React.FC<ModuleFieldProps> = ({
  field,
  value,
  onChange,
  viewMode,
  disabled,
  error,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newValue =
      field.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    onChange(newValue);
  };

  switch (field.type) {
    case "text":
      return (
        <input
          type="text"
          value={value || ""}
          onChange={handleChange}
          placeholder={field.label}
          disabled={disabled || viewMode === "printview"}
          className={`module-field ${error ? "has-error" : ""}`}
        />
      );
    case "number":
      return (
        <input
          type="number"
          value={value || ""}
          onChange={handleChange}
          placeholder={field.label}
          disabled={disabled || viewMode === "printview"}
          className={`module-field ${error ? "has-error" : ""}`}
        />
      );
    case "date":
      return (
        <input
          type="date"
          value={value || ""}
          onChange={handleChange}
          disabled={disabled || viewMode === "printview"}
          className={`module-field ${error ? "has-error" : ""}`}
        />
      );
    case "time":
      return (
        <input
          type="time"
          value={value || ""}
          onChange={handleChange}
          disabled={disabled || viewMode === "printview"}
          className={`module-field ${error ? "has-error" : ""}`}
        />
      );
    case "checkbox":
      return (
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={value || false}
            onChange={handleChange}
            disabled={disabled || viewMode === "printview"}
            className={error ? "has-error" : ""}
          />
          <span>{field.label}</span>
        </label>
      );
    case "select":
      return (
        <select
          value={value || ""}
          onChange={handleChange}
          disabled={disabled || viewMode === "printview"}
          className={`module-field ${error ? "has-error" : ""}`}
        >
          <option value="">Select {field.label}</option>
          {/* TODO: Add options from field configuration */}
        </select>
      );
    default:
      return <div>Unsupported field type: {field.type}</div>;
  }
};

const ModuleErrorFallback: React.FC<ModuleErrorFallbackProps> = ({
  error,
  moduleId,
}) => (
  <div className="module-error">
    <h3>Error in module {moduleId}</h3>
    <p>{error.message}</p>
    <button onClick={() => window.location.reload()}>Reload</button>
  </div>
);

export const ModuleRenderer: React.FC<ModuleRendererProps> = ({
  module,
  formId,
  viewMode,
  onModuleStateChange,
  onModuleDataChange,
}) => {
  const [moduleState, setModuleState] = useState(() =>
    moduleService.getModuleState(module.id)
  );
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadModuleData();
  }, [module.id, formId]);

  const loadModuleData = async () => {
    try {
      setIsLoading(true);
      // Validate module dependencies if any
      if (module.dependencies?.length) {
        // Since validateModuleDependencies is private, we'll use the public validateModule method
        const validationResult = await moduleService.validateModule(module);
        if (!validationResult.success) {
          throw new Error(validationResult.error);
        }
      }

      // Load module data
      const moduleData = await moduleService.getAllModuleData(formId);
      const values: Record<string, any> = {};

      // Map module data to fields based on module type
      module.fields.forEach((field) => {
        switch (module.type) {
          case "checklist":
            values[field.id] =
              moduleData.checklist_responses.find((r) => r.id === field.id)
                ?.responses.items[0]?.isChecked || false;
            break;
          case "hazard_control":
            values[field.id] = moduleData.task_hazard_controls.find(
              (c) => c.id === field.id
            )?.[field.id as keyof TaskHazardControl];
            break;
          case "attachment":
            values[field.id] = moduleData.form_attachments.find(
              (a) => a.id === field.id
            )?.[field.id as keyof FormAttachment];
            break;
          case "signature":
            values[field.id] = moduleData.form_signatures.find(
              (s) => s.id === field.id
            )?.[field.id as keyof FormSignature];
            break;
          default:
            values[field.id] = null;
        }
      });

      setFieldValues(values);
      validateFields(values);
    } catch (error) {
      console.error("Error loading module data:", error);
      moduleService.setModuleValidationErrors(module.id, [
        (error as Error).message,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const validateFields = (values: Record<string, any>) => {
    const errors: Record<string, string> = {};
    let isValid = true;

    module.fields.forEach((field) => {
      const value = values[field.id];

      // Check required fields
      if (
        field.required &&
        (value === undefined || value === "" || value === null)
      ) {
        errors[field.id] = `${field.label} is required`;
        isValid = false;
      }

      // Check validation rules
      if (field.validation && value !== undefined && value !== "") {
        if (field.validation.pattern) {
          const regex = new RegExp(field.validation.pattern);
          if (!regex.test(String(value))) {
            errors[field.id] = `${field.label} has invalid format`;
            isValid = false;
          }
        }

        if (
          field.validation.min !== undefined &&
          Number(value) < field.validation.min
        ) {
          errors[
            field.id
          ] = `${field.label} must be at least ${field.validation.min}`;
          isValid = false;
        }

        if (
          field.validation.max !== undefined &&
          Number(value) > field.validation.max
        ) {
          errors[
            field.id
          ] = `${field.label} must be at most ${field.validation.max}`;
          isValid = false;
        }

        if (field.validation.custom && !field.validation.custom(value)) {
          errors[field.id] = `${field.label} is invalid`;
          isValid = false;
        }
      }
    });

    setFieldErrors(errors);
    moduleService.setModuleValidationErrors(module.id, Object.values(errors));
    onModuleStateChange?.(module.id, isValid);
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    const newValues = { ...fieldValues, [fieldId]: value };
    setFieldValues(newValues);
    validateFields(newValues);
    onModuleDataChange?.(module.id, fieldId, value);
    moduleService.markModuleDirty(module.id, true);
  };

  if (
    !module.viewModes?.[viewMode.toLowerCase() as keyof typeof module.viewModes]
  ) {
    return null; // Don't render if module is not enabled for current view mode
  }

  if (isLoading) {
    return (
      <div className="module-loading">
        <span>Loading {module.name}...</span>
      </div>
    );
  }

  return (
    <FormErrorBoundary
      fallback={
        <div className="module-error">
          <h3>Error in module {module.id}</h3>
          <p>{/* Error message will be provided by FormErrorBoundary */}</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      }
    >
      <div
        className={`module-container ${moduleState.isDirty ? "is-dirty" : ""}`}
      >
        <div className="module-header">
          <h3>{module.name}</h3>
          {moduleState.isDirty && <span className="dirty-indicator">*</span>}
        </div>

        <div className="module-content">
          {module.fields.map((field) => (
            <div key={field.id} className="field-container">
              {field.type !== "checkbox" && (
                <label htmlFor={field.id}>{field.label}</label>
              )}
              <ModuleField
                field={field}
                value={fieldValues[field.id]}
                onChange={(value) => handleFieldChange(field.id, value)}
                viewMode={viewMode}
                disabled={!moduleState.isValid}
                error={fieldErrors[field.id]}
              />
              {fieldErrors[field.id] && (
                <span className="field-error">{fieldErrors[field.id]}</span>
              )}
            </div>
          ))}
        </div>

        {!moduleState.isValid && moduleState.validationErrors.length > 0 && (
          <div className="module-errors">
            <ul>
              {moduleState.validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </FormErrorBoundary>
  );
};
