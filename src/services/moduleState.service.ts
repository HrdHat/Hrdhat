import { ModuleData } from "../types/modules";
import {
  ModuleState,
  ModuleStateConfig,
  ModuleStateUpdate,
  ModuleStateSyncResult,
  ModuleStateSnapshot,
  ModuleFieldState,
  ModuleStateStatus,
} from "../types/moduleState";
import { ModuleErrorType } from "../types/moduleError";

class ModuleStateService {
  private static instance: ModuleStateService;
  private states: Map<string, ModuleState>;
  private history: Map<string, ModuleStateSnapshot[]>;
  private config: ModuleStateConfig;
  private syncTimeout?: NodeJS.Timeout;
  private saveTimeout?: NodeJS.Timeout;

  private constructor() {
    this.states = new Map();
    this.history = new Map();
    this.config = this.getDefaultConfig();
    this.initializeFromStorage();
  }

  public static getInstance(): ModuleStateService {
    if (!ModuleStateService.instance) {
      ModuleStateService.instance = new ModuleStateService();
    }
    return ModuleStateService.instance;
  }

  private getDefaultConfig(): ModuleStateConfig {
    return {
      persistence: {
        storage: "local",
        key: "module_states",
        ttl: 24 * 60 * 60 * 1000, // 24 hours
        version: "1.0.0",
      },
      offline: {
        enabled: true,
        syncInterval: 30000, // 30 seconds
        maxRetries: 3,
        conflictResolution: "client",
        queueSize: 100,
      },
      autoSave: true,
      autoSaveInterval: 5000, // 5 seconds
      keepHistory: true,
      maxHistorySize: 10,
      validateOnChange: true,
    };
  }

  public configure(config: Partial<ModuleStateConfig>): void {
    this.config = { ...this.config, ...config };
    this.setupAutoSync();
    this.setupAutoSave();
  }

  private initializeFromStorage(): void {
    const { storage, key } = this.config.persistence;
    try {
      let storedStates: Record<string, ModuleState> | null = null;

      if (storage === "local") {
        storedStates = JSON.parse(localStorage.getItem(key) || "null");
      } else if (storage === "session") {
        storedStates = JSON.parse(sessionStorage.getItem(key) || "null");
      }

      if (storedStates) {
        Object.entries(storedStates).forEach(([moduleId, state]) => {
          this.states.set(moduleId, state);
        });
      }
    } catch (error) {
      console.error("Error initializing module states:", error);
    }
  }

  private persistStates(): void {
    const { storage, key } = this.config.persistence;
    const states = Object.fromEntries(this.states.entries());

    try {
      const stateJson = JSON.stringify(states);
      if (storage === "local") {
        localStorage.setItem(key, stateJson);
      } else if (storage === "session") {
        sessionStorage.setItem(key, stateJson);
      }
    } catch (error) {
      console.error("Error persisting module states:", error);
    }
  }

  private setupAutoSync(): void {
    if (this.syncTimeout) {
      clearInterval(this.syncTimeout);
    }

    if (this.config.offline.enabled && this.config.offline.syncInterval) {
      this.syncTimeout = setInterval(() => {
        this.syncStates();
      }, this.config.offline.syncInterval);
    }
  }

  private setupAutoSave(): void {
    if (this.saveTimeout) {
      clearInterval(this.saveTimeout);
    }

    if (this.config.autoSave && this.config.autoSaveInterval) {
      this.saveTimeout = setInterval(() => {
        this.persistStates();
      }, this.config.autoSaveInterval);
    }
  }

  public getState(moduleId: string): ModuleState | undefined {
    return this.states.get(moduleId);
  }

