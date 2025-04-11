// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppShell from "./layout/appshell";
import HomePage from "./pages/homepage";
import FLRAFormPage from "./pages/flraformpage";

function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/flra" element={<FLRAFormPage />} />
        </Routes>
      </AppShell>
    </Router>
  );
}

export default App;
