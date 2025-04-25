import { supabaseService } from "./supabase.service";
import { errorService } from "./error.service";

class InitializationService {
  private static instance: InitializationService;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): InitializationService {
    if (!InitializationService.instance) {
      InitializationService.instance = new InitializationService();
    }
    return InitializationService.instance;
  }

  async initializeApp(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Try to initialize Supabase if environment variables are available
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        await supabaseService.initialize({
          url: supabaseUrl,
          anonKey: supabaseKey,
        });
      } else {
        console.warn("Supabase credentials not found, running in offline mode");
      }

      this.isInitialized = true;
    } catch (error) {
      await errorService.handleError(error, {
        type: "system",
        severity: "high",
        operation: "InitializationService.initializeApp",
        retry: false,
      });
      console.warn("Failed to initialize Supabase, running in offline mode");
    }
  }
}

export const initService = InitializationService.getInstance();
