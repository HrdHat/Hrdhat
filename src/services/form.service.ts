import { FLRADraft } from "../utils/flrasessionmanager";
import { errorService } from "./error.service";
import { stateConflictService } from "./conflict.service";
import { supabaseService } from "./supabase.service";

export interface FormOperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class FormService {
  private static instance: FormService;
  private static readonly STORAGE_KEY = "flra_forms";
  private static readonly MAX_RETRIES = 3;
  private isOnline: boolean = navigator.onLine;

  private constructor() {
    window.addEventListener("online", () =>
      this.handleConnectivityChange(true)
    );
    window.addEventListener("offline", () =>
      this.handleConnectivityChange(false)
    );
  }

  static getInstance(): FormService {
    if (!FormService.instance) {
      FormService.instance = new FormService();
    }
    return FormService.instance;
  }

  private async handleConnectivityChange(isOnline: boolean): Promise<void> {
    this.isOnline = isOnline;
    if (isOnline) {
      await this.syncWithSupabase();
    }
  }

  private async syncWithSupabase(): Promise<void> {
    try {
      const localForms = this.getStoredForms();
      for (const form of localForms) {
        await supabaseService.upsertForm(form);
      }
    } catch (error) {
      errorService.handleError(error, {
        type: "network",
        severity: "medium",
        operation: "FormService.syncWithSupabase",
        retry: true,
      });
    }
  }

  async createForm(draft: FLRADraft): Promise<FormOperationResult<FLRADraft>> {
    try {
      // Check for version conflicts
      const conflictCheck = await stateConflictService.checkVersion(
        draft.id,
        draft
      );
      if (!conflictCheck.resolved) {
        throw new Error(conflictCheck.error);
      }

      // Always save to local storage
      const forms = this.getStoredForms();
      forms.push(draft);
      localStorage.setItem(FormService.STORAGE_KEY, JSON.stringify(forms));

      // Try to save to Supabase if online
      if (this.isOnline) {
        const { error } = await supabaseService.upsertForm(draft);
        if (error) throw error;
      }

      return { success: true, data: draft };
    } catch (error) {
      errorService.handleError(error, {
        type: "storage",
        severity: "medium",
        operation: "FormService.createForm",
        retry: this.isOnline,
      });
      return { success: false, error: "Failed to create form" };
    }
  }

  async updateForm(draft: FLRADraft): Promise<FormOperationResult<FLRADraft>> {
    try {
      // Check for version conflicts
      const conflictCheck = await stateConflictService.checkVersion(
        draft.id,
        draft
      );
      if (!conflictCheck.resolved) {
        throw new Error(conflictCheck.error);
      }

      // Always update local storage
      const forms = this.getStoredForms();
      const index = forms.findIndex((f) => f.id === draft.id);
      if (index === -1) {
        throw new Error("Form not found");
      }
      forms[index] = draft;
      localStorage.setItem(FormService.STORAGE_KEY, JSON.stringify(forms));

      // Try to update Supabase if online
      if (this.isOnline) {
        const { error } = await supabaseService.upsertForm(draft);
        if (error) throw error;
      }

      return { success: true, data: draft };
    } catch (error) {
      errorService.handleError(error, {
        type: "storage",
        severity: "medium",
        operation: "FormService.updateForm",
        retry: this.isOnline,
      });
      return { success: false, error: "Failed to update form" };
    }
  }

  async deleteForm(id: string): Promise<FormOperationResult<void>> {
    try {
      // Always delete from local storage
      const forms = this.getStoredForms();
      const filteredForms = forms.filter((f) => f.id !== id);
      localStorage.setItem(
        FormService.STORAGE_KEY,
        JSON.stringify(filteredForms)
      );

      // Clear version history
      stateConflictService.clearVersion(id);

      // Try to delete from Supabase if online
      if (this.isOnline) {
        const { error } = await supabaseService.deleteForm(id);
        if (error) throw error;
      }

      return { success: true };
    } catch (error) {
      errorService.handleError(error, {
        type: "storage",
        severity: "medium",
        operation: "FormService.deleteForm",
        retry: this.isOnline,
      });
      return { success: false, error: "Failed to delete form" };
    }
  }

  async getForms(): Promise<FormOperationResult<FLRADraft[]>> {
    try {
      if (this.isOnline) {
        // Get forms from Supabase
        const { data, error } = await supabaseService.getForms();
        if (error) throw error;

        // Update local storage
        localStorage.setItem(FormService.STORAGE_KEY, JSON.stringify(data));
        return { success: true, data };
      } else {
        // Fallback to local storage
        const forms = this.getStoredForms();
        return { success: true, data: forms };
      }
    } catch (error) {
      errorService.handleError(error, {
        type: "storage",
        severity: "low",
        operation: "FormService.getForms",
      });
      return { success: false, error: "Failed to retrieve forms" };
    }
  }

  async getFormById(id: string): Promise<FormOperationResult<FLRADraft>> {
    try {
      if (this.isOnline) {
        // Get form from Supabase
        const { data, error } = await supabaseService.getFormById(id);
        if (error) throw error;
        if (!data) throw new Error("Form not found");
        return { success: true, data };
      } else {
        // Fallback to local storage
        const forms = this.getStoredForms();
        const form = forms.find((f) => f.id === id);
        if (!form) {
          throw new Error("Form not found");
        }
        return { success: true, data: form };
      }
    } catch (error) {
      errorService.handleError(error, {
        type: "storage",
        severity: "low",
        operation: "FormService.getFormById",
      });
      return { success: false, error: "Failed to retrieve form" };
    }
  }

  private getStoredForms(): FLRADraft[] {
    const stored = localStorage.getItem(FormService.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}

export const formService = FormService.getInstance();
