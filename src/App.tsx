// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppShell from "./layout/AppShell";
import HomePage from "./pages/HomePage";
import FLRAFormPage from "./pages/FLRAFormPage";

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
