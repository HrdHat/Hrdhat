import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignUpPage";
import Home from "./pages/homepage";
import AccountSettings from "./pages/AccountSettingsPage";
import FlraForm from "./pages/flraformpage";
import NotFound from "./pages/NotFoundPage";
import AppShell from "./layout/appshell";
import LoggedOutAppShell from "./layout/LoggedOutAppShell";

// Temporary placeholder components
const ActiveForms = () => <div>Active Forms Page (Coming Soon)</div>;
const History = () => <div>History Page (Coming Soon)</div>;

// ProtectedRoute wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <AppShell>{children}</AppShell> : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={<LoggedOutAppShell />} />
        <Route path="/signup" element={<LoggedOutAppShell />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account-settings"
          element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-form"
          element={
            <ProtectedRoute>
              <FlraForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/active-forms"
          element={
            <ProtectedRoute>
              <ActiveForms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
