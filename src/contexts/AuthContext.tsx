import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { getSupabase } from "../utils/supabase.init";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: {
    full_name?: string;
    company?: string;
    position_title?: string;
    logo_url?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();

    // If Supabase is not initialized, set loading to false and return
    if (!supabase) {
      console.log("Supabase not initialized, defaulting to logged-out state");
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        console.log(
          "Initial session check:",
          session ? "Session found" : "No session"
        );
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting session:", error);
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log("[Auth] Starting login process for:", email);
    const supabase = getSupabase();
    if (!supabase) {
      console.error("[Auth] Supabase not initialized");
      throw new Error("Supabase not initialized");
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("[Auth] Login error:", error);
      throw error;
    }
    console.log("[Auth] Login successful for:", email);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log("[Auth] Starting signup process for:", email);
    const supabase = getSupabase();
    if (!supabase) {
      console.error("[Auth] Supabase not initialized");
      throw new Error("Supabase not initialized");
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (signUpError) {
      console.error("[Auth] Signup error:", signUpError);
      throw signUpError;
    }
    console.log("[Auth] Signup successful for:", email);
  };

  const signOut = async () => {
    console.log("[Auth] Starting signout process");
    const supabase = getSupabase();
    if (!supabase) {
      console.error("[Auth] Supabase not initialized");
      throw new Error("Supabase not initialized");
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[Auth] Signout error:", error);
      throw error;
    }
    console.log("[Auth] Signout successful");
  };

  const updateProfile = async (data: {
    full_name?: string;
    company?: string;
    position_title?: string;
    logo_url?: string;
  }) => {
    console.log("[Profile] Starting profile update for user:", user?.id);
    const supabase = getSupabase();
    if (!supabase) {
      console.error("[Profile] Supabase not initialized");
      throw new Error("Supabase not initialized");
    }
    if (!user) {
      console.error("[Profile] No user logged in");
      throw new Error("No user logged in");
    }

    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", user.id);

    if (error) {
      console.error("[Profile] Update error:", error);
      throw error;
    }
    console.log("[Profile] Update successful for user:", user.id);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signIn, signUp, signOut, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
