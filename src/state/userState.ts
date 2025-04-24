import type { User, UserPreferences, UserSettings } from "../types/user";

interface UserState {
  user: User | null;
  preferences: UserPreferences;
  settings: UserSettings;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  defaultViewMode: "guided",
  defaultFormType: "flra",
  customModules: [],
  theme: "light",
};

const DEFAULT_SETTINGS: UserSettings = {
  email: "",
  notifications: true,
  language: "en",
};

class UserStateManager {
  private state: UserState;
  private static instance: UserStateManager;

  private constructor() {
    this.state = this.loadFromLocalStorage();
  }

  static getInstance(): UserStateManager {
    if (!UserStateManager.instance) {
      UserStateManager.instance = new UserStateManager();
    }
    return UserStateManager.instance;
  }

  getUser(): User | null {
    return this.state.user;
  }

  getPreferences(): UserPreferences {
    return this.state.preferences;
  }

  getSettings(): UserSettings {
    return this.state.settings;
  }

  setUser(user: User | null): void {
    this.state.user = user;
    if (user) {
      this.state.preferences = { ...DEFAULT_PREFERENCES, ...user.preferences };
      this.state.settings = { ...DEFAULT_SETTINGS, ...user.settings };
    } else {
      this.state.preferences = DEFAULT_PREFERENCES;
      this.state.settings = DEFAULT_SETTINGS;
    }
    this.saveToLocalStorage();
  }

  updatePreferences(prefs: Partial<UserPreferences>): void {
    this.state.preferences = {
      ...this.state.preferences,
      ...prefs,
    };
    if (this.state.user) {
      this.state.user.preferences = this.state.preferences;
    }
    this.saveToLocalStorage();
  }

  updateSettings(settings: Partial<UserSettings>): void {
    this.state.settings = {
      ...this.state.settings,
      ...settings,
    };
    if (this.state.user) {
      this.state.user.settings = this.state.settings;
    }
    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem("userState", JSON.stringify(this.state));
    } catch (error) {
      console.error("Error saving user state to localStorage:", error);
    }
  }

  private loadFromLocalStorage(): UserState {
    try {
      const savedState = localStorage.getItem("userState");
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error("Error loading user state from localStorage:", error);
    }

    return {
      user: null,
      preferences: DEFAULT_PREFERENCES,
      settings: DEFAULT_SETTINGS,
    };
  }
}

export { UserStateManager };
export type { UserState };
