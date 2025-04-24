import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";
import { errorService } from "../services/error.service";

let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;
let isInitialized = false;

export const getSupabase = () => {
  if (!isInitialized) {
    console.warn("Supabase not initialized. Call initializeSupabase first.");
    return null;
  }
  return supabaseInstance;
};

export const initializeSupabase = async (): Promise<boolean> => {
  console.log("🔍 Debug: Available env variables:", {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL
      ? "Found"
      : "Not found",
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
      ? "Found"
      : "Not found",
    MODE: import.meta.env.MODE, // This will show if we're in development/production
  });

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "⚠️ Supabase environment variables missing:",
      !supabaseUrl ? "URL is missing" : "URL is set",
      !supabaseAnonKey ? "Anon key is missing" : "Anon key is set"
    );
    return false;
  }

  try {
    console.log("🔌 Attempting to connect to Supabase...");
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);

    // Test the connection with a simple query
    const { data, error } = await supabaseInstance
      .from("forms")
      .select("count")
      .limit(1);

    if (error) {
      console.error("❌ Supabase connection test failed:", error.message);
      throw error;
    }

    isInitialized = true;
    console.log("✅ Supabase connection test successful!");
    return true;
  } catch (error) {
    console.error("❌ Failed to initialize Supabase:", error);
    supabaseInstance = null;
    isInitialized = false;
    return false;
  }
};

// Helper to check if we're running with Supabase
export const isSupabaseMode = () => isInitialized && supabaseInstance !== null;
