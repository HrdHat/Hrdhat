import { ModuleErrorType } from "./moduleError";
import { ModuleData } from "./modules";

export type ModuleStateStatus =
  | "initial"
  | "loading"
  | "loaded"
  | "saving"
  | "saved"
  | "error"
  | "offline";

export interface ModuleStateMetadata {
  lastSyncedAt?: string;
  lastModifiedAt?: string;
  lastModifiedBy?: string;
  offlineChanges?: boolean;
  version?: string;
}

export interface ModuleFieldState {
  value: unknown;
  isDirty: boolean;
  isValid: boolean;
  errors?: ModuleErrorType[];
  lastModified?: string;
}

export interface ModuleState {
  moduleId: string;
  status: ModuleStateStatus;
  isValid: boolean;
  isDirty: boolean;
  isLoading: boolean;
  isSaving: boolean;
  isOffline: boolean;
  data?: ModuleData;
  fields: Record<string, ModuleFieldState>;
  errors?: ModuleErrorType[];
  metadata: ModuleStateMetadata;
}

export interface ModuleStateUpdate {
  moduleId: string;
  status?: ModuleStateStatus;
  isValid?: boolean;
  isDirty?: boolean;
  isLoading?: boolean;
  isSaving?: boolean;
  isOffline?: boolean;
  data?: ModuleData;
  fields?: Record<string, Partial<ModuleFieldState>>;
  errors?: ModuleErrorType[];
  metadata?: Partial<ModuleStateMetadata>;
}

export interface ModuleStateSyncResult {
  success: boolean;
  moduleId: string;
  syncedAt: string;
  errors?: ModuleErrorType[];
  offlineChanges?: boolean;
}

export interface ModuleStateSnapshot {
  moduleId: string;
  timestamp: string;
  state: ModuleState;
  data?: ModuleData;
}

// State persistence configuration
export interface ModuleStatePersistConfig {
  storage: "local" | "session" | "memory";
  key: string;
  ttl?: number; // Time to live in milliseconds
  version?: string;
  encrypt?: boolean;
}

// Offline state configuration
export interface ModuleOfflineConfig {
  enabled: boolean;
  syncInterval?: number; // Milliseconds between sync attempts
  maxRetries?: number;
  conflictResolution?: "client" | "server" | "manual";
  queueSize?: number; // Max number of operations to queue
}

// State management configuration
export interface ModuleStateConfig {
  persistence: ModuleStatePersistConfig;
  offline: ModuleOfflineConfig;
  autoSave?: boolean;
  autoSaveInterval?: number;
  keepHistory?: boolean;
  maxHistorySize?: number;
  validateOnChange?: boolean;
}
