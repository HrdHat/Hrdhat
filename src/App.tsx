import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./layout/appshell";
import AppShellMobile from "./layout/appshellmobile";
import HomePage from "./pages/homepage";
import FlraFormPage from "./pages/flraformpage";
import { useIsMobile } from "./hooks/useismobile";
import { initService } from "./services/init.service";

const App: React.FC = () => {
  useEffect(() => {
    initService.initializeApp().catch(console.error);
  }, []);

  const isMobile = useIsMobile();
  const Shell = isMobile ? AppShellMobile : AppShell;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Shell />}>
          <Route index element={<HomePage />} />
          <Route path="flra" element={<FlraFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
