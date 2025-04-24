interface UserPreferences {
  defaultViewMode: "guided" | "quickfill" | "print";
  defaultFormType: string;
  customModules: string[];
  theme?: "light" | "dark";
}

interface UserSettings {
  email: string;
  notifications: boolean;
  language: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
  settings: UserSettings;
}

export type { UserPreferences, UserSettings, User };
