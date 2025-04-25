import { supabaseService } from "./supabase.service";
import { errorService } from "./error.service";
import type {
  ChecklistResponse,
  TaskHazardControl,
  FormAttachment,
  FormSignature,
  ModuleData,
  ChecklistType,
  ChecklistItem,
} from "../types/modules";
import { AppError } from "../services/error.service";
import { UserModule, ModuleOperationResult } from "../types/userModule";
import type { Module, ModuleField } from "../types/module";

interface ModuleState {
  isValid: boolean;
  isDirty: boolean;
  lastSyncedAt: string | null;
  validationErrors: string[];
}

export class ModuleService {
  private static instance: ModuleService;
  private readonly STORAGE_KEY = "flra_module_responses";
  private readonly MODULE_STATE_KEY = "flra_module_states";
  private moduleStates: Map<string, ModuleState> = new Map();

  private constructor() {
    this.initializeStorage();
    this.initializeModuleStates();
  }

  static getInstance(): ModuleService {
    if (!ModuleService.instance) {
      ModuleService.instance = new ModuleService();
    }
    return ModuleService.instance;
  }

  private initializeStorage() {
    const storage = localStorage.getItem(this.STORAGE_KEY);
    if (!storage) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({}));
    }
  }

  private initializeModuleStates() {
    const states = localStorage.getItem(this.MODULE_STATE_KEY);
    if (states) {
      const parsedStates = JSON.parse(states);
      Object.entries(parsedStates).forEach(([key, value]) => {
        this.moduleStates.set(key, value as ModuleState);
      });
    }
  }

  private saveModuleStates() {
    const states = Object.fromEntries(this.moduleStates.entries());
    localStorage.setItem(this.MODULE_STATE_KEY, JSON.stringify(states));
  }

  // Module Validation Methods
  async validateModule(module: Module): Promise<ModuleOperationResult<void>> {
    try {
      // Validate basic module structure
      if (!module.id || !module.name || !Array.isArray(module.fields)) {
        return {
          success: false,
          error: "Invalid module structure",
        };
      }

      // Validate fields
      for (const field of module.fields) {
        const fieldValidation = this.validateModuleField(field);
        if (!fieldValidation.success) {
          return fieldValidation;
        }
      }

      // Validate dependencies if they exist
      if (module.dependencies?.length) {
        const dependencyValidation = await this.validateModuleDependencies(
          module.dependencies
        );
        if (!dependencyValidation.success) {
          return dependencyValidation;
        }
      }

      return { success: true };
    } catch (error) {
      const appError: AppError = {
        type: "system",
        severity: "medium",
        operation: "ModuleService.validateModule",
        retry: false,
      };
      errorService.handleError("Failed to validate module", appError);
      return {
        success: false,
        error: "Module validation failed",
      };
    }
  }

  private validateModuleField(field: ModuleField): ModuleOperationResult<void> {
    // Validate required field properties
    if (!field.id || !field.type || !field.label) {
      return {
        success: false,
        error: `Invalid field structure: ${field.id || "unknown field"}`,
      };
    }

    // Validate field type
    const validTypes = ["text", "number", "date", "time", "checkbox", "select"];
    if (!validTypes.includes(field.type)) {
      return {
        success: false,
        error: `Invalid field type: ${field.type}`,
      };
    }

    // Validate field validation rules if they exist
    if (field.validation) {
      if (
        field.validation.min !== undefined &&
        typeof field.validation.min !== "number"
      ) {
        return {
          success: false,
          error: "Invalid min validation value",
        };
      }
      if (
        field.validation.max !== undefined &&
        typeof field.validation.max !== "number"
      ) {
        return {
          success: false,
          error: "Invalid max validation value",
        };
      }
    }

    return { success: true };
  }

  private async validateModuleDependencies(
    dependencies: string[]
  ): Promise<ModuleOperationResult<void>> {
    try {
      const supabase = supabaseService.getClient();
      if (!supabase) {
        return {
          success: false,
          error: "Cannot validate dependencies: Supabase client not available",
        };
      }

      // Check if all dependent modules exist
      const { data: modules, error } = await supabase
        .from("form_modules")
        .select("module_type")
        .in("module_type", dependencies);

      if (error) throw error;

      const foundDependencies = new Set(modules?.map((m) => m.module_type));
      const missingDependencies = dependencies.filter(
        (dep) => !foundDependencies.has(dep)
      );

      if (missingDependencies.length > 0) {
        return {
          success: false,
          error: `Missing required dependencies: ${missingDependencies.join(
            ", "
          )}`,
        };
      }

      return { success: true };
    } catch (error) {
      const appError: AppError = {
        type: "system",
        severity: "medium",
        operation: "ModuleService.validateModuleDependencies",
        retry: true,
      };
      errorService.handleError(
        "Failed to validate module dependencies",
        appError
      );
      return {
        success: false,
        error: "Failed to validate module dependencies",
      };
    }
  }

  // Module State Management
  getModuleState(moduleId: string): ModuleState {
    return (
      this.moduleStates.get(moduleId) || {
        isValid: true,
        isDirty: false,
        lastSyncedAt: null,
        validationErrors: [],
      }
    );
  }

  updateModuleState(
    moduleId: string,
    updates: Partial<ModuleState>
  ): ModuleState {
    const currentState = this.getModuleState(moduleId);
    const newState = { ...currentState, ...updates };
    this.moduleStates.set(moduleId, newState);
    this.saveModuleStates();
    return newState;
  }

  markModuleDirty(moduleId: string, isDirty: boolean = true): void {
    this.updateModuleState(moduleId, {
      isDirty,
      lastSyncedAt: isDirty ? null : new Date().toISOString(),
    });
  }

  setModuleValidationErrors(moduleId: string, errors: string[]): void {
    this.updateModuleState(moduleId, {
      isValid: errors.length === 0,
      validationErrors: errors,
    });
  }

  // Checklist Responses
  async getTypedChecklistResponses(
    formId: string,
    type: ChecklistType
  ): Promise<ChecklistResponse[]> {
    try {
      const storage = localStorage.getItem(this.STORAGE_KEY);
      if (!storage) {
        return [];
      }
      const parsedStorage = JSON.parse(storage) as Record<
        string,
        ChecklistResponse[]
      >;
      const key = `${formId}_${type}`;
      return parsedStorage[key] || [];
    } catch (error) {
      const appError: AppError = {
        type: "system",
        severity: "medium",
        operation: "getTypedChecklistResponses",
        retry: false,
      };
      errorService.handleError(
        "Failed to get typed checklist responses",
        appError
      );
      return [];
    }
  }

  async saveTypedChecklistResponses(response: {
    form_id: string;
    checklist_type: ChecklistType;
    responses: {
      items: Array<ChecklistItem>;
      completedAt: string | null;
    };
  }): Promise<ModuleOperationResult<void>> {
    try {
      const storage = localStorage.getItem(this.STORAGE_KEY);
      if (!storage) {
        return { success: false, error: "Storage not initialized" };
      }
      const parsedStorage = JSON.parse(storage) as Record<
        string,
        ChecklistResponse[]
      >;
      const key = `${response.form_id}_${response.checklist_type}`;

      parsedStorage[key] = [
        {
          id: key,
          form_id: response.form_id,
          checklist_type: response.checklist_type,
          responses: response.responses,
          created_at:
            parsedStorage[key]?.[0]?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(parsedStorage));
      return { success: true };
    } catch (error) {
      const appError: AppError = {
        type: "system",
        severity: "medium",
        operation: "saveTypedChecklistResponses",
        retry: false,
      };
      errorService.handleError(
        "Failed to save typed checklist responses",
        appError
      );
      return { success: false, error: "Failed to save checklist responses" };
    }
  }

  // Task Hazard Controls
  async getTaskHazardControls(formId: string): Promise<TaskHazardControl[]> {
    try {
      const supabase = supabaseService.getClient();
      if (!supabase) {
        return [];
      }

      const { data, error } = await supabase
        .from("task_hazard_controls")
        .select("*")
        .eq("form_id", formId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      const appError: AppError = {
        type: "system",
        severity: "medium",
        operation: "ModuleService.getTaskHazardControls",
        retry: true,
      };
      errorService.handleError("Failed to get task hazard controls", appError);
      throw error;
    }
  }

  async saveTaskHazardControl(
    control: Omit<TaskHazardControl, "id" | "created_at" | "updated_at">
  ): Promise<void> {
    try {
      const supabase = supabaseService.getClient();
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      const { error } = await supabase
        .from("task_hazard_controls")
        .upsert(control);

      if (error) throw error;
    } catch (error) {
      const appError: AppError = {
        type: "system",
        severity: "high",
        operation: "ModuleService.saveTaskHazardControl",
        retry: true,
      };
      errorService.handleError("Failed to save task hazard control", appError);
      throw error;
    }
  }

  // Form Attachments
  async getFormAttachments(formId: string): Promise<FormAttachment[]> {
    try {
      const supabase = supabaseService.getClient();
      if (!supabase) {
        return [];
      }

      const { data, error } = await supabase
        .from("form_attachments")
        .select("*")
        .eq("form_id", formId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      const appError: AppError = {
        type: "system",
        severity: "medium",
        operation: "ModuleService.getFormAttachments",
        retry: true,
      };
      errorService.handleError("Failed to get form attachments", appError);
      throw error;
    }
  }

  async saveFormAttachment(
    attachment: Omit<FormAttachment, "id" | "created_at" | "updated_at">
  ): Promise<void> {
    try {
      const supabase = supabaseService.getClient();
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      const { error } = await supabase
        .from("form_attachments")
        .upsert(attachment);

      if (error) throw error;
    } catch (error) {
      const appError: AppError = {
        type: "system",
        severity: "high",
        operation: "ModuleService.saveFormAttachment",
        retry: true,
      };
      errorService.handleError("Failed to save form attachment", appError);
      throw error;
    }
  }

  // Form Signatures
  async getFormSignatures(formId: string): Promise<FormSignature[]> {
    try {
      const supabase = supabaseService.getClient();
      if (!supabase) {
        return [];
      }

      const { data, error } = await supabase
        .from("form_signatures")
        .select("*")
        .eq("form_id", formId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      const appError: AppError = {
        type: "system",
        severity: "medium",
        operation: "ModuleService.getFormSignatures",
        retry: true,
      };
      errorService.handleError("Failed to get form signatures", appError);
      throw error;
    }
  }

  async saveFormSignature(
    signature: Omit<FormSignature, "id" | "created_at" | "updated_at">
  ): Promise<void> {
    try {
      const supabase = supabaseService.getClient();
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      const { error } = await supabase
        .from("form_signatures")
        .upsert(signature);

      if (error) throw error;
    } catch (error) {
      const appError: AppError = {
        type: "system",
        severity: "high",
        operation: "ModuleService.saveFormSignature",
        retry: true,
      };
      errorService.handleError("Failed to save form signature", appError);
      throw error;
    }
  }

  // Get all module data for a form
  async getAllModuleData(formId: string): Promise<ModuleData> {
    try {
      const [
        checklistResponses,
        taskHazardControls,
        formAttachments,
        formSignatures,
      ] = await Promise.all([
        this.getTypedChecklistResponses(formId, "pre_job"),
        this.getTaskHazardControls(formId),
        this.getFormAttachments(formId),
        this.getFormSignatures(formId),
      ]);

      return {
        checklist_responses: checklistResponses,
        task_hazard_controls: taskHazardControls,
        form_attachments: formAttachments,
        form_signatures: formSignatures,
      };
    } catch (error) {
      errorService.handleError("Failed to get all module data", {
        type: "system",
        severity: "high",
        operation: "ModuleService.getAllModuleData",
        retry: true,
      });
      throw error;
    }
  }

  async getUserModules(): Promise<UserModule[]> {
    try {
      const supabase = supabaseService.getClient();
      if (!supabase) {
        console.log(
          "Supabase client not available, returning empty modules list"
        );
        return [];
      }

      const { data: modules, error } = await supabase
        .from("user_modules")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        throw error;
      }

      return (
        modules?.map((module) => ({
          module_type: module.module_type,
          module_data: module.module_data as ModuleData,
          is_required: module.is_required ?? false,
          display_order: module.display_order ?? 0,
        })) ?? []
      );
    } catch (error) {
      const appError: AppError = {
        type: "system",
        severity: "medium",
        operation: "ModuleService.getUserModules",
        retry: true,
      };
      errorService.handleError("Failed to get user modules", appError);
      return [];
    }
  }

  async getChecklistResponses(
    formId: string
  ): Promise<ModuleOperationResult<Record<string, boolean>>> {
    try {
      const supabase = supabaseService.getClient();
      if (!supabase) {
        return {
          success: false,
          error: "Supabase client not available",
        };
      }

      const { data, error } = await supabase
        .from("checklist_responses")
        .select("responses")
        .eq("form_id", formId)
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data?.responses ?? {},
      };
    } catch (error) {
      const appError: AppError = {
        type: "system",
        severity: "medium",
        operation: "ModuleService.getChecklistResponses",
        retry: true,
      };
      errorService.handleError("Failed to fetch checklist responses", appError);
      return {
        success: false,
        error: "Failed to fetch checklist responses",
      };
    }
  }

  async saveChecklistResponses(
    formId: string,
    responses: Record<string, boolean>
  ): Promise<ModuleOperationResult<void>> {
    try {
      const supabase = supabaseService.getClient();
      if (!supabase) {
        return {
          success: false,
          error: "Supabase client not available",
        };
      }

      const { error } = await supabase.from("checklist_responses").upsert({
        form_id: formId,
        responses: responses,
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      const appError: AppError = {
        type: "system",
        severity: "high",
        operation: "ModuleService.saveChecklistResponses",
        retry: true,
      };
      errorService.handleError("Failed to save checklist responses", appError);
      return {
        success: false,
        error: "Failed to save checklist responses",
      };
    }
  }
}

export const moduleService = ModuleService.getInstance();
