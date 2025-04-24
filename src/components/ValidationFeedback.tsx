import React, { useEffect, useState } from "react";
import { ValidationError } from "../services/validation.service";
import { errorService, AppError } from "../services/error.service";
import "../styles/validationfeedback.css";

interface Props {
  fieldName?: string; // If provided, only show errors for this field
  showAll?: boolean; // If true, show all validation errors
}

export const ValidationFeedback: React.FC<Props> = ({
  fieldName,
  showAll = false,
}) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [systemErrors, setSystemErrors] = useState<AppError[]>([]);

  useEffect(() => {
    // Listen for app-level errors
    const handleAppError = (event: CustomEvent<AppError>) => {
      const error = event.detail;
      if (error.type === "validation" || showAll) {
        setSystemErrors((prev) => [...prev, error]);
      }
    };

    window.addEventListener("app-error", handleAppError as EventListener);
    return () => {
      window.removeEventListener("app-error", handleAppError as EventListener);
    };
  }, [showAll]);

  useEffect(() => {
    // Clear system errors after 5 seconds unless they're critical
    const timeout = setTimeout(() => {
      setSystemErrors((prev) =>
        prev.filter((error) => error.severity === "critical")
      );
    }, 5000);

    return () => clearTimeout(timeout);
  }, [systemErrors]);

  const filteredErrors = fieldName
    ? errors.filter((error) => error.field === fieldName)
    : errors;

  if (
    (!filteredErrors.length && !systemErrors.length) ||
    (!showAll && !fieldName)
  ) {
    return null;
  }

  return (
    <div className="validation-feedback">
      {/* Field-level validation errors */}
      {filteredErrors.length > 0 && (
        <div className="validation-errors">
          {filteredErrors.map((error, index) => (
            <div key={index} className="validation-error">
              <span className="error-icon">⚠️</span>
              <span className="error-message">{error.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* System-level errors */}
      {showAll && systemErrors.length > 0 && (
        <div className="system-errors">
          {systemErrors.map((error) => (
            <div
              key={error.id}
              className={`system-error ${error.severity}`}
              onClick={() => errorService.clearError(error.id)}
            >
              <div className="error-header">
                <span className="error-type">{error.type}</span>
                <span className="error-severity">{error.severity}</span>
              </div>
              <p className="error-message">{error.message}</p>
              {error.retryCount > 0 && (
                <small className="retry-count">
                  Retry attempt: {error.retryCount}
                </small>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
