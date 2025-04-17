import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/base.css";

import AppShell from "./layout/appshell";
import HomePage from "./pages/homepage";
import FLRAFormPage from "./pages/flraformpage"; // adjust as needed

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="flra" element={<FLRAFormPage />} />
          {/* Add other pages here */}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
