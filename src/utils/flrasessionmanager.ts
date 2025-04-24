import { GeneralInfoData } from "../types/generalInfo";
import { validationService } from "../services/validation.service";

export interface FLRADraft {
  id: string;
  generalInfo: {
    title: string;
    userId: string;
    // Add other fields as needed
  };
  modules: Record<string, any>;
  status: "draft" | "submitted" | "archived";
  lastModified: string;
}

const STORAGE_KEY = "flra_drafts";

interface StorageError {
  type: "corruption" | "validation" | "system";
  message: string;
  details?: unknown;
}

export class FLRASessionManager {
  private static errors: StorageError[] = [];

  static getAllDrafts(): Record<string, FLRADraft> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};

      // Validate the entire storage
      const validation = validationService.validateLocalStorageData(
        STORAGE_KEY,
        raw
      );

      if (!validation.isValid) {
        // Log the validation errors
        this.errors.push({
          type: "validation",
          message: "Invalid drafts storage structure",
          details: validation.errors,
        });

        // Attempt to recover valid drafts
        const parsed = JSON.parse(raw);
        const cleanDrafts: Record<string, FLRADraft> = {};

        Object.entries(parsed).forEach(([id, draft]) => {
          const draftValidation = validationService.validateDraft(draft);
          if (draftValidation.isValid) {
            cleanDrafts[id] = draft as FLRADraft;
          } else {
            this.errors.push({
              type: "validation",
              message: `Invalid draft ${id}`,
              details: draftValidation.errors,
            });
          }
        });

        // Save the cleaned data back
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanDrafts));
        return cleanDrafts;
      }

      return JSON.parse(raw);
    } catch (error) {
      // Handle corrupted storage
      this.errors.push({
        type: "corruption",
        message: "Corrupted drafts storage",
        details: error,
      });

      // Reset storage in case of corruption
      localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
      return {};
    }
  }

  static listDrafts(): FLRADraft[] {
    const drafts = this.getAllDrafts();
    return Object.values(drafts).sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  static loadDraft(id: string): FLRADraft | null {
    try {
      const drafts = this.getAllDrafts();
      const draft = drafts[id];

      if (!draft) return null;

      // Validate the specific draft
      const validation = validationService.validateDraft(draft);
      if (!validation.isValid) {
        this.errors.push({
          type: "validation",
          message: `Invalid draft ${id}`,
          details: validation.errors,
        });
        return null;
      }

      return draft;
    } catch (error) {
      this.errors.push({
        type: "system",
        message: `Error loading draft ${id}`,
        details: error,
      });
      return null;
    }
  }

  static saveDraft(id: string, draft: FLRADraft): void {
    try {
      // Validate before saving
      const validation = validationService.validateDraft(draft);
      if (!validation.isValid) {
        this.errors.push({
          type: "validation",
          message: `Cannot save invalid draft ${id}`,
          details: validation.errors,
        });
        throw new Error(
          `Invalid draft data: ${validation.errors
            .map((e) => e.message)
            .join(", ")}`
        );
      }

      const drafts = this.getAllDrafts();
      drafts[id] = {
        ...draft,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    } catch (error) {
      this.errors.push({
        type: "system",
        message: `Error saving draft ${id}`,
        details: error,
      });
      throw error; // Re-throw to handle in UI
    }
  }

  static createNewDraft(title = "Untitled"): FLRADraft {
    const id = `draft_${Date.now()}`;
    const timestamp = new Date().toISOString();
    const draft: FLRADraft = {
      id,
      title,
      createdAt: timestamp,
      updatedAt: timestamp,
      data: {},
    };

    // Validate new draft
    const validation = validationService.validateDraft(draft);
    if (!validation.isValid) {
      this.errors.push({
        type: "validation",
        message: "Cannot create invalid draft",
        details: validation.errors,
      });
      throw new Error(
        `Invalid draft structure: ${validation.errors
          .map((e) => e.message)
          .join(", ")}`
      );
    }

    this.saveDraft(id, draft);
    return draft;
  }

  static deleteDraft(id: string): void {
    try {
      const drafts = this.getAllDrafts();
      delete drafts[id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    } catch (error) {
      this.errors.push({
        type: "system",
        message: `Error deleting draft ${id}`,
        details: error,
      });
      throw error; // Re-throw to handle in UI
    }
  }

  static clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      this.errors = []; // Clear error log on reset
    } catch (error) {
      this.errors.push({
        type: "system",
        message: "Error clearing all drafts",
        details: error,
      });
      throw error;
    }
  }

  static getErrors(): StorageError[] {
    return this.errors;
  }

  static clearErrors(): void {
    this.errors = [];
  }
}
