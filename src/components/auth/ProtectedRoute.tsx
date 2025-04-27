import React from "react";
import { Navigate } from "react-router-dom";
import { supabaseService } from "../../services/supabase.service";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = React.useState<any>(undefined);

  React.useEffect(() => {
    const supabase = supabaseService.getClient();
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        setSession(data.session);
        if (data.session) {
          console.log("[ProtectedRoute] Session detected:", data.session.user);
        } else {
          console.log(
            "[ProtectedRoute] No session, redirecting to /auth/login"
          );
        }
      });
      // Listen for auth state changes
      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          if (session) {
            console.log(
              "[ProtectedRoute] Session changed, user:",
              session.user
            );
          } else {
            console.log(
              "[ProtectedRoute] Session ended, redirecting to /auth/login"
            );
          }
        }
      );
      return () => {
        listener.subscription.unsubscribe();
      };
    }
  }, []);

  if (session === undefined) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
