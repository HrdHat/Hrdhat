import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Using local-only mode.");
}

export const supabase = createClient(
  supabaseUrl || "http://localhost:54321",
  supabaseAnonKey || "local-only-mode"
);

export async function initSupabase() {
  const isLocalOnly = !supabaseUrl || !supabaseAnonKey;

  if (isLocalOnly) {
    console.warn("[Supabase] Running in local-only mode");
    return { isLocalOnly: true };
  }

  // Test the connection
  try {
    await supabase
      .from("profiles")
      .select("count", { count: "exact", head: true });
    console.log("[Supabase] Connection test successful");
  } catch (error) {
    console.error(
      "[Supabase] Connection test failed:",
      error instanceof Error ? error.message : String(error)
    );
  }

  return { isLocalOnly: false };
}
