import { FLRADraft } from "../utils/flrasessionmanager";
import { GeneralInfoData } from "../types/generalInfo";
import { generalInfoFields } from "../data/formschema";

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

class ValidationService {
  private static instance: ValidationService;

  private constructor() {}

  static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  validateDraft(draft: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    // Type guard for basic structure
    if (!draft || typeof draft !== "object") {
      errors.push({
        field: "draft",
        message: "Invalid draft structure",
        code: "INVALID_STRUCTURE",
      });
      return { isValid: false, errors };
    }

    const draftObj = draft as Partial<FLRADraft>;

    // Required fields
    if (!draftObj.id) {
      errors.push({
        field: "id",
        message: "Draft ID is required",
        code: "REQUIRED_FIELD",
      });
    }

    if (!draftObj.title) {
      errors.push({
        field: "title",
        message: "Draft title is required",
        code: "REQUIRED_FIELD",
      });
    }

    // Timestamp validation
    if (!this.isValidISODate(draftObj.createdAt)) {
      errors.push({
        field: "createdAt",
        message: "Invalid creation timestamp",
        code: "INVALID_DATE",
      });
    }

    if (!this.isValidISODate(draftObj.updatedAt)) {
      errors.push({
        field: "updatedAt",
        message: "Invalid update timestamp",
        code: "INVALID_DATE",
      });
    }

    // Data structure validation
    if (!draftObj.data || typeof draftObj.data !== "object") {
      errors.push({
        field: "data",
        message: "Invalid data structure",
        code: "INVALID_STRUCTURE",
      });
    } else {
      // Validate general info if present
      if (draftObj.data.generalInfo) {
        const generalInfoErrors = this.validateGeneralInfo(
          draftObj.data.generalInfo
        );
        errors.push(...generalInfoErrors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validateGeneralInfo(data: unknown): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!data || typeof data !== "object") {
      errors.push({
        field: "generalInfo",
        message: "Invalid general info structure",
        code: "INVALID_STRUCTURE",
      });
      return errors;
    }

    const generalInfo = data as Partial<GeneralInfoData>;

    // Validate each field based on its type and requirements
    generalInfoFields.forEach((field) => {
      const value = generalInfo[field.name];

      // Check required fields (all fields are required in FLRA)
      if (!value || value.trim() === "") {
        errors.push({
          field: field.name,
          message: `${field.label} is required`,
          code: "REQUIRED_FIELD",
        });
        return;
      }

      switch (field.type) {
        case "date":
          if (!this.isValidDate(value)) {
            errors.push({
              field: field.name,
              message: `${field.label} must be a valid date`,
              code: "INVALID_DATE",
            });
          }
          break;

        case "time":
          if (!this.isValidTime(value)) {
            errors.push({
              field: field.name,
              message: `${field.label} must be a valid time`,
              code: "INVALID_TIME",
            });
          }
          break;

        case "text":
          switch (field.name) {
            case "projectName":
              if (value.length < 3 || value.length > 100) {
                errors.push({
                  field: field.name,
                  message: "Project name must be between 3 and 100 characters",
                  code: "INVALID_LENGTH",
                });
              }
              break;

            case "supervisorContact":
              if (!this.isValidPhoneNumber(value)) {
                errors.push({
                  field: field.name,
                  message: "Invalid phone number format",
                  code: "INVALID_PHONE",
                });
              }
              break;

            case "crewMembers":
              const crewCount = parseInt(value);
              if (isNaN(crewCount) || crewCount < 1 || crewCount > 100) {
                errors.push({
                  field: field.name,
                  message: "Crew members must be a number between 1 and 100",
                  code: "INVALID_NUMBER",
                });
              }
              break;

            case "todaysTask":
              if (value.length < 10 || value.length > 500) {
                errors.push({
                  field: field.name,
                  message:
                    "Task description must be between 10 and 500 characters",
                  code: "INVALID_LENGTH",
                });
              }
              break;

            default:
              // General text validation
              if (value.length < 2 || value.length > 100) {
                errors.push({
                  field: field.name,
                  message: `${field.label} must be between 2 and 100 characters`,
                  code: "INVALID_LENGTH",
                });
              }
          }
          break;
      }
    });

    // Cross-field validation
    if (generalInfo.startTime && generalInfo.endTime) {
      if (!this.isValidTimeRange(generalInfo.startTime, generalInfo.endTime)) {
        errors.push({
          field: "endTime",
          message: "End time must be after start time",
          code: "INVALID_TIME_RANGE",
        });
      }
    }

    if (generalInfo.todaysDate) {
      if (!this.isValidWorkDate(generalInfo.todaysDate)) {
        errors.push({
          field: "todaysDate",
          message:
            "Date must be within valid work range (not too far in past or future)",
          code: "INVALID_WORK_DATE",
        });
      }
    }

    return errors;
  }

  private isValidDate(dateStr: string): boolean {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date.getTime());
  }

  private isValidTime(timeStr: string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeStr);
  }

