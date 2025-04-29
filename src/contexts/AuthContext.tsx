import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { getSupabase } from "../utils/supabase.init";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    metadata?: { full_name?: string; logo_url?: string }
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: {
    full_name?: string;
    logo_url?: string;
  }) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    // Set initial session and user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    setLoading(false);

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase not initialized");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: {
      full_name?: string;
      logo_url?: string;
    }
  ) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase not initialized");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase not initialized");

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (data: {
    full_name?: string;
    logo_url?: string;
  }) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase not initialized");
    if (!user) throw new Error("No user logged in");

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: data.full_name,
        logo_url: data.logo_url,
      },
    });

    if (error) throw error;
    console.log("[Profile] Update successful for user:", user.id);
  };

  const signInWithGoogle = async () => {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase not initialized");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signInWithApple = async () => {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase not initialized");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        signInWithGoogle,
        signInWithApple,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
