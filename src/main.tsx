import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { initializeSupabase } from "./utils/supabase.init";
import "./styles/base.css";

// Create root element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = createRoot(rootElement);

// Initialize app
const initApp = async () => {
  try {
    const success = await initializeSupabase();
    if (!success) {
      console.warn("[Supabase] Running in local-only mode");
    } else {
      console.log("[Supabase] Connection test successful");
    }

    // Render app
    root.render(
      <StrictMode>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </StrictMode>
    );
  } catch (error) {
    console.error("[App] Failed to initialize:", error);
  }
};

// Start the app
initApp();
