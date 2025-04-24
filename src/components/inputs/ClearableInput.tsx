import React, { useState, useEffect } from "react";
import { FormStateManager } from "../../state/formState";
import "./ClearableInput.css";

interface ClearableInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  className?: string;
  viewMode?: "guided" | "quick" | "print";
  onClear?: () => void;
  moduleId: string;
  fieldId: string;
  formId?: string;
}

export const ClearableInput: React.FC<ClearableInputProps> = ({
  value,
  onChange,
  placeholder = "",
  required = false,
  type = "text",
  className = "",
  viewMode = "quick",
  onClear,
  moduleId,
  fieldId,
  formId,
}) => {
  const [showClearButton, setShowClearButton] = useState(false);
  const formManager = FormStateManager.getInstance();

  useEffect(() => {
    setShowClearButton(Boolean(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Auto-save if formId is provided
    if (formId) {
      const currentForm = formManager.getCurrentForm();
      if (currentForm && currentForm.id === formId) {
        const updatedForm = {
          ...currentForm,
          data: {
            ...currentForm.data,
            [moduleId]: {
              ...currentForm.data[moduleId],
              [fieldId]: newValue,
            },
          },
          updatedAt: new Date(),
        };
        formManager.updateForm(updatedForm);
      }
    }
  };

  const handleClear = () => {
    onChange("");
    if (onClear) {
      onClear();
    }

    // Auto-save clear if formId is provided
    if (formId) {
      const currentForm = formManager.getCurrentForm();
      if (currentForm && currentForm.id === formId) {
        const updatedForm = {
          ...currentForm,
          data: {
            ...currentForm.data,
            [moduleId]: {
              ...currentForm.data[moduleId],
              [fieldId]: "",
            },
          },
          updatedAt: new Date(),
        };
        formManager.updateForm(updatedForm);
      }
    }
  };

  const inputClasses = [
    "field-input",
    showClearButton ? "has-clear-button" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="clearable-input-container">
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className={inputClasses}
      />
      {showClearButton && viewMode !== "print" && (
        <button
          type="button"
          className="clear-button"
          onClick={handleClear}
          aria-label="Clear input"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ClearableInput;