  private isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  }

  private isValidTimeRange(start: string, end: string): boolean {
    const startTime = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);
    return startTime < endTime;
  }

  private isValidWorkDate(dateStr: string): boolean {
    const date = new Date(dateStr);
    const now = new Date();
    const maxPast = new Date();
    maxPast.setDate(now.getDate() - 30); // Allow dates up to 30 days in the past
    const maxFuture = new Date();
    maxFuture.setDate(now.getDate() + 30); // Allow dates up to 30 days in the future

    return date >= maxPast && date <= maxFuture;
  }

  validateLocalStorageData(key: string, data: string): ValidationResult {
    try {
      const parsed = JSON.parse(data);

      switch (key) {
        case "flra_drafts":
          return this.validateDraftsStorage(parsed);
        case "flra_archive":
          return this.validateArchiveStorage(parsed);
        case "formState":
          return this.validateFormState(parsed);
        default:
          return { isValid: true, errors: [] };
      }
    } catch (error) {
      return {
        isValid: false,
        errors: [
          {
            field: key,
            message: "Corrupted storage data",
            code: "PARSE_ERROR",
          },
        ],
      };
    }
  }

  private validateDraftsStorage(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data || typeof data !== "object") {
      errors.push({
        field: "storage",
        message: "Invalid drafts storage structure",
        code: "INVALID_STRUCTURE",
      });
      return { isValid: false, errors };
    }

    // Validate each draft in storage
    Object.entries(data as Record<string, unknown>).forEach(([id, draft]) => {
      const draftValidation = this.validateDraft(draft);
      if (!draftValidation.isValid) {
        errors.push({
          field: `draft.${id}`,
          message: `Invalid draft: ${draftValidation.errors
            .map((e) => e.message)
            .join(", ")}`,
          code: "INVALID_DRAFT",
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private validateArchiveStorage(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (!Array.isArray(data)) {
      errors.push({
        field: "archive",
        message: "Archive must be an array",
        code: "INVALID_STRUCTURE",
      });
      return { isValid: false, errors };
    }

    // Validate each archived form
    data.forEach((form, index) => {
      const draftValidation = this.validateDraft(form);
      if (!draftValidation.isValid) {
        errors.push({
          field: `archive[${index}]`,
          message: `Invalid archived form: ${draftValidation.errors
            .map((e) => e.message)
            .join(", ")}`,
          code: "INVALID_ARCHIVED_FORM",
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private validateFormState(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data || typeof data !== "object") {
      errors.push({
        field: "formState",
        message: "Invalid form state structure",
        code: "INVALID_STRUCTURE",
      });
      return { isValid: false, errors };
    }

    // Add specific form state validations here
    // This will be expanded based on your form state requirements

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private isValidISODate(dateStr: string | undefined): boolean {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return (
      date instanceof Date &&
      !isNaN(date.getTime()) &&
      dateStr === date.toISOString()
    );
  }
}

export const validationService = ValidationService.getInstance();
