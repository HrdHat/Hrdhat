import type { SupabaseConfig } from "../services/supabase.service";

const supabaseConfig: SupabaseConfig = {
  url: process.env.REACT_APP_SUPABASE_URL || "",
  anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || "",
  storage: {
    bucket: "flra-pdfs",
    folder: "forms",
  },
};

export default supabaseConfig;
