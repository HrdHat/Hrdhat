import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import FlraFormPage from "./pages/flraformpage"; // ⬅️ Add this import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flra" element={<FlraFormPage />} />{" "}
        {/* ⬅️ Add this route */}
      </Routes>
    </Router>
  );
}

export default App;