  public setState(moduleId: string, update: ModuleStateUpdate): void {
    const currentState = this.states.get(moduleId);
    const newFields: Record<string, ModuleFieldState> = {
      ...currentState?.fields,
    };

    // Handle field updates
    if (update.fields) {
      Object.entries(update.fields).forEach(([fieldId, fieldUpdate]) => {
        newFields[fieldId] = {
          ...newFields[fieldId],
          ...fieldUpdate,
          value: fieldUpdate.value ?? newFields[fieldId]?.value ?? null,
        } as ModuleFieldState;
      });
    }

    const newState: ModuleState = {
      moduleId,
      status: update.status ?? currentState?.status ?? "initial",
      isValid: update.isValid ?? currentState?.isValid ?? true,
      isDirty: update.isDirty ?? currentState?.isDirty ?? false,
      isLoading: update.isLoading ?? currentState?.isLoading ?? false,
      isSaving: update.isSaving ?? currentState?.isSaving ?? false,
      isOffline: update.isOffline ?? currentState?.isOffline ?? false,
      data: update.data ?? currentState?.data,
      fields: newFields,
      errors: update.errors,
      metadata: {
        ...currentState?.metadata,
        ...update.metadata,
        lastModifiedAt: new Date().toISOString(),
      },
    };

    this.states.set(moduleId, newState);

    if (this.config.keepHistory) {
      this.addToHistory(moduleId, newState);
    }

    if (this.config.validateOnChange) {
      this.validateState(moduleId);
    }

    if (this.config.autoSave) {
      this.persistStates();
    }
  }

  private addToHistory(moduleId: string, state: ModuleState): void {
    const moduleHistory = this.history.get(moduleId) || [];
    const snapshot: ModuleStateSnapshot = {
      moduleId,
      timestamp: new Date().toISOString(),
      state: { ...state },
      data: state.data,
    };

    moduleHistory.push(snapshot);

    if (this.config.maxHistorySize) {
      while (moduleHistory.length > this.config.maxHistorySize) {
        moduleHistory.shift();
      }
    }

    this.history.set(moduleId, moduleHistory);
  }

  public getHistory(moduleId: string): ModuleStateSnapshot[] {
    return this.history.get(moduleId) || [];
  }

  public async syncStates(): Promise<ModuleStateSyncResult[]> {
    const results: ModuleStateSyncResult[] = [];

    for (const [moduleId, state] of this.states.entries()) {
      if (state.isDirty) {
        try {
          // TODO: Implement actual sync with backend
          const result: ModuleStateSyncResult = {
            success: true,
            moduleId,
            syncedAt: new Date().toISOString(),
          };

          if (result.success) {
            this.setState(moduleId, {
              moduleId,
              isDirty: false,
              metadata: {
                lastSyncedAt: result.syncedAt,
                offlineChanges: false,
              },
            });
          }

          results.push(result);
        } catch (error) {
          results.push({
            success: false,
            moduleId,
            syncedAt: new Date().toISOString(),
            errors: [
              {
                code: "DATA_ERROR",
                message: "Failed to sync module state",
                moduleId,
                details: error,
              },
            ],
            offlineChanges: true,
          });
        }
      }
    }

    return results;
  }

  private validateState(moduleId: string): void {
    const state = this.states.get(moduleId);
    if (!state) return;

    const errors: ModuleErrorType[] = [];
    let isValid = true;

    // Validate fields
    Object.entries(state.fields).forEach(([fieldId, fieldState]) => {
      if (!fieldState.isValid) {
        isValid = false;
        if (fieldState.errors) {
          errors.push(...fieldState.errors);
        }
      }
    });

    // Update state with validation results
    this.setState(moduleId, {
      moduleId,
      isValid,
      errors: errors.length > 0 ? errors : undefined,
    });
  }

  public clearState(moduleId: string): void {
    this.states.delete(moduleId);
    this.history.delete(moduleId);
    this.persistStates();
  }

  public clearAllStates(): void {
    this.states.clear();
    this.history.clear();
    this.persistStates();
  }

  public destroy(): void {
    if (this.syncTimeout) {
      clearInterval(this.syncTimeout);
    }
    if (this.saveTimeout) {
      clearInterval(this.saveTimeout);
    }
    this.clearAllStates();
  }
}
