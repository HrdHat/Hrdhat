import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/base.css"; // ✅ new global styles
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
