import { GeneralInfoData } from "../types/generalInfo";

export interface FLRADraft {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  data: {
    generalInfo?: GeneralInfoData;
    // Add other modules as needed (checklist, ppe, thc, etc.)
  };
}

const STORAGE_KEY = "flra_drafts";

export class FLRASessionManager {
  static getAllDrafts(): Record<string, FLRADraft> {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  static listDrafts(): FLRADraft[] {
    const drafts = this.getAllDrafts();
    return Object.values(drafts).sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  static loadDraft(id: string): FLRADraft | null {
    const drafts = this.getAllDrafts();
    return drafts[id] || null;
  }

  static saveDraft(id: string, draft: FLRADraft): void {
    const drafts = this.getAllDrafts();
    drafts[id] = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
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
    this.saveDraft(id, draft);
    return draft;
  }

  static deleteDraft(id: string): void {
    const drafts = this.getAllDrafts();
    delete drafts[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  }

  static clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
