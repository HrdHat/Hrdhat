import { FLRADraft } from "../utils/flrasessionmanager";
import { GeneralInfoData } from "../types/generalInfo";
import { errorService } from "./error.service";

interface VersionedData<T> {
  version: number;
  timestamp: string;
  data: T;
}

interface ConflictResolution<T> {
  resolved: boolean;
  data?: T;
  error?: string;
}

class StateConflictService {
  private static instance: StateConflictService;
  private versions: Map<string, VersionedData<any>> = new Map();
  private static readonly VERSION_KEY = "flra_versions";

  private constructor() {
    this.loadVersions();
  }

  static getInstance(): StateConflictService {
    if (!StateConflictService.instance) {
      StateConflictService.instance = new StateConflictService();
    }
    return StateConflictService.instance;
  }

  private loadVersions(): void {
    try {
      const saved = localStorage.getItem(StateConflictService.VERSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.entries(parsed).forEach(([key, value]) => {
          this.versions.set(key, value as VersionedData<any>);
        });
      }
    } catch (error) {
      errorService.handleError(error, {
        type: "storage",
        severity: "medium",
        operation: "StateConflictService.loadVersions",
      });
    }
  }

  private saveVersions(): void {
    try {
      const versionsObj = Object.fromEntries(this.versions.entries());
      localStorage.setItem(
        StateConflictService.VERSION_KEY,
        JSON.stringify(versionsObj)
      );
    } catch (error) {
      errorService.handleError(error, {
        type: "storage",
        severity: "medium",
        operation: "StateConflictService.saveVersions",
      });
    }
  }

  async checkVersion<T>(key: string, data: T): Promise<ConflictResolution<T>> {
    const current = this.versions.get(key);

    if (!current) {
      // First version of this data
      const versioned: VersionedData<T> = {
        version: 1,
        timestamp: new Date().toISOString(),
        data,
      };
      this.versions.set(key, versioned);
      this.saveVersions();
      return { resolved: true, data };
    }

    // Check if data has changed
    if (JSON.stringify(current.data) === JSON.stringify(data)) {
      return { resolved: true, data };
    }

    // Attempt to auto-merge for FLRADrafts
    if (this.isFLRADraft(data)) {
      const result = await this.resolveFLRAConflict(key, data);
      return result as ConflictResolution<T>;
    }

    // For other data types, manual resolution needed
    return {
      resolved: false,
      error: "Version conflict detected. Manual resolution required.",
    };
  }

  private isFLRADraft(data: any): data is FLRADraft {
    return (
      data &&
      typeof data === "object" &&
      "id" in data &&
      "title" in data &&
      "data" in data
    );
  }

  private async resolveFLRAConflict(
    key: string,
    newDraft: FLRADraft
  ): Promise<ConflictResolution<FLRADraft>> {
    const current = this.versions.get(key) as VersionedData<FLRADraft>;

    try {
      // Ensure we have all required fields from both versions
      const currentGeneralInfo =
        current.data.data.generalInfo || ({} as GeneralInfoData);
      const newGeneralInfo =
        newDraft.data.generalInfo || ({} as GeneralInfoData);

      // Merge strategy: Take the most recent changes for each field
      const merged: FLRADraft = {
        ...newDraft,
        data: {
          ...current.data.data,
          ...newDraft.data,
          generalInfo: {
            projectName:
              newGeneralInfo.projectName ||
              currentGeneralInfo.projectName ||
              "",
            taskLocation:
              newGeneralInfo.taskLocation ||
              currentGeneralInfo.taskLocation ||
              "",
            supervisorName:
              newGeneralInfo.supervisorName ||
              currentGeneralInfo.supervisorName ||
              "",
            supervisorContact:
              newGeneralInfo.supervisorContact ||
              currentGeneralInfo.supervisorContact ||
              "",
            todaysDate:
              newGeneralInfo.todaysDate || currentGeneralInfo.todaysDate || "",
            crewMembers:
              newGeneralInfo.crewMembers ||
              currentGeneralInfo.crewMembers ||
              "",
            todaysTask:
              newGeneralInfo.todaysTask || currentGeneralInfo.todaysTask || "",
            startTime:
              newGeneralInfo.startTime || currentGeneralInfo.startTime || "",
            endTime: newGeneralInfo.endTime || currentGeneralInfo.endTime || "",
          },
        },
        updatedAt: new Date().toISOString(),
      };

      // Update version
      const versioned: VersionedData<FLRADraft> = {
        version: current.version + 1,
        timestamp: merged.updatedAt,
        data: merged,
      };

      this.versions.set(key, versioned);
      this.saveVersions();

      return { resolved: true, data: merged };
    } catch (error) {
      errorService.handleError(error, {
        type: "system",
        severity: "high",
        operation: "StateConflictService.resolveFLRAConflict",
      });

      return {
        resolved: false,
        error: "Failed to auto-resolve conflict",
      };
    }
  }

  getVersion(key: string): number {
    return this.versions.get(key)?.version || 0;
  }

  clearVersion(key: string): void {
    this.versions.delete(key);
    this.saveVersions();
  }

  clearAllVersions(): void {
    this.versions.clear();
    this.saveVersions();
  }
}

export const stateConflictService = StateConflictService.getInstance();
