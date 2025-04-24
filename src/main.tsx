import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/base.css";

import AppShell from "./layout/appshell";
import AppShellMobile from "./layout/appshellmobile"; // ✅ Make sure this exists
import HomePage from "./pages/homepage";
import FLRAFormPage from "./pages/flraformpage";
import { initializeSupabase } from "./utils/supabase.init";
import { useIsMobile } from "./hooks/useismobile";

// Initialize Supabase in the background
initializeSupabase().then((success) => {
  if (success) {
    console.log("Supabase initialized successfully");
  } else {
    console.log("Running in local-only mode");
  }
});

function AppRouter() {
  const isMobile = useIsMobile();

  const Shell = isMobile ? AppShellMobile : AppShell;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Shell />}>
          <Route index element={<HomePage />} />
          <Route path="flra" element={<FLRAFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
